'use strict'
const fs = require('fs');
const requestPromise = require('request-promise');
var xmlJs = require("xml-js");

module.exports.get = async function (symbols, callback) {
    var symbols = symbols.split(',')
    // console.log(symbols);
    const promises = symbols.map(symbol => requestPromise({
        url: `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${symbol}&region=US&lang=en-US`,
        json: true,
        transform: function (body) {
            var options = {
                compact: true,
                ignoreComment: true
            };
            try {
                var result = xmlJs.xml2json(body, options);
                var json = JSON.parse(result);
                var title = json.rss.channel.item.map(item => item.title._text)
                var description = json.rss.channel.item.map(item => item.description._text)
                var link = json.rss.channel.item.map(item => item.link._text)
                var date = json.rss.channel.item.map(item => item.pubDate._text)
                var tmp = []
                for (var i = 0; i < title.length; i++) {
                    const item = {
                        title: title[i],
                        description: description[i],
                        link: link[i],
                        date: date[i]
                    }
                    tmp.push(item)
                }
                return [{
                    'items': tmp,
                    'symbol': symbol
                }];
            } catch (e) {

            }
        }
    }));

    Promise.all(promises).then((rdata) => {
        // kyd added
        // remove undefined element from the array.  It is causing a crash.
        let data = [];
        for (var i = 0; i < rdata.length; i++) {
            var tmp = rdata[i];
            if (!(tmp == undefined || tmp == null))
                data.push(tmp);
        }
        // kyd added
        const results = [].concat(...data.map(Object.values));
        Promise.all(results).then((completed) => {
            // fs.writeFileSync('test.json', JSON.stringify(completed));
            if (callback) {
                callback(JSON.stringify(completed))
            }
        });
    })
}
