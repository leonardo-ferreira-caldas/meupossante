'use strict'

var db = require('./../schema');

exports.up = function(next) {
    db.documentacao.create([
        {descricao: 'Alienado'},
        {descricao: 'Garantia de fábrica'},
        {descricao: 'IPVA pago'},
        {descricao: 'Licenciado'},
        {descricao: 'Todas as revisões feitas pela agenda do carro'},
        {descricao: 'Todas as revisões feitas pela concessionária'},
        {descricao: 'Único dono'},
        {descricao: 'Não aceita troca'},
        {descricao: 'Carro de colecionador'},
        {descricao: 'Adaptado para deficientes físicos'},
        {descricao: 'Blindado'}
    ],
    function(err) {
        if (err) throw err;
        next();
    });

};

exports.down = function(next) {
    db.documentacao.find().remove(function(err) {
        if (err) throw err;
        next();
    });
};
