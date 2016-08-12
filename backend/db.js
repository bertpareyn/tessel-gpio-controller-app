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
    if (!config || !config.db) {
        return callback('Expecting a config object to start up the server with');
    }
    if (!config.db.url) {
        return callback('Expecting config.db.url configuration property to start up the server with');
    }
    if (!config.db.port) {
        return callback('Expecting config.db.port configuration property to start up the server with');
    }
    if (!config.db.db) {
        return callback('Expecting config.db.db configuration property to start up the server with');
    }

    var auth = config.db.user ? config.db.user + ':' + config.db.password + '@' : '';
    var url = 'mongodb://' + auth + config.db.url + ':' + config.db.port + '/' + config.db.db;
    MongoClient.connect(url, function(err, _db) {
        if (err) {
            return callback('Could not connect to the Mongo DB');
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
        /* istanbul ignore if */
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
    if (!doc) {
        return callback('A document should be specified');
    }
    if (!doc.displayName) {
        return callback('A name for the player should be specified');
    }
    if (!doc.score && doc.score !== 0) {
        return callback('A score for the player should be specified');
    }
    /* istanbul ignore else */
    if (isNaN(parseInt(doc.score, 10))) {
        return callback('A score for the player should be specified as a Number');
    }

    // Get the scores collection
    var col = db.collection('scores');
    // Insert the score
    col.insert({
        'displayName': doc.displayName,
        'score': parseInt(doc.score, 10)
    }, function(err, result) {
        /* istanbul ignore if */
        if (err) {
            return callback(err);
        }

        log.info("Inserted score in the database");

        callback(null, result);
    });
};
