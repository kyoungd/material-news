const DBClient = require('./dbClient');
const { Util, KEYWORD } = require('./constants');
const logger = require('./logger');

class ReadNews {
    constructor() {
        this.prisma = DBClient.getInstance().prisma;
        this.yahoo = this.prisma[KEYWORD.SITE_YAHOO];
        this.google = this.prisma[KEYWORD.SITE_GOOGLE];
        this.twitter = this.prisma[KEYWORD.SITE_TWITTER];
    }

    async getNews(symbol, page, limit) {
        try {
            const today = Util.getDateOnly();
            const yahoos = await this.yahoo.findMany({
                where: {
                    symbol: symbol,
                    pub_date: {
                        gte: today,
                    }
                }
            });
            const googles = await this.google.findMany({
                where: {
                    symbol: symbol,
                    pub_date: {
                        gte: today,
                    }
                }
            });
            const twitters = await this.twitter.findMany({
                where: {
                    symbol: symbol,
                    pub_date: {
                        gte: today,
                    }
                }
            });
            const data = { yahoos, googles, twitters };
            return data;
        }
        catch (e) {
            logger.error(e);
            logger.error(e.stack);
            return [];
        }
    }

}

module.exports = ReadNews;
