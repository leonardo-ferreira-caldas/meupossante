var Str = require('./string');
var Entities = require('html-entities').XmlEntities;
entities = new Entities();

exports.finder = function($) {
    this.opcionaisAndDocumentacoesAndObservacao = undefined;

    this.getFinalPlaca = function() {
        return $("body > div.content.detalhes-anuncio.c-after > div.col-main.col-12 > div:nth-child(1) > div.col-4.last.size-default.dados > div:nth-child(1) > div:nth-child(5) > div.dis-tc.col-4.last.valign-m > strong").text() || 0;
    };

    this.getAnoModelo = function() {
        var text = $("body > div.content.detalhes-anuncio.c-after > div.col-main.col-12 > div:nth-child(1) > div.col-4.last.size-default.dados > div:nth-child(1) > div:nth-child(1) > div.dis-tc.col-4.last.valign-m > strong").text().split("/");
        
        return {
            ano: text[0],
            modelo: text[1]
        };
    };

    this.getKilometragem = function() {
        var text = $("body > div.content.detalhes-anuncio.c-after > div.col-main.col-12 > div:nth-child(1) > div.col-4.last.size-default.dados > div:nth-child(1) > div:nth-child(2) > div.dis-tc.col-4.last.valign-m > strong").text();
        text = text.split(".").join("").trim();
        return text; 
    };

    this.getPortas = function() {
        var text = $("body > div.content.detalhes-anuncio.c-after > div.col-main.col-12 > div:nth-child(3) > div > div.geral.informacoes > div.dis-t > div.dis-tc.col-7.b.gutter-left.size-default > div:nth-child(10)").text();
        return text.replace("Portas:", "").trim();
    };

    this.getDataAnuncio = function() {
        var text = $("body > div.content.detalhes-anuncio.c-after > div.col-main.col-12 > div:nth-child(3) > div > div.geral.informacoes > div.dis-t > div.dis-tc.col-7.b.gutter-left.size-default > div:nth-child(11)").text();
        text = text.replace("Data do anúncio:", "").trim();
        return text.split("/").reverse().join("-");
    };

    this.getOpcionaisAndDocumentacoesAndObservacao = function() {
        this.opcionaisAndDocumentacoesAndObservacao = this.opcionaisAndDocumentacoesAndObservacao || entities.decode($("body > div.content.detalhes-anuncio.c-after > div.col-main.col-12 > div:nth-child(3) > div > div.geral.informacoes > div.size-default.pad-h_gutter-t.pad-gutter-lr.lh-oh_gutter > p").html());
        return this.opcionaisAndDocumentacoesAndObservacao;
    };

    this.getOpcionais = function() {
        var opcionaisText = this.getOpcionaisAndDocumentacoesAndObservacao();

        var text = opcionaisText.split("Observações do vendedor");

        text = text[0].strip_tags().trim().replace("Opcionais", "").trim();

        text =  text.replace("\n", "").replace("\r", "").split(", ").join(",");

        if (text) {
            return text.split(",");
        }

        return [];
    };

    this.getDocumentacoes = function() {
        var documentacoesText = this.getOpcionaisAndDocumentacoesAndObservacao();

        var text = documentacoesText.split("Observações do vendedor");

        if (text.length <= 1) {
            return [];
        }

        documentacoesText = text[1].split("<br>")[0].strip_tags().trim();

        if (documentacoesText) {
            return documentacoesText.split(",").map(function(item) {
                return item.trim();
            });
        }

        return [];
    };

    this.getDetalhesObservacaoAnunciante = function() {
        var ObservacaoText = this.getOpcionaisAndDocumentacoesAndObservacao();

        var text = ObservacaoText.split("Observações do vendedor");

        if (text.length <= 1) {
            return "";
        }

        text = text[1].split("<br>");

        if (text.length <= 1) {
            return "";
        }

        return text[1].strip_tags().trim();
    }

    this.getFotos = function() {
        var fotos = $("#main-carousel > div > div.carousel-inner.c-after > a > img");

        var response = {
            foto_capa: null,
            fotos: []
        };

        fotos.each(function(index, img) {
            var url = $(img).attr("src").split("?")[0];

            if (index == 0) response.foto_capa = url;
            response.fotos.push(url);
        });

        if (!response.foto_capa) {
            response.foto_capa = "/img/sem_foto.jpg";
            response.fotos = ["/img/sem_foto.jpg"];
        }

        return response;
    }

    this.getMetas = function() {
        var metas = {};

        $('meta').each(function(index, meta) {
            metas[$(meta).attr("name")] = $(meta).attr("content");
        });

        var mandatoryMetas = ['wm.dt_mmv', 'wm.dt_prc', "wm.dt_tipoc", 'wm.dt_combustivel', 'wm.dt_cor', 'wm.dt_cambio', 'wm.dt_carroceria', 'wm.dt_mod'];

        for (var i = 0; i < mandatoryMetas.length; i++) {
            if (!metas[mandatoryMetas[i]]) {
                throw new Error("Metas obrigatórias não encontradas.");
            }
        }

        return metas;
    }

};

exports.metas = function(metas) {

    this.getDescricaoCarro = function() {
        return metas['wm.dt_mmv'].split("|").join(" ");
    };

    this.getSlug = function() {
        return this.getDescricaoCarro() + "-" + Str.uniqid();
    };

    this.getPreco = function() {
        return metas['wm.dt_prc'];
    };

    this.getIsVeiculoUsado = function() {
        return metas["wm.dt_tipoc"] != "usado";
    };

    this.getCombustivel = function() {
        return metas['wm.dt_combustivel'];
    };

    this.getCor = function() {
        return metas['wm.dt_cor'].capitalizeFirstLetter();  
    };

    this.getCambio = function() {
        return metas['wm.dt_cambio'];
    };

    this.getCarroceria = function() {
        return metas['wm.dt_carroceria'];
    };

    this.getModelo = function() {
        return metas['wm.dt_mod'].trim();
    };

    this.getMarca = function() {
        return metas['wm.dt_marca'].capitalizeFirstLetterWords();
    };

    this.getVersao = function() {
        return metas["wm.dt_mmv"].split("|")[2].trim();
    };

    this.getEstado = function() {
        return metas["wm.dt_estado"].split("(")[1].split(")")[0].trim();
    };

    this.getCidade = function() {
        return metas["wm.dt_cidade"].trim();
    };

    this.getTipoAnunciante = function() {
        var tipo;

        switch (metas['wm.dt_tipoa']) {
            case "pessoafisica":
                tipo = "Particular"; break;
            case "concessionaria":
                tipo = "Concessionária"; break;
            default:
                tipo = metas['wm.dt_tipoa'].capitalizeFirstLetter();
        }

        return tipo;
    };

}