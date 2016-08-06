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

var bunyanFormatter = require('bunyan-format');
var bunyanOutStream = bunyanFormatter({ outputMode: 'short' });
var log = require('bunyan').createLogger({
    name: 'app',
    stream: bunyanOutStream
});
var MongoClient = require('mongodb').MongoClient;

// Make the database connection available throughout the application
var db = exports.db = null;

var initDB = exports.initDB = function(config, callback) {
    var url = 'mongodb://' + config.db.user + ':' + config.db.password + '@' + config.db.url + ':' + config.db.port + '/' + config.db.db;
    MongoClient.connect(url, function(err, _db) {
        if (err) {
            return callback(err);
        }

        db = _db;
        log.info("Successfully opened connection to MongoDB");
        callback();
    });
};
