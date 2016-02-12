var unirest = require('unirest');

var regexURL = /<a(.+)href=(\'|\")([a-zA-Z0-9\s\.\\\/\:\&\?\%\-\=\;]+)(\"|\')/igm;

exports.extract = function(url, callback) {
    
    unirest.get(url)
        .end(function (response) {
            
            var matches;
            var extracted = [];

            while ((matches = regexURL.exec(response.body)) !== null) {
                extracted.push(matches[3]);
            }

            callback(extracted);
        
            
        });
    
};