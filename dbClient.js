const { PrismaClient } = require('@prisma/client');

class DBClient {
    constructor() {
        this._prisma = new PrismaClient();
    }

    // singleton pattern
    static getInstance() {
        if (!this.instance) {
            this.instance = new DBClient();
        }
        return this.instance;
    }

    get prisma() {
        return this._prisma;
    }

}

module.exports = DBClient