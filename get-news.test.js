const request = require('supertest');
const DbSetup = require('./news-db');

describe('Todo', () => {
    let db;
    let symbol1;
    let symbol2;
    let symbol3;

    beforeAll(() => {
        // ...
        // RUN ONCE - SETUP
        try {
            symbol1 = 'TSLA';
            symbol2 = 'AAPL';
            symbol3 = 'GOOGL';
            db = new DbSetup();
        }
        catch (err) {
            console.log(err);
        }
    })

    beforeEach(async () => {
    })

    it('should test news-setup.DbSetup.addSymbol', async () => {
        await db.addSymbol(symbol1);
        const result = await db.getSymbol(symbol1);
        expect(result.symbol).toBe(symbol1);
    })

    it('should test news-setup.DbSetup.getFirstTimeNewsSymbols', async () => {
        await db.flushSymbols();
        await db.addSymbol(symbol1);
        await db.addSymbol(symbol2);
        await db.addSymbol(symbol3);
        await db.touchSymbol(symbol1, new Date());
        const result = await db.getFirstTimeNewsSymbols();
        expect(result.length).toBe(2);
    })

    it('should test news-setup.DbSetup.getOtherTimeNewsSymbols', async () => {
        await db.flushSymbols();
        await db.addSymbol(symbol1);
        await db.addSymbol(symbol2);
        await db.addSymbol(symbol3);
        await db.touchSymbol(symbol1, new Date());
        const result = await db.getOtherTimeNewsSymbols();
        expect(result.length).toBe(1);
    })

    it('should app /flushall POST', async () => {
    })

    it('should test get_news.YahooNews()', async () => {
        // const mock = jest.fn().mockReturnValue(Promise.resolve({
    })

    it('should test get_news.GoogleNews()', async () => {
    })

    it('should test get_news.TwitterNews()', async () => {
    })

    it('should test get_news.AllNews()', async () => {
    })

})
