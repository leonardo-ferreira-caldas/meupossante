var unirest = require('unirest');

var regexURL = /<a(.+)href=(\'|\")([a-zA-Z0-9\s\.\\\/\:\&\?\%\-\=\;]+)(\"|\')/igm;

exports.extract = function(uri, callback) {

    unirest.get(uri)
        .end(function (response) {

            var matches;
            var extracted = [];

            while ((matches = regexURL.exec(response.body)) !== null) {
                extracted.push(matches[3]);
            }

            callback(uri, extracted);


        });

};