'use strict'

var db = require('./../schema');

exports.up = function(next) {
  next();
};

exports.down = function(next) {
    db.carro.find().remove(function(err) {
        if (err) throw err;
        next();
    });
};
