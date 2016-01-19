var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/meupossante');
var Schema = mongoose.Schema;

var Carro = mongoose.model('carro', new Schema({
    preco: {
        type: String,
        get: function(num) {
            return (num / 100).toFixed(2);
        },  
        set: function(num) {
            return parseFloat(num.replace(",", ".")) * 100;
        }
    },
    slug: {
        type: String,
        unique : true,
        set: function(value) {
            return value.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        }
    },
    descricao_carro:    { type: String, required: true, trim: true },
    foto_capa:          { type: String, required: true, trim: true },
    kilometragem:       { type: String, required: true },
    fk_cambio:          { type: Schema.Types.ObjectId, ref: "Cambio",         required: true },
    fk_carroceria:      { type: Schema.Types.ObjectId, ref: "Carroceria",     required: true },
    fk_cor:             { type: Schema.Types.ObjectId, ref: "Cor",            required: true },
    fk_combustivel:     { type: Schema.Types.ObjectId, ref: "Combustivel",    required: true },
    fk_marca:           { type: Schema.Types.ObjectId, ref: "Marca",          required: true },
    fk_modelo:          { type: Schema.Types.ObjectId, ref: "Modelo",         required: true },
    fk_cidade:          { type: Schema.Types.ObjectId, ref: "Cidade",         required: true },
    fk_versao:          { type: Schema.Types.ObjectId, ref: "Versao",         required: true },
    fk_tipo_anunciante: { type: Schema.Types.ObjectId, ref: "TipoAnunciante", required: true },
    portas:             { type: Number, required: true },
    final_placa:        { type: Number, required: true },
    ano:                { type: Number, required: true },
    modelo:             { type: Number, required: true },
    url:                { type: String, required: true, trim: true, unique : true },
    ind_aceita_troca:   { type: Boolean, required: true, default: false },
    ind_blindagem:      { type: Boolean, required: true, default: false },
    ind_colecionador:   { type: Boolean, required: true, default: false },
    ind_veiculo_novo:   { type: Boolean, required: true },
    ind_deficiente_fisico: { type: Boolean, required: true, default: false },
    ind_ativo:          { type: Boolean, required: true, default: true },
    opcionais:          [{ type: Schema.Types.ObjectId, ref: "Opcional" }],
    documentacoes:      [{ type: Schema.Types.ObjectId, ref: "Documentacao" }],
    fotos:              { type: Array, required: true},
    data_anuncio:       { type: Date, required: true },
    descricao_anunciante: String,
    data_ult_atualizacao: { type: Date, default: Date.now },
    data_criacao:       { type: Date, default: Date.now }
}, { collection: 'carro' }));

var Crawler = mongoose.model('crawler', new Schema({
    url: { type: String, required: true },
    ind_visited: { type: Boolean, default: false }
}, { collection: 'crawler' }));

var Cambio = mongoose.model('cambio', new Schema({
    descricao: { type: String, required: true, trim: true }
}, { collection: 'cambio' }));

var Cor = mongoose.model('cor', new Schema({
    descricao: { type: String, required: true, trim: true }
}, { collection: 'cor' }));

var Combustivel = mongoose.model('combustivel', new Schema({
    descricao: { type: String, required: true, trim: true }
}, { collection: 'combustivel' }));

var Carroceria = mongoose.model('carroceria', new Schema({
    descricao: { type: String, required: true, trim: true }
}, { collection: 'carroceria' }));

var Estado = mongoose.model('estado', new Schema({
    nome_estado: { type: String, required: true, trim: true },
    sigla: { type: String, required: true, trim: true }
}, { collection: 'estado' }));

var Cidade = mongoose.model('cidade', new Schema({
    nome_cidade: { type: String, required: true, trim: true },
    fk_estado: { type: Schema.Types.ObjectId, required: true, trim: true }
}, { collection: 'cidade' }));

var Marca = mongoose.model('marca', new Schema({
    descricao: { type: String, required: true, trim: true }
}, { collection: 'marca' }));

var Opcional = mongoose.model('opcional', new Schema({
    descricao: { type: String, required: true, trim: true }
}, { collection: 'opcional' }));

var Documentacao = mongoose.model('documentacao', new Schema({
    descricao: { type: String, required: true, trim: true }
}, { collection: 'documentacao' }));

var TipoAnunciante = mongoose.model('tipo_anunciante', new Schema({
    descricao: { type: String, required: true, trim: true }
}, { collection: 'tipo_anunciante' }));

var Modelo = mongoose.model('modelo', new Schema({
    descricao: { type: String, required: true, trim: true },
    fk_marca: Schema.Types.ObjectId
}, { collection: 'modelo' }));

var Versao = mongoose.model('versao', new Schema({
    descricao: { type: String, required: true, trim: true },
    fk_modelo: Schema.Types.ObjectId
}, { collection: 'versao' }));

exports.carro = Carro;
exports.versao = Versao;
exports.modelo = Modelo; 
exports.marca = Marca;
exports.tipo_anunciante = TipoAnunciante;
exports.documentacao = Documentacao;
exports.opcional = Opcional;
exports.estado = Estado;
exports.cidade = Cidade;
exports.carroceria = Carroceria;
exports.combustivel = Combustivel;
exports.cor = Cor;
exports.cambio = Cambio;
exports.crawler = Crawler;