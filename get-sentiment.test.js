const request = require('supertest');
const DbSetup = require('./news-db');
const ReadNews = require('./news-read');
const { KEYWORD } = require('./constants');
const { NewsFromWeb } = require('./get-news');
const app = require('./index');
const { Sentiment } = require('./get-sentiment');

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
    let sentiment;
    let newsList;
    let sentimentList;

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
            newsList1.push(newsItem(KEYWORD.SITE_YAHOO, symbol1, "The metaverse has seemingly just begun to be built, and one tech industry giant says it will surpass the physical world.", "http://www.tsla.com", now - 1, "new company", 0));
            newsList1.push(newsItem(KEYWORD.SITE_YAHOO, symbol1, "this technology the 'next big frontier' with a market opportunity of $80 trillion", "http://www.tsla.com", now - 2, "new product", 0));
            newsList1.push(newsItem(KEYWORD.SITE_YAHOO, symbol1, "We think that is the big new frontier.", "http://www.tsla.com", now - 3, "our estimate", 0));
            //
        }
        catch (err) {
            console.log(err);
        }
    })

    beforeEach(async () => {
    })

    it('data setup', async () => {
        try {
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
        }
        catch (err) {
            console.log(err);
        }

    })

    it('read sentiment news ', async () => {
        try {
            sentiment = new Sentiment();
            newsList = await sentiment.getNewsFromTable('YAHOO');
            expect(newsList).toBeDefined();
            expect(newsList.length).toBe(3);
        }
        catch (err) {
            console.log(err);
        }
    })

    it('get sentiment score ', async () => {
        try {
            sentimentList = await sentiment.getSentimentList(newsList);
            expect(sentimentList.length).toBe(3);
            expect(sentimentList[0].sentiment).not.toBe(0);
            expect(sentimentList[1].sentiment).not.toBe(0);
            expect(sentimentList[2].sentiment).not.toBe(0);
            // 
            await sentiment.saveSentimentList("YAHOO", sentimentList);
            const result1 = await news.getNews(symbol1, null, null);
            expect(result1).toBeDefined();
            expect(result1.yahoos.length).toBe(3);
            expect(result1.yahoos[0].symbol).toBe(symbol1);
        }
        catch (err) {
            console.log(err);
        }
    })

})
