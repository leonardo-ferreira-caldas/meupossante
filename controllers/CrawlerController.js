var db = require('./../schema');
var Data = require('./../date');
var Arr = require('./../array');

var regUrl = new RegExp(".*(http:\/\/)(www\.webmotors|webmotors)\.com\.br.*");

exports.create = function(urls) {

    var insertObjs = urls.map(function(url) {
        return {url: url, ind_visited: false};
    });

    db.crawler.collection.insert(insertObjs, {
        writeConcern: {w: 0},
        ordered: false
    });

};

exports.fetch = function(lengthOffset, callback, noResultsCallback) {
    db.crawler.find({ind_visited: false}).limit(lengthOffset).exec(function(err, results) {
        if (err) throw err;
        console.log(err);
        console.log(results);

        if (results.length == 0) {
            return noResultsCallback();
        }

        var ids = results.map(function(value) {
            return value._id;
        });

        db.crawler.collection.update({_id: {$in: ids}}, {ind_visited: true}, { multi: true, writeConcern: {w: 0} });
        
        for (var i = 0; i < results.length; i++) {
            callback(results[i].url);
        }

    });
    
};

exports.isValidUrl = function(url) {
    return regUrl.test(url);
};

exports.normalizeUrl = function(url) {
    var stringsToRemove = [
        "https://www.webmotors.com.br/anunciante/login?action=salvaranuncio&returnUrl=",
        "http://www.webmotors.com.br/anunciante/login?action=salvaranuncio&returnUrl=",
        "https://www.webmotors.com.br/anunciante/login?action=login&returnUrl=",
        "http://www.webmotors.com.br/anunciante/login?action=login&returnUrl=",
        ":80"
    ];

    for (var i = 0; i < stringsToRemove.length; i++) {
        url = url.toString().replace(stringsToRemove[i], "").trim();
    }

    return url;
};