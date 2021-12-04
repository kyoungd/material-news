const { createLogger, format, transports } = require('winston');
const { combine, prettyPrint, timestamp, printf, simple } = format;

// set default log level.
const logLevel = 'info';

const errorStackFormat = format((info) => {
    if (info instanceof Error) {
        return Object.assign({}, info, {
            stack: info.stack,
            message: info.message
        });
    }
    return info;
});

var logger = createLogger({
    level: logLevel,
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    },
    transports: [
        new transports.File({ filename: 'news-error.log', level: 'error' }),
        new transports.File({ filename: 'news-combined.log' }),
        new transports.Console()
    ],
    format: combine(
        prettyPrint(),
        timestamp({
            format: 'DD-MM-YYYY hh:mm:ss A'
        }),
        errorStackFormat(),
        simple(),
        printf((info) => {
            return `${info.timestamp} - ${info.level}: ${info.message}`;
        })
    )
});

module.exports = logger;

// try {
//     logger.info('text info 1');
//     logger.warn('text warn');
//     logger.warn('text warn');
//     logger.error('test error');
//     throw new Error('test -- error');

// } catch (e) {
//     logger.error(e);
// }

// transports: [
//     new transports.File({ filename: 'news-error.log', level: 'error' }),
//     new transports.File({ filename: 'news-combined.log' })
// ],
