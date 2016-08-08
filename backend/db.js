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

var log = require('./log').log;
var MongoClient = require('mongodb').MongoClient;

// Initialize the shared DB object
var db = false;

/**
 * Initialise the connection to the MongoDB and make the resulting MongoClient object available
 * to other modules that wish to do database operations
 *
 * @param  {Object}     config            Configuration to initialize the DB with
 * @param  {Function}   callback          Standard callback function
 * @param  {Object}     [callback.err]    Error object, if any
 */
var initDB = exports.initDB = function(config, callback) {
    var url = 'mongodb://' + config.db.user + ':' + config.db.password + '@' + config.db.url + ':' + config.db.port + '/' + config.db.db;
    MongoClient.connect(url, function(err, _db) {
        if (err) {
            return callback(err);
        }

        // Export the open connections for anyone who needs it. Saves us the trouble of
        // having to open a new connection on every operation.
        db = exports.db = _db;

        log.info("Successfully opened connection to MongoDB");
        callback();
    });
};

/**
 * Retrieve the top 10 scores from the database
 *
 * @param  {Function} callback             Standard callback function
 * @param  {Object}   [callback.error]     The error object, if any
 * @param  {Object}   callback.result      The top 10 scores
 */
var getScores = exports.getScores = function(callback) {
    // Get the scores collection
    var col = db.collection('scores');
    // Find the top 10 scores
    col.aggregate([
        {
            $sort : {
                    score : -1
            }
        },
        {
            $limit : 10
        }
    ]).toArray(function(err, docs) {
        if (err) {
            return callback(err);
        }

        log.info("Retrieved score from the database");

        callback(null, docs);
    });
};

/**
 * Post a score to the database
 *
 * @param  {Object}   doc                  The score object to store in the database
 * @param  {String}   doc.displayName      The name of the player
 * @param  {Number}   doc.score            The score of the player
 * @param  {Function} callback             Standard callback function
 * @param  {Object}   [callback.error]     The error object, if any
 * @param  {Object[]} callback.result      The inserted document
 */
var postScore = exports.postScore = function(doc, callback) {
    // Get the scores collection
    var col = db.collection('scores');
    // Insert the score
    col.insert({
        'displayName': doc.displayName,
        'score': parseInt(doc.score, 10)
    }, function(err, result) {
        if (err) {
            return callback(err);
        }

        log.info("Inserted score in the database");

        callback(null, result);
    });
};
