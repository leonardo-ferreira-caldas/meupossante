var db = require('./../schema');
var Data = require('./../date');

var regUrl = new RegExp(".*(http:\/\/)(www\.webmotors|webmotors)\.com\.br.*");

exports.create = function(foundUrls, callback) {
    console.log(Data.getFormattedDate() + " / Creating links: " + foundUrls.length);

    db.crawler.collection.insert(foundUrls.map(function(value) {
        return {url: value, ind_visted: false};
    }), function(err) {
        console.log(Data.getFormattedDate() + " / Links created!");
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
    var stringsToRemove = [
        "https://www.webmotors.com.br/anunciante/login?action=salvaranuncio&returnUrl=",
        "http://www.webmotors.com.br/anunciante/login?action=salvaranuncio&returnUrl=",
        "https://www.webmotors.com.br/anunciante/login?action=login&returnUrl=",
        "http://www.webmotors.com.br/anunciante/login?action=login&returnUrl="
    ];

    for (var i = 0; i < stringsToRemove.length; i++) {
        url.toString().replace(stringsToRemove[i], "").trim();
    }

    return url;
};