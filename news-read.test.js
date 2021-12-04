const request = require('supertest');
const DbSetup = require('./news-db');
const ReadNews = require('./news-read');
const { KEYWORD } = require('./constants');
const { NewsFromWeb } = require('./get-news');
const app = require('./index');

describe('Todo', () => {
    let db;
    let news;
    let symbol1;
    let symbol2;
    let symbol3;
    let newsList1 = [];
    let newsList2 = [];
    let newsList3 = [];

    const newsItem = (type, symbol, description, link, pub_date, title, sentiment) => {
        const news1 = {
            type, symbol, description, link, pub_date, title, sentiment,
        }
        return news1;
    }

    beforeAll(() => {
        // ...
        // RUN ONCE - SETUP
        try {
            symbol1 = 'TSLA';
            symbol2 = 'AAPL';
            symbol3 = 'GOOG';
            db = new DbSetup();
            news = new ReadNews();
            now = new Date();
            newsList1.push(newsItem(KEYWORD.SITE_YAHOO, symbol1, "description-1", "http://www.tsla.com", now - 1, "title-1", 0));
            newsList2.push(newsItem(KEYWORD.SITE_YAHOO, symbol2, "description-2", "http://www.tsla.com", now - 2, "title-2", 0));
            newsList3.push(newsItem(KEYWORD.SITE_YAHOO, symbol3, "description-3", "http://www.tsla.com", now - 3, "title-3", 0));
            newsList1.push(newsItem(KEYWORD.SITE_YAHOO, symbol1, "description-1", "http://www.aapl.com", now - 4, "title-1", 0));
            newsList2.push(newsItem(KEYWORD.SITE_YAHOO, symbol2, "description-2", "http://www.aapl.com", now - 5, "title-2", 0));
            newsList3.push(newsItem(KEYWORD.SITE_YAHOO, symbol3, "description-3", "http://www.aapl.com", now - 6, "title-3", 0));
            newsList1.push(newsItem(KEYWORD.SITE_YAHOO, symbol1, "description-1", "http://www.goog.com", now - 7, "title-1", 0));
            newsList2.push(newsItem(KEYWORD.SITE_YAHOO, symbol2, "description-2", "http://www.goog.com", now - 8, "title-2", 0));
            newsList3.push(newsItem(KEYWORD.SITE_YAHOO, symbol3, "description-3", "http://www.goog.com", now - 9, "title-3", 0));
            newsList1.push(newsItem(KEYWORD.SITE_GOOGLE, symbol1, "description-1", "http://www.tsla.com", now - 10, "title-1", 0));
            newsList2.push(newsItem(KEYWORD.SITE_GOOGLE, symbol2, "description-2", "http://www.tsla.com", now - 11, "title-2", 0));
            newsList3.push(newsItem(KEYWORD.SITE_GOOGLE, symbol3, "description-3", "http://www.tsla.com", now - 12, "title-3", 0));
            newsList1.push(newsItem(KEYWORD.SITE_GOOGLE, symbol1, "description-1", "http://www.aapl.com", now - 13, "title-1", 0));
            newsList2.push(newsItem(KEYWORD.SITE_GOOGLE, symbol2, "description-2", "http://www.aapl.com", now - 14, "title-2", 0));
            newsList3.push(newsItem(KEYWORD.SITE_GOOGLE, symbol3, "description-3", "http://www.aapl.com", now - 15, "title-3", 0));
            newsList1.push(newsItem(KEYWORD.SITE_GOOGLE, symbol1, "description-1", "http://www.goog.com", now - 16, "title-1", 0));
            newsList2.push(newsItem(KEYWORD.SITE_GOOGLE, symbol2, "description-2", "http://www.goog.com", now - 17, "title-2", 0));
            newsList3.push(newsItem(KEYWORD.SITE_GOOGLE, symbol3, "description-3", "http://www.goog.com", now - 18, "title-3", 0));
            newsList1.push(newsItem(KEYWORD.SITE_TWITTER, symbol1, "description-1", "http://www.tsla.com", now - 19, "title-1", 0));
            newsList2.push(newsItem(KEYWORD.SITE_TWITTER, symbol2, "description-2", "http://www.tsla.com", now - 20, "title-2", 0));
            newsList3.push(newsItem(KEYWORD.SITE_TWITTER, symbol3, "description-3", "http://www.tsla.com", now - 21, "title-3", 0));
            newsList1.push(newsItem(KEYWORD.SITE_TWITTER, symbol1, "description-1", "http://www.aapl.com", now - 22, "title-1", 0));
            newsList2.push(newsItem(KEYWORD.SITE_TWITTER, symbol2, "description-2", "http://www.aapl.com", now - 23, "title-2", 0));
            newsList3.push(newsItem(KEYWORD.SITE_TWITTER, symbol3, "description-3", "http://www.aapl.com", now - 24, "title-3", 0));
            newsList1.push(newsItem(KEYWORD.SITE_TWITTER, symbol1, "description-1", "http://www.goog.com", now - 25, "title-1", 0));
            newsList2.push(newsItem(KEYWORD.SITE_TWITTER, symbol2, "description-2", "http://www.goog.com", now - 26, "title-2", 0));
            newsList3.push(newsItem(KEYWORD.SITE_TWITTER, symbol3, "description-3", "http://www.goog.com", now - 27, "title-3", 0));
        }
        catch (err) {
            console.log(err);
        }
    })

    beforeEach(async () => {
        await db.flushDb();
        await db.addSymbol(symbol1);
        await db.addSymbol(symbol2);
        await db.addSymbol(symbol3);
        const timeAgo = new Date() - (30 * 60 * 1000);
        db1 = new NewsFromWeb([
            { symbol: symbol1, timeAgo },
            { symbol: symbol2, timeAgo },
            { symbol: symbol3, timeAgo },
        ]);
        await db1.saveAllNewsToDb(newsList1);
        // await db2.saveAllNewsToDb(newsList1);
        // await db3.saveAllNewsToDb(newsList1);
    })

    it('read news news-read.getMews() ', async () => {
        try {
            const result1 = await news.getNews(symbol1, null, null);
            const result2 = await news.getNews(symbol2, null, null);
            const result3 = await news.getNews(symbol3, null, null);
            expect(result1).toBeDefined();
            expect(result2).toBeDefined();
            expect(result3).toBeDefined();
            expect(result1.googles.length).toBe(3);
            expect(result1.twitters.length).toBe(3);
            expect(result1.yahoos.length).toBe(3);
            expect(result1.yahoos[0].symbol).toBe(symbol1);
            expect(result1.googles[0].symbol).toBe(symbol1);
            expect(result1.twitters[0].symbol).toBe(symbol1);
        }
        catch (err) {
            console.log(err);
        }
    })

    it('read news /news GET', async () => {
        const result = await request(app)
            .get('/news')
            .query({ symbol: symbol1 })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
        const data = result.body;
        expect(data).toBeDefined();
        expect(data.googles.length).toBe(3);
        expect(data.twitters.length).toBe(3);
        expect(data.yahoos.length).toBe(3);
        expect(data.yahoos[0].symbol).toBe(symbol1);
    })

    it('read news symbols for news download', async () => {
        const symbols = await db.getNewsSymbols();
        expect(symbols).toBeDefined();
        expect(symbols.length).toBe(3);
    })

})
