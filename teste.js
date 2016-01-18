var db = require('./schema');

db.cor.findOne({descricao: {$in: ["xxx"]}}, function(err, cores) {
    if (err) throw err;
    console.log(cores);
});