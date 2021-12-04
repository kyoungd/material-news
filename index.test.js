const request = require('supertest');
const DbSetup = require('./news-db');
const app = require('./index');
const { KEYWORD } = require('./constants');

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
            test1 = KEYWORD.HOST;
            db = new DbSetup();
        }
        catch (err) {
            console.log(err);
        }
    })

    beforeEach(async () => {
        await db.flushSymbols();
    })

    it('add new symbol POST /symbol ', async () => {
        const result = await request(app)
            .post('/symbol')
            .send({ symbol: symbol1 })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
        const data = await db.getSymbol(symbol1);
        expect(data).toBeDefined();
        expect(data.symbol).toBe(symbol1);
        // .end(function (err, res) {
        //     if (err) return done(err);
        //     return done();
        // });
    })

    it('flushsymbols, run every night POST /flushall', async () => {
        const result = await request(app)
            .post('/flushall')
            .expect(200)
    })

})
