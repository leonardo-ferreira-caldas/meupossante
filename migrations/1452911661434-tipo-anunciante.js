'use strict'

var db = require("./../schema");

exports.up = function(next) {
    db.tipo_anunciante.create([
        {descricao: "Concessionária"},
        {descricao: "Loja"},
        {descricao: "Particular"}
    ],
    function(err) {
        if (err) throw err;
        next();
    });
};

exports.down = function(next) {
    db.tipo_anunciante.find().remove(function(err) {
        if (err) throw err;
        next();
    });
};
