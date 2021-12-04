const { NewsFromWeb } = require('./get-news');

const news = new NewsFromWeb();
news.testResetNewsSymbol().then(() => {
    console.log('done');
})
console.log('reset start');
