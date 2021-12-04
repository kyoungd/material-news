require('dotenv').config();

const moment = require('moment');
const logger = require('./logger');

const KEYWORD = {
    URL_TWEETS: process.env.URL_TWEETS || "http://localhost:8101/tweets",
    URL_SENTIMENT_ANALSYS: process.env.URL_SENTIMENT_ANALSYS || 'http://localhost:8102/sentiment',
    HOST: process.env.HOST || 'localhost',
    PORT: parseInt(process.env.PORT || '3003'),
    READ_NEWS_INTERVAL_MS: parseInt(process.env.READ_NEWS_INTERVAL_MS || '300000'),
    SITE_YAHOO: process.env.SITE_YAHOO || "site_yahoo",
    SITE_GOOGLE: process.env.SITE_GOOGLE || "site_google",
    SITE_TWITTER: process.env.SITE_TWITTER || "site_twitter",
    NEWS_SYMBOL: process.env.NEWS_SYMBOLS || "news_symbol",
    REDIS_NEWS_AGO_KEYWORD: process.env.REDIS_NEWS_AGO_KEYWORD || "NEWS_AGO",
    NEWS_SEARCH: process.env.REDIS_KEYWORD || "NEWS_SEARCH",
    READ_NEWS_INTERVAL_MS: parseInt(process.env.READ_NEWS_INTERVAL_MS || '300000'),
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || "password",
    KEY_THREEBARSTACK: process.env.KEY_THREEBARSTACK || "STUDYTHREEBARSTACK",
    KEY_THREEBARSCORE: process.env.KEY_THREEBARSCORE || "STUDYTHREEBARSCORE",
    NEWS_SENTIMENT_COUNT: parseInt(process.env.NEWS_SENTIMENT_COUNT || '500'),
    TWEET_MAX_COUNT: parseInt(process.env.TWEET_MAX_COUNT || '100'),
}

const NewsTable = {
    YAHOO: KEYWORD.SITE_YAHOO,
    GOOGLE: KEYWORD.SITE_GOOGLE,
    TWITTER: KEYWORD.SITE_TWITTER
}

// const KeyName = {
//     SEARCH_NEWS_SINCE: "SEARCH_NEWS_SINCE"
// }

// module.exports = { NewsTable, KeyName }


class Util {

    static ourDateTime(oneDate) {
        return moment(oneDate).format("YYYY-MM-DD HH:mm:ss");
    }


    // convert "5 minutes ago" to current date time
    static googleTimeAgo(durationAgo) {
        const parts = durationAgo.split(" ");
        const num = parts[0];
        const unit = parts[1];
        const oneDate = new Date();
        switch (unit) {
            case "minute":
            case "minutes":
                oneDate.setMinutes(oneDate.getMinutes() - num);
                break;
            case "hour":
            case "hours":
                oneDate.setHours(oneDate.getHours() - num);
                break;
            case "day":
            case "days":
                oneDate.setDate(oneDate.getDate() - num);
                break;
            case "week":
            case "weeks":
                oneDate.setDate(oneDate.getDate() - (num * 7));
                break;
            case "month":
            case "months":
                oneDate.setMonth(oneDate.getMonth() - num);
                break;
            case "year":
            case "years":
                oneDate.setFullYear(oneDate.getFullYear() - num);
                break;
            default:
                break;
        }
        // datetime to format string

        return oneDate;
        // const newDateTime = this.ourDateTime(oneDate);
        // return newDateTime;
    }

    static newsHashFieldName(durationAgo) {
        durationAgo = durationAgo.replace(/ /g, '_');
        durationAgo = durationAgo.replace(/minutes/g, 'minute');
        durationAgo = durationAgo.replace(/hours/g, 'hour');
        durationAgo = durationAgo.replace(/days/g, 'day');
        const field = KEYWORD.NEWS_SEARCH + '_' + durationAgo;
        return field;
    }

    static getDateOnly(today = new Date()) {
        // date only for today
        try {
            // extract date only from today
            const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            return dateOnly;
        }
        catch (e) {
            logger.error(e);
            logger.error(e.stack);
        }
    }

}

module.exports = { NewsTable, Util, KEYWORD }
