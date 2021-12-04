const moment = require('moment');
const DBClient = require('./dbClient');
const { Util, KEYWORD } = require('./constants');
const logger = require('./logger');

class NewsSummary {

    constructor() {
        this.prisma = DBClient.getInstance().prisma;
    }

    SplitSymbols(symbols) {
        try {
            const symbolEach = symbols.split(',');
            return symbolEach;
        }
        catch { }
        try {
            const symBolEach = symbols.map(x => x.symbol);
            return symBolEach;
        }
        catch { }
        return [];
    }

    async GetScore(tableName, symbols, timeAgo) {
        const symbolEach = this.SplitSymbols(symbols);
        const oneDate = Util.googleTimeAgo(timeAgo);
        const results = [];
        for (let i = 0; i < symbolEach.length; i++) {
            try {
                const symbol = symbolEach[i];
                const score = await this.prisma[tableName].aggregate({
                    _avg: {
                        sentiment: true,
                    },
                    _count: {
                        sentiment: true,
                    },
                    where: {
                        pub_date: {
                            gte: oneDate,
                        },
                        symbol: symbol
                    }
                });
                const avgScore = score._avg.sentiment ? score._avg.sentiment : 0;
                const result = { symbol, sentiment: Math.round(avgScore * 100), count: score._count.sentiment }
                results.push(result);
            }
            catch (e) {
                logger.error(e);
                logger.error(e.stack);
            }
        }
        return results;
    }

    async GetSymbols() {
        const today = moment();
        const symbols = await this.prisma[KEYWORD.NEWS_SYMBOL].findMany({
            where: {
                pub_date: {
                    gte: new Date(today.year(), today.month(), today.day()),
                }
            },
            select: {
                symbol: true,
            }
        });
        return symbols;
    }

    combineSentiments(symbols, yahoo, twitter, google) {
        for (let i = 0; i < symbols.length; i++) {
            const item = symbols[i];
            const yahooItem = yahoo.find(x => x.symbol === item.symbol);
            const twitterItem = twitter.find(x => x.symbol === item.symbol);
            const googleItem = google.find(x => x.symbol === item.symbol);
            if (yahooItem) {
                item.yahoo = yahooItem || [];
            }
            if (twitterItem) {
                item.twitter = twitterItem || [];
            }
            if (googleItem) {
                item.google = googleItem || [];
            }
            const sentiment = (yahooItem.sentiment + twitterItem.sentiment + googleItem.sentiment) / 3;
            const count = yahooItem.count + twitterItem.count + googleItem.count;
            item.sentiment = sentiment;
            item.count = count;
        }
    }

    async GetScoreAll(timeAgo, symbols = null) {
        if (symbols === null)
            symbols = await this.GetSymbols();
        const yahoo = await this.GetScore(KEYWORD.SITE_YAHOO, symbols, timeAgo);
        const twitter = await this.GetScore(KEYWORD.SITE_TWITTER, symbols, timeAgo);
        const google = await this.GetScore(KEYWORD.SITE_GOOGLE, symbols, timeAgo);
        this.combineSentiments(symbols, yahoo, twitter, google);
        return symbols;
        // const result = { yahoo, twitter, google };
        // return result;
    }

}

module.exports = NewsSummary;
