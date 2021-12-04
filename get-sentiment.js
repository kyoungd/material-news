const axios = require('axios');
const DBClient = require('./dbClient');
const { NewsTable } = require('./constants');
const { Util, KEYWORD } = require('./constants');
const logger = require('./logger');

class Sentiment {
    constructor() {
        this.prisma = DBClient.getInstance().prisma;
        this.isRunning = false;
    }

    // singleton pattern
    static get instance() {
        if (!this[Symbol.for('instance')]) {
            this[Symbol.for('instance')] = new Sentiment();
        }
        return this[Symbol.for('instance')];
    }

    async getSentiment(textdata) {
        try {
            const url = KEYWORD.URL_SENTIMENT_ANALSYS;
            const bodyJson = { text: textdata }
            const result = await axios.post(url, bodyJson);
            const sentiment = result.data.reduce((acc, cur) => {  // get the first one
                return acc + cur.sentiment_score;
            }, 0) / result.data.length; // get the average of all sentiment values in the array result.data 
            return sentiment;
        }
        catch (e) {
            logger.error(e)
            logger.error(e.stack);
            return 0;
        }
    }

    async getNewsFromTable(media) {
        try {
            const today = Util.getDateOnly();
            const tableName = NewsTable[media];
            const news = await this.prisma[tableName].findMany({
                where: {
                    sentiment: 0,
                    pub_date: {
                        gte: today
                    }
                },
                take: KEYWORD.NEWS_SENTIMENT_COUNT,
            });
            return news;
        } catch (e) {
            logger.error(e);
            logger.error(e.stack);
            return [];
        }

    }

    async getSentimentList(news) {
        try {
            const sentimentList = [];
            for (let idx = 0; idx < news.length; idx++) {
                const article = news[idx];
                const text = article.title + '. ' + article.description;
                const sentiment = await this.getSentiment(text);
                sentimentList.push({
                    id: article.id,
                    sentiment: sentiment,
                });
            }
            return sentimentList;
        } catch (e) {
            logger.error(e);
            logger.error(e.stack);
            return [];
        }
    }

    async saveSentimentList(media, sentimentList) {
        const tableName = NewsTable[media];
        for (let idx = 0; idx < sentimentList.length; idx++) {
            try {
                const item = sentimentList[idx];
                await this.prisma[tableName].update({
                    where: { id: item.id },
                    data: { sentiment: item.sentiment }
                });
            } catch (e) {
                logger.error(e);
                logger.error(e.stack);
            }
        }
    }

    async getSentimentFromDB(media) {
        const news = await this.getNewsFromTable(media);
        const sentimentList = await this.getSentimentList(news);
        await this.saveSentimentList(media, sentimentList);
    }

    async run() {
        if (!this.isRunning) {
            this.isRunning = true;
            await this.getSentimentFromDB("YAHOO");
            await this.getSentimentFromDB("TWITTER");
            await this.getSentimentFromDB("GOOGLE");
            this.isRunning = false;
        }
    }

}


module.exports = { Sentiment }
