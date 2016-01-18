'use strict'

var db = require('./../schema');

exports.up = function(next) {

    db.opcional.create([
        {descricao: 'Airbag'},
        {descricao: 'Alarme'},
        {descricao: 'Ar condicionado'},
        {descricao: 'Ar quente'},
        {descricao: 'Banco com regulagem de altura'},
        {descricao: 'Bancos dianteiros com aquecimento'},
        {descricao: 'Bancos em couro'},
        {descricao: 'Capota marítima'},
        {descricao: 'CD e MP3 Player'},
        {descricao: 'CD Player'},
        {descricao: 'Computador de bordo'},
        {descricao: 'Controle automático de velocidade'},
        {descricao: 'Controle de tração'},
        {descricao: 'Desembaçador traseiro'},
        {descricao: 'Direção hidráulica'},
        {descricao: 'Disqueteira'},
        {descricao: 'DVD Player'},
        {descricao: 'Encosto de cabeça traseiro'},
        {descricao: 'Farol de xenônio'},
        {descricao: 'Freio ABS'},
        {descricao: 'GPS'},
        {descricao: 'Limpador traseiro'},
        {descricao: 'Protetor de caçamba'},
        {descricao: 'Rádio'},
        {descricao: 'Rádio e toca fitas'},
        {descricao: 'Retrovisor fotocrômico'},
        {descricao: 'Retrovisores elétricos'},
        {descricao: 'Rodas de liga leve'},
        {descricao: 'Sensor de chuva'},
        {descricao: 'Sensor de estacionamento'},
        {descricao: 'Teto solar'},
        {descricao: 'Tração 4x4'},
        {descricao: 'Travas elétricas'},
        {descricao: 'Vidros elétricos'},
        {descricao: 'Volante com regulagem de altura'}
    ],
    function(err) {
        if (err) throw err;
        next();
    });

};

exports.down = function(next) {
    db.opcional.find().remove(function(err) {
        if (err) throw err;
        next();
    })
};
