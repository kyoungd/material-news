const moment = require('moment');
const DBClient = require('./dbClient');
const { Util, KEYWORD } = require('./constants');
const logger = require('./logger');

class DbSetup {

    constructor() {
        this.prisma = DBClient.getInstance().prisma;
        this.tableName = KEYWORD.NEWS_SYMBOL;
        this.table = this.prisma[this.tableName];
    }

    async isSymbolExist(symbol) {
        try {
            const foundit = await this.table.findFirst({
                where: { symbol }
            });
            const result = (foundit === null ? false : true);
            return result;
        }
        catch (e) {
            logger.error(e); logger.error(e.stack);
            return true;
        }
    }

    async addSymbol(symbol) {
        if (await this.isSymbolExist(symbol))
            return false;
        try {
            const today = Util.getDateOnly();
            let value = {
                symbol,
                pub_date: today.toISOString(),
                last_update: today.toISOString(),
            }
            const result = await this.table.create({ data: value });
            return result;
        }
        catch (e) {
            logger.error(e); logger.error(e.stack);
            return false;
        }
    }

    async getNewsSymbols() {
        try {
            const today = Util.getDateOnly();
            const result = await this.table.findMany({
                select: {
                    symbol: true,
                    last_update: true,
                    search: {
                        select: {
                            search_term: true,
                        }
                    }
                },
                where: {
                    pub_date: {
                        gte: today
                    }
                }
            });
            return result;
        }
        catch (e) {
            logger.error(e); logger.error(e.stack);
            return [];
        }
    }

    async getSymbol(symbol) {
        const result = await this.table.findFirst({
            where: { symbol }
        });
        return result;
    }

    async getFirstTimeNewsSymbols() {
        try {
            const today = Util.getDateOnly();
            const result = await this.table.findMany({
                where: {
                    last_update: today.toISOString(),
                },
                select: {
                    symbol: true,
                }
            });
            return result;
        }
        catch (e) {
            logger.error(e); logger.error(e.stack);
            return [];
        }
    }

    async getOtherTimeNewsSymbols() {
        try {
            const today = Util.getDateOnly();
            const result = await this.table.findMany({
                where: {
                    last_update: { not: today },

                },
                select: {
                    symbol: true,
                }
            });
            return result;
        }
        catch (e) {
            logger.error(e); logger.error(e.stack);
            return [];
        }
    }

    async touchSymbol(symbol, oneDate = (new Date())) {
        try {
            await this.table.update({
                data: {
                    last_update: oneDate,
                },
                where: {
                    symbol,
                },
            })
            return true;
        }
        catch (e) {
            logger.error(e); logger.error(e.stack);
            return [];
        }
    }

    async flushSymbols() {
        try {
            await this.prisma.news_symbol.deleteMany({});
        }
        catch (e) {
            logger.error(e); logger.error(e.stack);
            return [];
        }
    }

    async flushDb() {
        try {
            await this.prisma.news_symbol.deleteMany({});
            await this.prisma.site_yahoo.deleteMany({});
            await this.prisma.site_google.deleteMany({});
            await this.prisma.site_twitter.deleteMany({});
        }
        catch (e) {
            logger.error(e); logger.error(e.stack);
            return [];
        }
    }

}

module.exports = DbSetup;
