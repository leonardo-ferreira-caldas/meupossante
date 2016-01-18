'use strict'

var db = require('./../schema');

exports.up = function(next) {
    
    db.carroceria.create([
        {descricao: 'Buggy'},
        {descricao: 'Conversível'},
        {descricao: 'Cupê'},
        {descricao: 'Hatchback'},
        {descricao: 'Minivan'},
        {descricao: 'Perua/SW'},
        {descricao: 'Picape'},
        {descricao: 'Sedã'},
        {descricao: 'SUV'},
        {descricao: 'Van/Utilitário'},
        {descricao: 'Utilitário esportivo'}
    ],
    function(err) {
        if (err) throw err;
        next();
    });

};

exports.down = function(next) {
    db.carroceria.find().remove(function(err) {
        if (err) throw err;
        next();
    });
};
