const request = require('supertest');
const DbSetup = require('./news-db');
const NewsSummary = require('./news-summary');
const { KEYWORD, Util } = require('./constants');
const app = require('./index');
const { NewsFromWeb, SummarizeNewsToRedis } = require('./get-news');
const RedisHash = require('./redisHash');

jest.setTimeout(30000);

describe('Todo', () => {
    let db;
    let news;
    let symbol1;
    let symbol2;
    let symbol3;
    let newsList1 = [];
    let newsList2 = [];
    let newsList3 = [];
    let scoreList;

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
            now = new Date();
            news = new NewsFromWeb([symbol1, symbol2, symbol3]);
            newsList1.push(newsItem(KEYWORD.SITE_YAHOO, symbol1, "description-1", "http://www.tsla.com", now - 1, "title-1", 0.4));
            newsList2.push(newsItem(KEYWORD.SITE_YAHOO, symbol2, "description-2", "http://www.tsla.com", now - 2, "title-2", 0.4));
            newsList3.push(newsItem(KEYWORD.SITE_YAHOO, symbol3, "description-3", "http://www.tsla.com", now - 3, "title-3", 0.4));
            newsList1.push(newsItem(KEYWORD.SITE_YAHOO, symbol1, "description-1", "http://www.aapl.com", now - 4, "title-1", 0.4));
            newsList2.push(newsItem(KEYWORD.SITE_YAHOO, symbol2, "description-2", "http://www.aapl.com", now - 5, "title-2", 0.4));
            newsList3.push(newsItem(KEYWORD.SITE_YAHOO, symbol3, "description-3", "http://www.aapl.com", now - 6, "title-3", 0.4));
            newsList1.push(newsItem(KEYWORD.SITE_YAHOO, symbol1, "description-1", "http://www.goog.com", now - 7, "title-1", 0.4));
            newsList2.push(newsItem(KEYWORD.SITE_YAHOO, symbol2, "description-2", "http://www.goog.com", now - 8, "title-2", 0.4));
            newsList3.push(newsItem(KEYWORD.SITE_YAHOO, symbol3, "description-3", "http://www.goog.com", now - 9, "title-3", 0.4));
            newsList1.push(newsItem(KEYWORD.SITE_GOOGLE, symbol1, "description-1", "http://www.tsla.com", now - 10, "title-1", 0.4));
            newsList2.push(newsItem(KEYWORD.SITE_GOOGLE, symbol2, "description-2", "http://www.tsla.com", now - 11, "title-2", 0.4));
            newsList3.push(newsItem(KEYWORD.SITE_GOOGLE, symbol3, "description-3", "http://www.tsla.com", now - 12, "title-3", 0.4));
            newsList1.push(newsItem(KEYWORD.SITE_GOOGLE, symbol1, "description-1", "http://www.aapl.com", now - 13, "title-1", 0.4));
            newsList2.push(newsItem(KEYWORD.SITE_GOOGLE, symbol2, "description-2", "http://www.aapl.com", now - 14, "title-2", 0.4));
            newsList3.push(newsItem(KEYWORD.SITE_GOOGLE, symbol3, "description-3", "http://www.aapl.com", now - 15, "title-3", 0.4));
            newsList1.push(newsItem(KEYWORD.SITE_GOOGLE, symbol1, "description-1", "http://www.goog.com", now - 16, "title-1", 0.4));
            newsList2.push(newsItem(KEYWORD.SITE_GOOGLE, symbol2, "description-2", "http://www.goog.com", now - 17, "title-2", 0.4));
            newsList3.push(newsItem(KEYWORD.SITE_GOOGLE, symbol3, "description-3", "http://www.goog.com", now - 18, "title-3", 0.4));
            newsList1.push(newsItem(KEYWORD.SITE_TWITTER, symbol1, "description-1", "http://www.tsla.com", now - 19, "title-1", 0.4));
            newsList2.push(newsItem(KEYWORD.SITE_TWITTER, symbol2, "description-2", "http://www.tsla.com", now - 20, "title-2", 0.4));
            newsList3.push(newsItem(KEYWORD.SITE_TWITTER, symbol3, "description-3", "http://www.tsla.com", now - 21, "title-3", 0.4));
            newsList1.push(newsItem(KEYWORD.SITE_TWITTER, symbol1, "description-1", "http://www.aapl.com", now - 22, "title-1", 0.4));
            newsList2.push(newsItem(KEYWORD.SITE_TWITTER, symbol2, "description-2", "http://www.aapl.com", now - 23, "title-2", 0.4));
            newsList3.push(newsItem(KEYWORD.SITE_TWITTER, symbol3, "description-3", "http://www.aapl.com", now - 24, "title-3", 0.4));
            newsList1.push(newsItem(KEYWORD.SITE_TWITTER, symbol1, "description-1", "http://www.goog.com", now - 25, "title-1", 0.4));
            newsList2.push(newsItem(KEYWORD.SITE_TWITTER, symbol2, "description-2", "http://www.goog.com", now - 26, "title-2", 0.4));
            newsList3.push(newsItem(KEYWORD.SITE_TWITTER, symbol3, "description-3", "http://www.goog.com", now - 27, "title-3", 0.4));
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
        await news.saveAllNewsToDb(newsList1);
        await news.saveAllNewsToDb(newsList2);
        await news.saveAllNewsToDb(newsList3);
    })

    it('read get symbol list ', async () => {
        try {
            const news = new NewsSummary();
            const symbols = await news.GetSymbols();
            expect(symbols).toBeDefined();
            expect(symbols.length).toBe(3);
        }
        catch (err) {
            console.log(err);
        }
    })

    it('Get the summarized news score', async () => {
        try {
            const news = new NewsSummary();
            const scores = await news.GetScoreAll("30 minutes ago");
            expect(scores).toBeDefined();
            expect(scores.yahoo[0].sentiment).toBe(40);
            expect(scores.yahoo[0].count).toBe(3);
            const redisNews = new RedisHash(KEYWORD.NEWS_SEARCH);
            const field = Util.newsHashFieldName("30 minutes ago");
            redisNews.set(field, scores);
            const scores2 = await redisNews.get(field);
            expect(scores2).toBeDefined();
            expect(scores2.yahoo[0].sentiment).toBe(40);
            expect(scores2.yahoo[0].count).toBe(3);
        }
        catch (err) {
            console.log(err);
        }
    })

    it('Get the summarized news from Redis', async () => {
        try {
            const news = new NewsSummary();
            const redisNews = new RedisHash(KEYWORD.NEWS_SEARCH);
            await redisNews.client.flushall();
            const scores = await news.GetScoreAll("30 minutes ago");
            const field = Util.newsHashFieldName("30 minutes ago");
            redisNews.set(field, scores);
            const result = await redisNews.get(field);
            expect(result).toBeDefined();
            expect(result.yahoo[0].sentiment).toBe(40);
            expect(result.yahoo[0].count).toBe(3);
        }
        catch (err) {
            console.log(err);
        }

    })

    it('Summarized all news to Redis', async () => {
        try {
            const redisNews = new RedisHash(KEYWORD.NEWS_SEARCH);
            await redisNews.client.flushall();
            await SummarizeNewsToRedis();
            const field = Util.newsHashFieldName("2 hours ago");
            const scores = await redisNews.get(field);
            expect(scores).toBeDefined();
            expect(scores.yahoo[0].sentiment).toBe(40);
            const result = await redisNews.getAll();
            expect(result).toBeDefined();

        }
        catch (err) {
            console.log(err);
        }

    })


})

