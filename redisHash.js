// redis hash key node js

const redis = require('redis');
const { KEYWORD } = require('./constants');

const client = redis.createClient({
    host: KEYWORD.REDIS_HOST,
    port: KEYWORD.REDIS_PORT,
    password: KEYWORD.REDIS_PASSWORD
});

class RedisHash {
    constructor(key) {
        this.client = client;
        this.key = key;
    }

    async get(field) {
        return new Promise((resolve, reject) => {
            this.client.hget(this.key, field, (err, res) => {
                if (err) {
                    reject(err);

                } else {
                    resolve(JSON.parse(res));
                }
            });
        });
    }

    async set(field, value) {
        return new Promise((resolve, reject) => {
            this.client.hset(this.key, field, JSON.stringify(value), (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });

        });
    }

    async del(field) {
        return new Promise((resolve, reject) => {
            this.client.hdel(this.key, field, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    async getAll() {
        return new Promise((resolve, reject) => {
            try {
                this.client.hgetall(this.key, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        let hashValues = {}
                        if (res) {
                            Object.keys(res).forEach(key => {
                                hashValues[key] = JSON.parse(res[key]);
                            });
                        }
                        resolve(hashValues);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }

    async getKeys() {
        return new Promise((resolve, reject) => {
            this.client.hkeys(this.key, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    async getValues() {
        return new Promise((resolve, reject) => {
            this.client.hvals(this.key, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    async getLength() {
        return new Promise((resolve, reject) => {
            this.client.hlen(this.key, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    async getKeysAndValues() {
        return new Promise((resolve, reject) => {
            this.client.hgetall(this.key, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

}


module.exports = RedisHash;
