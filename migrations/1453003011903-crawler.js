'use strict'

var db = require('./../schema');

exports.up = function(next) {
    next();
};

exports.down = function(next) {
    db.crawler.find().remove(function(err) {
        if (err) throw err;
        next();
    })
};
