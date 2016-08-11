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

var config = require('./config-test').config;
var db = require('./backend/db');
var log = require('./backend/log').log;
var routes = require('./backend/routes');
var server = require('./backend/server');

/**
 * Start the server and all of its dependencies
 *
 * @param  {Object}     config          Configuration to start the server with
 * @param  {Function}   callback        Standard callback function
 * @param  {Object}     callback.err    Error object
 */
initApplication = function(config, callback) {
    // Initialize the server
    server.startExpress(config, function(err) {
        /* istanbul ignore if */
        if (err) {
            return callback(err);
        }

        routes.registerRoutes(config, function(err) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            // Initialize the database connection
            db.initDB(config, function(err) {
                /* istanbul ignore if */
                if (err) {
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};

initApplication(config, function(err) {
    /* istanbul ignore if */
    if (err) {
        log.error(err, 'Server could not be started');
    } else {
        log.info('Successfully started server at http://localhost:'  + (process.env.PORT || 3000));
        log.info('Shut down with CTRL + C');
    }
});
