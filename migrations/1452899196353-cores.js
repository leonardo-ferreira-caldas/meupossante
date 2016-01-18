'use strict'

var db = require('./../schema');

exports.up = function(next) {
    db.cor.create([
        {descricao: 'Amarelo'},
        {descricao: 'Azul'},
        {descricao: 'Bege'},
        {descricao: 'Branco'},
        {descricao: 'Bronze'},
        {descricao: 'Cinza'},
        {descricao: 'Dourado'},
        {descricao: 'Indefinida'},
        {descricao: 'Laranja'},
        {descricao: 'Marrom'},
        {descricao: 'Prata'},
        {descricao: 'Preto'},
        {descricao: 'Rosa'},
        {descricao: 'Roxo'},
        {descricao: 'Verde'},
        {descricao: 'Vermelho'},
        {descricao: 'Vinho'}
    ],
    function (err) {
        if (err) throw err;
        next();
    });

};

exports.down = function(next) {
    db.cor.find().remove(function(err) {
        if (err) throw err;
        next();
    });
};
