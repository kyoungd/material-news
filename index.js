// express server   
const express = require('express');
const cors = require('cors');
const NewsSummary = require('./news-summary');
const { SearchAllNews, SummarizeNewsToRedis } = require('./get-news');
const DbSetup = require('./news-db');
const { KEYWORD } = require('./constants');
const ReadNews = require('./news-read');
const logger = require('./logger');
const RedisHash = require('./redisHash');
const { attachCookies } = require('superagent');

const app = express();
app.use(cors());
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

const server = require('http').createServer(app);
const host = KEYWORD.HOST;
const port = KEYWORD.PORT;

// http get request return json data
app.get('/sentiment', async function (req, res) {
    // get parameter from url
    try {
        logger.info('get /sentiment: ');
        var symbols = req.query.symbols;
        var interval = req.query.interval;
        const data = new NewsSummary();
        const yahoo = await data.GetScore(KEYWORD.SITE_YAHOO, symbols, interval);
        const twitter = await data.GetScore(KEYWORD.SITE_TWITTER, symbols, interval);
        const google = await data.GetScore(KEYWORD.SITE_GOOGLE, symbols, interval);
        const result = { yahoo, twitter, google };
        const jsondata = JSON.stringify(result);
        res.send(jsondata);
    }
    catch (e) {
        logger.error(e); logger.error(e.stack);
        res.send(JSON.stringify(e));
    }
});

// Add news symbol to internal aggregate list
app.post('/symbol', async (req, res) => {
    try {
        const data = req.body;
        const symbol = data.symbol;
        logger.info('post /symbol : ' + symbol);
        db = new DbSetup();
        const doesSymbolExist = await db.isSymbolExist(symbol);
        if (!doesSymbolExist) {
            await db.addSymbol(symbol);
            res.status(200).json({ result: "success" });
        }
        else
            res.status(200).json({ result: "warning" });
    }
    catch (e) {
        logger.error(e); logger.error(e.stack);
        res.status(500).json({ e });
    }
});

// flushall news from timeseriesnews
app.post('/flushall', async (req, res) => {
    try {
        db = new DbSetup();
        await db.flushSymbols();
        res.status(200).json({ result: "success" });
    }
    catch (e) {
        logger.error(e); logger.error(e.stack);
        res.status(500).json({ e });
    }
});

app.post('/debug/flushall', async (req, res) => {
    try {
        db = new DbSetup();
        await db.flushDb();
        res.status(200).json({ result: "success" });
    }
    catch (e) {
        logger.error(e); logger.error(e.stack);
        res.status(500).json({ e });
    }
});

// Get news content for a symbol or symbols
app.get('/news', async function (req, res) {
    try {
        const symbol = req.query.symbol;
        const news = new ReadNews();
        const result = await news.getNews(symbol, null, null);
        res.status(200).json(result);
    }
    catch (e) {
        logger.error(e); logger.error(e.stack);
        res.status(500).json({ e });
    }
});

app.get('/stack', async function (req, res) {
    try {
        const hash = new RedisHash(KEYWORD.KEY_THREEBARSTACK);
        const data = await hash.getAll();
        const result = {};
        Object.keys(data).forEach(key => {
            const ts = data[key][0].action.timestamp;
            const dt = new Date(ts * 1000)
            result[key] = dt;
        });
        res.status(200).json(result);
    }
    catch (e) {
        logger.error(e); logger.error(e.stack);
        res.status(500).json({ e });
    }
})

app.get('/score', async function (req, res) {
    try {
        const hash = new RedisHash(KEYWORD.KEY_THREEBARSCORE);
        const data = await hash.getAll();
        const result = {};
        Object.keys(data).forEach(key => {
            const ts = data[key][0].timestamp;
            const dt = new Date(ts * 1000);
            result[key] = dt;
        });
        res.status(200).json(result);
    }
    catch (e) {
        logger.error(e); logger.error(e.stack);
        res.status(500).json({ e });
    }
})

app.get('/live/ping', function (req, res) {
    res.send("pong");
})

app.get('/test', function (req, res) {
    res.status(200).json({ name: 'test' });
});

// start express server on port 3000
if (process.env.NODE_ENV !== 'test') {
    const intervalInMs = KEYWORD.READ_NEWS_INTERVAL_MS;
    SearchAllNews();
    setInterval(SearchAllNews, intervalInMs);
    SummarizeNewsToRedis();
    setInterval(SummarizeNewsToRedis, intervalInMs * 6);

    server.listen(port, host, function () {
        console.log('Server listening at %s:%s', host, port);
        logger.info('Server listening at %s:%s', host, port);
    });
}

module.exports = app;

/* --------------------------------------------------------------------

const getLastTimeAgo = async (dict, keyword) => {
    const timeAgo = await dict.get(keyword);
    if (timeAgo) {
        // convert string iso to date
        const oneDate = new Date(timeAgo);
        return oneDate;
    }
    const oneDate = new Date();
    oneDate.setMinutes(oneDate.getMinutes() - 30);
    return oneDate;
}

const main = async () => {
    const symbols = null;
    const timeAgo = new Date();
    const searchUntil = new Date();
    const defaultSymbols = 'AAPL,MSFT,GOOG';
    const news = AllNews.getInstance(symbols === null ? defaultSymbols : symbols, timeAgo);
    const isGetNews = await news.run();
    if (!isGetNews) {
        await dict.set(keywordAgo, searchUntil.toISOString());
    }
}

const SearchNews = () => {
    main().then(() => {
        console.log(' ====== done');
    });
}

-------------------------------------------------------------------- */
