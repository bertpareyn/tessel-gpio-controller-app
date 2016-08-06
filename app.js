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

var bodyParser = require('body-parser');
var express = require('express');
var http = require('http');
var bunyanFormatter = require('bunyan-format');
var bunyanOutStream = bunyanFormatter({ outputMode: 'short' });
var log = require('bunyan').createLogger({
    name: 'app',
    stream: bunyanOutStream
});

var config = require('./config').config;

/**
 * Start the server
 *
 * @param  {Object}     config          Configuration to start the server with
 * @param  {Function}   callback        Standard callback function
 * @param  {Object}     callback.err    Error object
 */
var startExpress = function(config, callback) {
    log.info('Starting server');
    var app = module.exports.app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(config.ui.path));

    http.createServer(app).listen(process.env.PORT || 3000);
    callback(null, app);
};

/**
 * Start the server and all of its dependencies
 *
 * @param  {Object}     config          Configuration to start the server with
 * @param  {Function}   callback        Standard callback function
 * @param  {Object}     callback.err    Error object
 */
initApplication = function(config, callback) {
    // Initialize the server
    startExpress(config, function(err) {
        if (err) {
            return callback(err);
        }

        callback(null);
    });
};

initApplication(config, function(err) {
    if (err) {
        log.error(err, 'Server could not be started');
    } else {
        log.info('Server started at http://127.0.0.1:3000');
        log.info('Shut down with CTRL + C');
    }
});
