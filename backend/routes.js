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

var db = require('./db');
var log = require('./log').log;
var server = require('./server');

/**
 * Start the server and all of its dependencies
 *
 * @param  {Object}     config          Configuration to start the server with
 * @param  {Function}   callback        Standard callback function
 * @param  {Object}     callback.err    Error object
 */
registerRoutes = exports.registerRoutes = function(config, callback) {

    // Handle get requests for the /scores endpoint and return the top 10 scores
    server.app.get('/scores', function(req, res) {
        db.getScores(function(err, scores) {
            if (err) {
                res.status(500).send("Could not retrieve scores");
            }

            res.status(200).send(scores);
        });
    });

    // Handle post requests to the /scores endpoint and store the score that's passed along
    server.app.post('/scores', function(req, res) {
        // Create the score in the database
        db.postScore(req.body.score, function(err) {
            if (err) {
                res.status(500).send("Could not post score");
            }

            // Return the top 10
            db.getScores(function(err, scores) {
                if (err) {
                    res.status(500).send("Could not retrieve scores");
                }

                res.status(200).send(scores);
            });
        });
    });

    log.info('Successfully registered route handlers');

    callback();
};
