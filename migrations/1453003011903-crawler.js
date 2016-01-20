'use strict'

var db = require('./../schema');

exports.up = function(next) {
    db.crawler.collection.createIndex({ "url": "text" }, { unique: true });
    next();
};

exports.down = function(next) {
    db.crawler.find().remove(function(err) {
        if (err) throw err;
        db.crawler.collection.drop();
        next();
    })
};
