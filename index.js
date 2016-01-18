var express = require('express');
var app = express();
var path = require('path');
var db = require('./schema');
var async = require("async");

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index', {
    teste: 22131313
  });
});

app.get('/buscar', function(req, res) {
    var length = 20;
    var page = req.param("page");
    var offset = (page * length) - length;

    async.parallel({
        vehicles: function(callback) {
            db.carro.find().skip(offset).limit(length).exec(function(err, results) {
                if (err) throw err;
                callback(null, results);
            });
        },
        total_vehicles_length: function(callback) {
            db.carro.count(null, function(err, count) {
                if (err) throw err;
                callback(null, count);
            });
        }
    }, function(err, results) {
        if (err) throw err;

        results.current_page = page;
        results.total_pages = Math.ceil(results.total_vehicles_length / length);

        res.send(results);
    });
});

app.get('/filtros', function(req, res) {
    async.parallel({
        cor: function(callback) {
            db.cor.find(null, function(err, cores) {
                if (err) throw err;
                callback(null, cores);
            });
        },
        carroceria: function(callback) {
            db.carroceria.find(null, function(err, carrocerias) {
                if (err) throw err;
                callback(null, carrocerias);
            });
        },  
        opcional: function(callback) {
            db.opcional.find(null, function(err, opcionais) {
                if (err) throw err;
                callback(null, opcionais);
            });
        },
        cambio: function(callback) {
            db.cambio.find(null, function(err, cambios) {
                if (err) throw err;
                callback(null, cambios);
            });
        },
        documentacao: function(callback) {
            db.documentacao.find(null, function(err, documentacoes) {
                if (err) throw err;
                callback(null, documentacoes);
            });
        }
    }, function(err, filtros) {
        if (err) throw err;
        res.send(filtros);
    });
});

app.listen(3000);