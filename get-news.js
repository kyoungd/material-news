// const yahooFinanceNews = require('yahoo-finance-news');
const yahooFinanceNews = require('./YahooFinanceNews');
const googleNewsScraper = require('google-news-scraper')
const util = require('util');
const moment = require('moment');
const DBClient = require('./dbClient');
const axios = require('axios');
const { Sentiment } = require('./get-sentiment');
const { Util, KEYWORD } = require('./constants');
const DbSetup = require('./news-db');
const RedisHash = require('./redisHash');
const NewsSummary = require('./news-summary');
const logger = require('./logger');

class NewsFromWeb {
    constructor(searchSymbols) {
        // this.symbols = symbols;
        this.searchSymbols = searchSymbols;
        this.articles = [];
        this.prisma = DBClient.getInstance().prisma;
        this.isRunning = false;
    }

    get symbolsString() {
        let symbols = '';
        for (const item of this.searchSymbols) {
            symbols += item.symbol + ',';
        }
        return symbols.length > 0 ? symbols.substring(0, symbols.length - 1) : symbols;
    }

    timeAgo(symbol) {
        const oneDateTime = this.searchSymbols.find(item => item.symbol === symbol).last_update;
        return oneDateTime;
    }

    push(article) {
        const createdAt = new Date(article.pub_date);
        if (createdAt >= this.timeAgo(article.symbol))
            this.articles.push(article);
    }

    async isDuplicateNews(article) {
        try {
            const oneDate = new Date(article.pub_date);
            const foundit = await this.prisma[article.type].findFirst({
                where: {
                    link: article.link
                }
            });
            const result = (foundit === null ? false : true);
            return result;
        }
        catch (e) {
            logger.error(e);
            logger.error(e.stack);
            return true;
        }
    }

    newsItem(article) {
        const oneDate = new Date(article.pub_date);
        let value = {
            symbol: article.symbol,
            description: article.description,
            link: article.link,
            pub_date: oneDate,
            title: article.title,
            sentiment: article.hasOwnProperty('sentiment') ? article.sentiment : 0,
        }
        return value;
    }

    async saveAllNewsToDb(news = null) {
        if (news === null)
            news = this.articles;
        for (var idx = 0; idx < news.length; idx++) {
            const article = news[idx];
            if (article.symbol && article.link && article.title && article.pub_date) {
                const isdup = await this.isDuplicateNews(article);
                try {
                    if (!isdup) {
                        const value = this.newsItem(article);
                        await this.prisma[article.type].create({ data: value });
                    }
                }
                catch (e) {
                    logger.debug(article);
                    logger.error(e);
                    logger.error(e.stack);
                }
            }
        }
    }

    async review_search(symbol) {
        this.prisma.company.update({
            where: { symbol: symbol },
            data: { review_search: true },
        })
    }

    async testResetNewsSymbol() {
        const news = await this.prisma.news_symbol.findMany({});
        for (const item of news) {
            const today = Util.getDateOnly();
            await this.prisma.news_symbol.update({
                where: { id: item.id },
                data: {
                    last_update: today,
                    pub_date: today
                }
            });
        }
    }

}

class YahooNews {
    constructor(newsFromWeb) {
        this.newsFromWeb = newsFromWeb;
    }

    getYahooNews(data) {
        for (const item of data) {
            for (const news of item.items) {
                const article = {
                    type: "site_yahoo",
                    symbol: item.symbol,
                    title: news.title,
                    description: news.description,
                    link: news.link,
                    pub_date: Util.ourDateTime(new Date(news.date)),
                    timezone: "-8:00"
                }
                this.newsFromWeb.push(article);
            }
        }
    }

    async GetYahooFinanceNews(symbols) {
        try {
            const promiseGetYahooFinaceNews = util.promisify(yahooFinanceNews.get);
            const jsonData = await promiseGetYahooFinaceNews(symbols);
            console.log(jsonData);
        }
        catch (str) {
            try {
                const data = JSON.parse(str);
                this.getYahooNews(data);
            } catch (e) {
                logger.error(e);
                logger.error(e.stack);
            }
        }
    }

    async run() {
        try {
            const symbols = this.newsFromWeb.searchSymbols;
            let symbolList = '';
            for (let idx = 0; idx < symbols.length; idx++) {
                const symbol = symbols[idx].symbol;
                symbolList += symbol + ((idx + 1) % 10 == 0 || (idx + 1) >= symbols.length ? '' : ',');
                if ((idx + 1) % 10 == 0) {
                    await this.GetYahooFinanceNews(symbolList);
                    symbolList = '';
                }
            }
            if (symbolList.length > 0) {
                await this.GetYahooFinanceNews(symbolList);
            }
        } catch (e) {
            logger.error(e);
            logger.error(e.stack);
        }
    }

}

class GoogleNews {
    constructor(newsFromWeb) {
        this.newsFromWeb = newsFromWeb;
    }

    // const timeframe = "1h";         // h = hours, d=days, m=years, y=years: 10h, 5d
    async GetGoogleNews(symbol, timeframe) {
        // Execute within an async function, pass a config object (further documentation below)
        const news = await googleNewsScraper({
            searchTerm: symbol,
            prettyURLs: false,
            queryVars: {
                hl: "en-US",
                gl: "US",
                ceid: "US:en"
            },
            timeframe: timeframe,
            puppeteerArgs: []
        });
        for (const article of news) {
            const item = {
                type: "site_google",
                symbol: symbol,
                title: article.title,
                description: article.subtitle,
                link: article.link,
                pub_date: Util.googleTimeAgo(article.time),
                timezone: "-8:00"
            }
            this.newsFromWeb.push(item);
        }
    }

    async run() {
        try {
            for (const item of this.newsFromWeb.searchSymbols) {
                await this.GetGoogleNews(item.symbol, "1d");
            }
            // const fns = this.newsFromWeb.searchSymbols.map(async item => await this.GetGoogleNews(item.symbol, "1d"));
            return true;
            // const fns = this.newsFromWeb.searchSymbols.map(item => this.GetGoogleNews(item.symbol, "1d"));
            // await Promise.all(fns);
            // return true;
        } catch (e) {
            logger.error(e);
            logger.error(e.stack);
            return false;
        }
    }

}

class TwitterNews {
    constructor(newsFromWeb) {
        this.newsFromWeb = newsFromWeb;
    }

    async getTwitterNews(item) {
        const symbol = item.symbol;
        const url = KEYWORD.URL_TWEETS;
        const data = {
            "messages": [
                {
                    "key": "TWEETS_GET",
                    "value": {
                        "symbol": symbol,
                        // "from_dt": Util.ourDateTime(this.newsFromWeb.timeAgo(item.last_update))
                        "from_dt": Util.ourDateTime(item.last_update)
                    }
                }]
        }
        try {
            const results = await axios.post(url, data);
            for (const article of results.data) {
                const item = {
                    type: "site_twitter",
                    symbol: symbol,
                    title: article.likes + " likes",
                    description: article.text,
                    link: article.link,
                    pub_date: article.created,
                    timezone: "-8:00"
                }
                this.newsFromWeb.push(item);
            }
            return results;
        }
        catch (e) {
            logger.error(e);
            logger.error(e.stack);
            return [];
        }
    }

    async run() {
        for (const item of this.newsFromWeb.searchSymbols) {
            logger.info(item.symbol);
            const result = await this.getTwitterNews(item);
            if (result.data.length >= KEYWORD.TWEET_MAX_COUNT) {
                this.newsFromWeb.review_search(item.symbol);
            }
        }
        // const fns = this.newsFromWeb.searchSymbols.map(item => this.getTwitterNews(item.symbol));
        // await Promise.all(fns);
    }

}

class AllNews {
    constructor(searchSymbols) {
        this.newsFromWeb = new NewsFromWeb(searchSymbols);
        this.isRunning = false;
    }

    // singleton pattern
    static getInstance(searchSymbols) {
        if (!this.instance) {
            this.instance = new AllNews(searchSymbols);
        }
        return this.instance;
    }

    async getNews() {
        const TweetNews = new TwitterNews(this.newsFromWeb);
        await TweetNews.run();
        const yahooNews = new YahooNews(this.newsFromWeb);
        await yahooNews.run();
        const googNews = new GoogleNews(this.newsFromWeb);
        await googNews.run();
        await this.newsFromWeb.saveAllNewsToDb();
    }

    async getSentiments() {
        const sentiment = Sentiment.instance;
        await sentiment.run();
    }

    async run() {
        try {
            if (!this.isRunning) {
                this.isRunning = true;
                await this.getNews();
                await this.getSentiments();
                // const TweetNews = new TwitterNews(this.newsFromWeb);
                // await TweetNews.run();
                // const yahooNews = new YahooNews(this.newsFromWeb);
                // await yahooNews.run();
                // const googNews = new GoogleNews(this.newsFromWeb);
                // await googNews.run();
                // await this.newsFromWeb.saveAllNewsToDb();
                // const sentiment = Sentiment.instance;
                // await sentiment.run();
                this.isRunning = false;
                return true;
            }
        } catch (e) {
            logger.error(e);
            logger.error(e.stack);
            this.isRunning = false;
            return false;
        }
    }

}

let searchAllNewsIstanceRunning = false;

const SearchAllNews = async (searchSymbols = null) => {
    try {
        if (searchAllNewsIstanceRunning) {
            logger.warn('searchAllNewsIstanceRunning --- skip')
            return;
        }
        logger.info('SearchAllNews - Start 5 ');
        searchAllNewsIstanceRunning = true;
        const db = new DbSetup();
        if (searchSymbols === null)
            searchSymbols = await db.getNewsSymbols();
        if (searchSymbols && searchSymbols.length > 0) {
            const today = new Date();
            const news = AllNews.getInstance(searchSymbols);
            await news.run();
            for (let idx = 0; idx < searchSymbols.length; ++idx) {
                const entry = searchSymbols[idx];
                await db.touchSymbol(entry.symbol, today);
            }
        }
        searchAllNewsIstanceRunning = false;
        logger.info('SearchAllNews - End')
    } catch (e) {
        searchAllNewsIstanceRunning = false;
        logger.error(e);
        logger.error(e.stack);
    }
}

const SummarizeNewsAndSave = async (timeAgo) => {
    const redisNews = new RedisHash(KEYWORD.NEWS_SEARCH);
    const field = Util.newsHashFieldName(timeAgo);
    const news = new NewsSummary();
    const scores = await news.GetScoreAll(timeAgo);
    redisNews.set(field, scores);
}

const SummarizeNewsToRedis = async () => {
    await SummarizeNewsAndSave("30 minutes ago");
    await SummarizeNewsAndSave("1 hour ago");
    await SummarizeNewsAndSave("2 hours ago");
    await SummarizeNewsAndSave("4 hours ago");
    await SummarizeNewsAndSave("1 day ago");
    await SummarizeNewsAndSave("3 day ago");
}

module.exports = { AllNews, NewsFromWeb, YahooNews, GoogleNews, TwitterNews, SearchAllNews, SummarizeNewsToRedis };
