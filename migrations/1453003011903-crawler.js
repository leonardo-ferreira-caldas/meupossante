'use strict'

var db = require('./../schema');

exports.up = function(next) {
    db.crawler.collection.createIndex({'url': 1}, {unique: true});
    next();
};

exports.down = function(next) {
    db.crawler.find().remove(function(err) {
        if (err) throw err;
        next();
    })
    db.crawler.collection.drop();
};
