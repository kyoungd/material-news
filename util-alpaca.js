const Alpaca = require('@alpacahq/alpaca-trade-api')
const moment = require('moment');
const { Util, KEYWORD } = require('./constants');
const logger = require('./logger');
const DBClient = require('./dbClient');

class UtilAlpaca {
    constructor(searchSymbols) {
        // this.symbols = symbols;
        this.prisma = DBClient.getInstance().prisma;
        this.isRunning = false;
        this.alpaca = new Alpaca({
            keyId: 'AKAV2Z5H0NJNXYF7K24D',
            secretKey: '262cAEeIRrL1KEZYKSTjZA79tj25XWrMtvz0Bezu',
            paper: false,
        })
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

    async save(assets) {
        activeAssets = await this.alpaca.getAssets({ status: 'active' });
        const nasdaqAssets = activeAssets.filter(asset => asset.exchange == 'NASDAQ');
        const createMany = await this.prisma.company.createMany({
            data: nasdaqAssets,
            skipDuplicates: true, // Skip 'Bobo'
        })
    }

    run() {
        this.alpaca.getAssets({
            status: 'active'
        }).then((activeAssets) => {
            // Filter the assets down to just those on NASDAQ.
            const nasdaqAssets = activeAssets.filter(asset => asset.exchange == 'NASDAQ')
            this.prisma.company.createMany({
                data: nasdaqAssets,
                skipDuplicates: true, // Skip 'Bobo'
            }).then(() => {
                console.log('save to database - complete');
            }).catch(e => {
                console.log(e);
            })
            console.log('save to database - start');
        }).catch(e => {
            console.log(e);
        })
    }

}

const conn = new UtilAlpaca();
conn.run();
