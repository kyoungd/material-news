const request = require('supertest');
const express = require('express');

const app = express();
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.get('/user', function (req, res) {
    res.status(200).json({ name: 'john' });
});

app.post('/users', function (req, res) {
    bodyJson = req.body;
    res.status(200).json({ name: 'john' });
})

describe('GET /user', function () {
    test('responds with json', function (done) {
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('POST /users', function () {
    test('responds with json', function (done) {
        request(app)
            .post('/users')
            .send({ name: 'john' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});

