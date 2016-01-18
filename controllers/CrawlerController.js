var db = require('./../schema');

var regUrl = new RegExp(".*(http:\/\/)(www\.webmotors|webmotors)\.com\.br.*");

exports.create = function(foundUrls, callback) {
    db.crawler.create(foundUrls, function(err) {
        if (err) console.log(err);
        callback();
    });
};

exports.fetch = function(lengthOffset, callback) {
    db.crawler.find({ind_visited: false}).limit(lengthOffset).exec(function(err, results) {
        if (err) throw err;

        var ids = results.map(function(value) {
            return value._id;
        });

        db.crawler.update({_id: {$in: ids}}, {ind_visited: true}, { multi: true }, function(err, updated) {
            if (err) throw err;

            for (var i = 0; i < results.length; i++) {
                callback(results[i].url);
            }
        });
        
    });
    
};

exports.isValidUrl = function(url) {
    return regUrl.test(url);
};

exports.normalizeUrl = function(url) {
    return url.toString().replace("https://www.webmotors.com.br/anunciante/login?action=salvaranuncio&returnUrl=", "").trim();
};