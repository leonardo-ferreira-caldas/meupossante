var db = require('./../schema');
var Data = require('./../date');

var regUrl = new RegExp(".*(http:\/\/)(www\.webmotors|webmotors)\.com\.br.*");

exports.create = function(foundUrls, callback) {
    console.log(Data.getFormattedDate() + " / Creating links: " + foundUrls.length);

    var rows = foundUrls.map(function(value) {
        return {url: value, ind_visited: false};
    });

    db.crawler.collection.insert(rows, {ordered: false});

    rows = null;

    callback();

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
        "http://www.webmotors.com.br/anunciante/login?action=login&returnUrl=",
        ":80"
    ];

    for (var i = 0; i < stringsToRemove.length; i++) {
        url = url.toString().replace(stringsToRemove[i], "").trim();
    }

    return url;
};