var async = require("async");
var Str = require('./string');
var Arr = require('./array');
var CrawlerDOM = require('./crawler_dom');
var CarroController = require('./controllers/CarroController');

exports.get = function(url, schemaDB, jQuery, callbackGET) {

    try {
        var dom         = new CrawlerDOM.finder(jQuery);
        var metas       = new CrawlerDOM.metas(dom.getMetas());
        var anoModelo   = dom.getAnoModelo();
        var fotos       = dom.getFotos();
        var finalPlaca  = dom.getFinalPlaca();

        var dadosCarro = {
            foto_capa:              fotos.foto_capa,
            fotos:                  fotos.fotos,
            url:                    url,
            ano:                    anoModelo.ano,
            modelo:                 anoModelo.modelo,
            preco:                  metas.getPreco(),
            descricao_carro:        metas.getDescricaoCarro(),
            slug:                   metas.getSlug(),
            ind_veiculo_novo:       metas.getIsVeiculoUsado(),
            final_placa:            finalPlaca,
            kilometragem:           dom.getKilometragem(),
            portas:                 dom.getPortas(),
            descricao_anunciante:   dom.getDetalhesObservacaoAnunciante(),
            data_anuncio:           dom.getDataAnuncio(),
            ind_colecionador:       false,
            ind_blindagem:          false,
            ind_aceita_troca:       true, 
            ind_deficiente_fisico:  false
        };

    } catch (err) {
        console.log(err);
        return;
    }

    async.parallel({
        fk_combustivel: function(callback){
            schemaDB.combustivel.findOne({descricao: metas.getCombustivel()}, function(err, combustivel) {
                if (err) throw err;
                callback(null, combustivel._id);
            })
        },
        fk_cor: function(callback){
            schemaDB.cor.findOne({descricao: metas.getCor()}, function(err, cor) {
                if (err) throw err;
                callback(null, cor._id);
            })
        },
        fk_cambio: function(callback){
            schemaDB.cambio.findOne({descricao: metas.getCambio()}, function(err, cambio) {
                if (err) throw err;
                callback(null, cambio._id);
            })
        },
        fk_carroceria: function(callback){
            schemaDB.carroceria.findOne({descricao: metas.getCarroceria()}, function(err, carroceria) {
                if (err) throw err;
                callback(null, carroceria._id);
            })
        },
        outros: function(callback) {
            var modelo = metas.getModelo();
            var marca  = metas.getMarca();
            var versao = metas.getVersao();

            CarroController.findMarcaOrCreate(marca, function(resultMarca) {
                CarroController.findModeloOrCreate(modelo, resultMarca._id, function(resultModelo) {
                    CarroController.findVersaoOrCreate(versao, resultModelo._id, function(resultVersao) {
                        callback(null, {
                            fk_modelo: resultModelo._id,
                            fk_marca:  resultMarca._id,
                            fk_versao: resultVersao._id
                        });
                    });
                });
            });

        },
        fk_cidade: function(callback) {
            var estado = metas.getEstado();
            var cidade = metas.getCidade();

            schemaDB.estado.findOne({sigla: estado}, function(err, result) {
                if (err) { callback(err, null); return; }

                CarroController.findCidadeOrCreate(cidade, result._id, function(resultCidade) {
                    callback(null, resultCidade._id);
                });

            });

        },
        fk_tipo_anunciante: function(callback) {
            schemaDB.tipo_anunciante.findOne({descricao: metas.getTipoAnunciante()}, function(err, result) {
                if (err) throw err;
                callback(null, result._id);
            })
        },
        opcionais: function(callback) {
            var opcionais = dom.getOpcionais();

            schemaDB.opcional.find({descricao: {$in: opcionais}}, function(err, results) {
                if (err) throw err;
                if (results.length != opcionais.length) throw "erro";

                callback(null, results.map(function(item) {
                    return item._id;
                }))
            });
        },
        documentacoes: function(callback) {
            var documentacoes = dom.getDocumentacoes();

            if (documentacoes.contains('Não aceita troca')) {
                dadosCarro.ind_aceita_troca = false;
            }

            if (documentacoes.contains('Blindado')) {
                dadosCarro.ind_blindagem = true;
            }

            if (documentacoes.contains('Carro de colecionador')) {
                dadosCarro.ind_colecionador = true;
            }

            if (documentacoes.contains('Adaptado para deficientes físicos')) {
                dadosCarro.ind_deficiente_fisico = true;
            }

            schemaDB.documentacao.find({descricao: {$in: documentacoes}}, function(err, results) {
                if (err) throw err;
                if (results.length != documentacoes.length) {
                    console.log(results, documentacoes);
                    throw "erro";
                }

                callback(null, results.map(function(item) {
                    return item._id;
                }))
            });
        }
    },
    function(err, results) {
        if (err) return;

        results.fk_marca =  results.outros.fk_marca;
        results.fk_modelo = results.outros.fk_modelo;
        results.fk_versao = results.outros.fk_versao;
        delete results.outros;

        for (var name in results) {
            dadosCarro[name] = results[name];
        }

        callbackGET(dadosCarro);
    });
}