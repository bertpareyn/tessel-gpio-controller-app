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

var config = module.exports.config = {};

config.ui = {
    'path': './SpaceInvaders'
};

config.debug = {
    'url': 'http://localhost',
    'port': 3000
};

config.db = {
    'url': process.env.MONGO_URL || 'localhost',
    'port': process.env.MONGO_PORT || '27017',
    'user': process.env.MONGO_USER || '',
    'password': process.env.MONGO_PASSWORD || '',
    'db': process.env.MONGO_DB || 'gpiotest',
    'dummyScores': [{
        "displayName": "Spider Man",
        "score": 0
    }, {
        "displayName": "Wolverine",
        "score": 600
    }, {
        "displayName": "Hulk",
        "score": 500
    }, {
        "displayName": "Thor",
        "score": 400
    }, {
        "displayName": "Doctor Strange",
        "score": 700
    }, {
        "displayName": "Captain America",
        "score": 300
    }, {
        "displayName": "Wanda Maximoff",
        "score": 800
    }, {
        "displayName": "Daredevil",
        "score": 200
    }, {
        "displayName": "Iron Man",
        "score": 900
    }, {
        "displayName": "Black Widow",
        "score": 100
    }]
};
