var db = require('./schema');

db.cidade.find(null, function(err, result) {

    var ids = result.map(function(value) {
        return value._id;
    });

    var now = Date.now();

    db.cidade.update({_id: {$in: ids}}, {nome_cidade: 'ZZZZZ'}, {multi: true}, function(err, result) {
        console.log(err);
        console.log(result);
        console.log("terminou primeiro:" + (Date.now() - now));

        var now2 = Date.now();

        var bulk = db.cidade.collection.initializeOrderedBulkOp();
        bulk.find({_id: {$in: ids}}).update({ $set: { nome_cidade: "YYYY" }} );
        bulk.execute(function(err) {
            console.log(err);
            console.log("terminou segundo:" + (Date.now() - now2));
        });

    });

});
