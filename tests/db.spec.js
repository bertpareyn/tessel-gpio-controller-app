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

var db = require('../backend/db');
var should = require('should');

describe('Database', function() {

    describe('Initialize MongoDB', function() {
        it('should validate the Mongo configuration is passed in', function(done) {
            db.initDB(null, function(err) {
                err.should.be.equal('Expecting a config object to start up the server with');
                done();
            });
        });

        it('should validate the Mongo configuration object has a `db` object', function(done) {
            db.initDB({
                'something': 'else'
            }, function(err) {
                err.should.be.equal('Expecting a config object to start up the server with');
                done();
            });
        });

        it('should validate the Mongo configuration `db` object has a `url` property', function(done) {
            db.initDB({
                'db': {
                    'port': '27017',
                    'db': 'gpiotest'
                }
            }, function(err) {
                err.should.be.equal('Expecting config.db.url configuration property to start up the server with');
                done();
            });
        });

        it('should validate the Mongo configuration `db` object has a `port` property', function(done) {
            db.initDB({
                'db': {
                    'url': 'localhost',
                    'db': 'gpiotest'
                }
            }, function(err) {
                err.should.be.equal('Expecting config.db.port configuration property to start up the server with');
                done();
            });
        });

        it('should validate the Mongo configuration `db` object has a `db` property', function(done) {
            db.initDB({
                'db': {
                    'url': 'localhost',
                    'port': '27017'
                }
            }, function(err) {
                err.should.be.equal('Expecting config.db.db configuration property to start up the server with');
                done();
            });
        });

        it('should validate the Mongo user credentials are applied', function(done) {
            db.initDB({
                'db': {
                    'url': 'localhost',
                    'port': '27017',
                    'db': 'gpiotest',
                    'user': 'nonexisting',
                    'password': 'somepassword'
                }
            }, function(err) {
                /**
                 * TODO: Add an actual Mongo DB user on the file system and check against that.
                 */
                err.should.be.equal('Could not connect to the Mongo DB');
                done();
            });
        });
    });
});