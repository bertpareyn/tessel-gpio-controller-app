/*
 * The MIT License (MIT)
 *
 * Copyright(c) 2013 Bert Pareyn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var should = require('should');
var supertest = require('supertest');
var MongoClient = require('mongodb').MongoClient;
var config = require('../config').config;
var app = require('../app');

var debugUrl = config.debug.url + ':' + config.debug.port;

describe('Routing', function() {
    before(function(done) {
            // Connect to the test db and populate with dummy data
            var url = 'mongodb://' + config.db.url + ':' + config.db.port + '/' + config.db.db;
            MongoClient.connect(url, function(err, db) {
                // Delete any old data
                db.collection('scores').deleteMany({}, function(err, results) {
                    // Re-populate the database with dummy data
                    db.collection('scores').insertMany(config.db.dummyScores, function(err, results) {
                        done();
                    });
                });
            });
    });

    describe('GET /scores', function() {
        it('should be available', function(done) {
            supertest(debugUrl)
                .get('/scores')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    done();
                });
        });

        it('should return 10 dummy data items', function(done) {
            supertest(debugUrl)
                .get('/scores')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body.length.should.be.exactly(10);
                    done();
                });
        });

        it('should return in descending `score` order', function(done) {
            supertest(debugUrl)
                .get('/scores')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.body[0].score.should.be.equal(900);
                    res.body[0].displayName.should.be.equal('Iron Man');
                    res.body[1].score.should.be.equal(800);
                    res.body[2].score.should.be.equal(700);
                    res.body[3].score.should.be.equal(600);
                    res.body[4].score.should.be.equal(500);
                    res.body[5].score.should.be.equal(400);
                    res.body[6].score.should.be.equal(300);
                    res.body[7].score.should.be.equal(200);
                    res.body[8].score.should.be.equal(100);
                    res.body[9].score.should.be.equal(0);
                    res.body[9].displayName.should.be.equal('Spider Man');

                    done();
                });
        });

        it('should be limited to 10 results', function(done) {
            // Connect to the test db and populate with dummy data
            var url = 'mongodb://' + config.db.url + ':' + config.db.port + '/' + config.db.db;
            MongoClient.connect(url, function(err, db) {
                // Add an eleventh dummy document and verify only 10 return
                db.collection('scores').insertOne({
                    'displayName': 'Silver Surfer',
                    'score': 1000
                }, function(err, results) {
                    supertest(debugUrl)
                        .get('/scores')
                        .end(function(err, res) {
                            if (err) {
                                throw err;
                            }

                            res.body[0].score.should.be.equal(1000);
                            res.body[0].displayName.should.be.equal('Silver Surfer');
                            res.body[1].score.should.be.equal(900);
                            res.body[2].score.should.be.equal(800);
                            res.body[3].score.should.be.equal(700);
                            res.body[4].score.should.be.equal(600);
                            res.body[5].score.should.be.equal(500);
                            res.body[6].score.should.be.equal(400);
                            res.body[7].score.should.be.equal(300);
                            res.body[8].score.should.be.equal(200);
                            res.body[9].score.should.be.equal(100);
                            res.body[9].displayName.should.be.equal('Black Widow');

                            done();
                        });
                });
            });
        });
    });

    describe('POST /scores', function() {
        it('should be available', function(done) {
            supertest(debugUrl)
                .post('/scores')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    done();
                });
        });

        it('should validate the document', function(done) {
            supertest(debugUrl)
                .post('/scores')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.text.should.be.equal('A document should be specified');
                    done();
                });
        });

        it('should validate the document `displayName`', function(done) {
            supertest(debugUrl)
                .post('/scores')
                .send({
                    'score': {
                        'score': 0
                    }
                })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.text.should.be.equal('A name for the player should be specified');
                    done();
                });
        });

        it('should validate the document `score`', function(done) {
            supertest(debugUrl)
                .post('/scores')
                .send({
                    'score': {
                        'displayName': 'Jean Grey'
                    }
                })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(400);
                    res.text.should.be.equal('A score for the player should be specified');

                    supertest(debugUrl)
                        .post('/scores')
                        .send({
                            'score': {
                                'displayName': 'Jean Grey',
                                'score': 'not a number'
                            }
                        })
                        .end(function(err, res) {
                            if (err) {
                                throw err;
                            }

                            res.status.should.be.equal(400);
                            res.text.should.be.equal('A score for the player should be specified as a Number');
                            done();
                        });
                });
        });

        it('should store documents', function(done) {
            supertest(debugUrl)
                .post('/scores')
                .send({
                    'score': {
                        'score': 0,
                        'displayName': 'Ultron'
                    }
                })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }

                    res.status.should.be.equal(200);
                    done();
                });
        });
    });
});
