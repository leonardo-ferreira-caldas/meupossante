var db = require('./../schema');
var Data = require('./../date');
var Arr = require('./../array');

var regUrl = new RegExp(".*(http:\/\/)(www\.webmotors|webmotors)\.com\.br.*");

exports.create = function(url) {

    try {
        db.crawler.collection.insert({u: url, v: false});
    } catch (err) {}

};

exports.fetch = function(lengthOffset, callback) {
    db.crawler.find({v: false}).limit(lengthOffset).exec(function(err, results) {
        if (err) throw err;

        if (results.length == 0) {
            return;
        }

        var ids = results.map(function(value) {
            return value._id;
        });

        db.crawler.update({_id: {$in: ids}}, {v: true}, { multi: true }, function(err, updated) {
            if (err) throw err;

            for (var i = 0; i < results.length; i++) {
                callback(results[i].u);
            }
        });

    });
    
};

exports.isValidUrl = function(url) {
    return regUrl.test(url);
};

// exports.compress = function(url) {
//     url = this.sanitizeUrl

// };

exports.sanitizeUrl = function(url) {
    var stringsToRemove = [
        "https://www.webmotors.com.br/anunciante/login?action=salvaranuncio&returnUrl=",
        "http://www.webmotors.com.br/anunciante/login?action=salvaranuncio&returnUrl=",
        "https://www.webmotors.com.br/anunciante/login?action=login&returnUrl=",
        "http://www.webmotors.com.br/anunciante/login?action=login&returnUrl=",
        ":80",
        "http://www.webmotors.com.br",
        "http://webmotors.com.br"
    ];

    for (var i = 0; i < stringsToRemove.length; i++) {
        url = url.toString().replace(stringsToRemove[i], "").trim();
    }

    return url;
};

exports.normalizeUrl = function(url) {
    return "http://www.webmotors.com.br" + url;
};