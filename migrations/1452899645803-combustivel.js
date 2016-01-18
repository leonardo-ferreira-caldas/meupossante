'use strict'

var db = require('./../schema');

exports.up = function(next) {

    db.combustivel.create([
        {descricao: 'Álcool'},
        {descricao: 'Álcool e gás natural'},
        {descricao: 'Diesel'},
        {descricao: 'Gás natural'},
        {descricao: 'Gasolina'},
        {descricao: 'Gasolina e álcool'},
        {descricao: 'Gasolina e elétrico'},
        {descricao: 'Gasolina e gás natural'},
        {descricao: 'Gasolina, álcool e gás natural'},
        {descricao: 'Gasolina, álcool, gás natural e benzina'}
    ],
    function(err) {
        if (err) throw err; 
        next();
    });

};

exports.down = function(next) {
    db.combustivel.find().remove(function(err) {
        if (err) throw err;
        next();
    });
};
