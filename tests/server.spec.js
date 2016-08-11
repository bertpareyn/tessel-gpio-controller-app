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

var server = require('../backend/server');
var should = require('should');

describe('Server', function() {
    describe('Start server', function() {
        it('should validate the configuration is passed in', function(done) {
            server.startExpress(null, function(err) {
                err.should.be.equal('Expecting a config object to start up the server with');
                done();
            });
        });

        it('should validate the server configuration has a `ui` property', function(done) {
            server.startExpress({
                'notui': 'fail'
            }, function(err) {
                err.should.be.equal('Expecting config.ui.path configuration property to start up the server with');
                done();
            });
        });

        it('should validate the server configuration `ui` object has a `path` property', function(done) {
            server.startExpress({
                'ui': {
                    'notpath': ''
                }
            }, function(err) {
                err.should.be.equal('Expecting config.ui.path configuration property to start up the server with');
                done();
            });
        });
    });
});
