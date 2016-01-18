'use strict'

var db = require('./../schema');

exports.up = function(next) {
    
    db.cambio.create([
        {descricao: 'Manual'},
        {descricao: 'Automática'},
        {descricao: 'Automática Sequencial'},
        {descricao: 'CVT'},
        {descricao: 'Semi-automática'}
    ],
    function(err) {
        if (err) throw err;
        next();
    });

};

exports.down = function(next) {
    db.cambio.find().remove(function(err) {
        if (err) throw err;
        next();
    })
};
