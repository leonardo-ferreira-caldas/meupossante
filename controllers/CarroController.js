var db = require('./../schema');

var regCarro = new RegExp(".*webmotors.*\/comprar\/.*portas.*");

exports.ifIsCarAndNotExists = function(url, callback) {
    if (regCarro.test(url)) {
        db.carro.findOne({url: url}, function(err, exists) {
            if (err) throw err;
            if (exists == null) {
                callback();
            }
        });
    }
};

exports.create = function(json) {
    db.carro.create(json, function(err, result) {
        if (err) throw err;
    });
};

exports.findMarcaOrCreate = function(marca, callback) {
    db.marca.findOne({descricao: marca}, function(err, resultMarca) {
        if (err) throw err;

        if (resultMarca != null) {
            callback(resultMarca);
            return;
        }

        db.marca.create({descricao: marca}, function(err, resultMarca) {
            if (err) throw err;
            callback(resultMarca);
        });
    });
};

exports.findModeloOrCreate = function(modelo, marca, callback) {
    db.modelo.findOne({descricao: modelo, fk_marca: marca}, function(err, resultModelo) {
        if (err) throw err;

        if (resultModelo != null) {
            callback(resultModelo);
            return;
        }

        db.modelo.create({descricao: modelo, fk_marca: marca}, function(err, resultModelo) {
            if (err) throw err;
            callback(resultModelo);
        });
    });
};

exports.findVersaoOrCreate = function(versao, modelo, callback) {
    db.versao.findOne({fk_modelo: modelo, descricao: versao}, function(err, resultVersao) {
        if (err) throw err;

        if (resultVersao != null) {
            callback(resultVersao);
            return;
        }

        db.versao.create({fk_modelo: modelo, descricao: versao}, function(err, resultVersao) {
            if (err) throw err;
            callback(resultVersao);
        });
    });
};

exports.findCidadeOrCreate = function(cidade, estado, callback) {
    db.cidade.findOne({nome_cidade: cidade, fk_estado: estado}, function(err, resultCidade) {
        if (err) throw err;

        if (resultCidade != null) {
            callback(resultCidade);
            return;
        }

        db.cidade.create({nome_cidade: cidade, fk_estado: estado}, function(err, resultCidade) {
            if (err) throw err;
            callback(resultCidade);
        });
    });
};