var unirest = require('unirest');
var counter = 0;
var max = 1;
var timestamp = Date.now();
var regexURL = /<a(.+)href=(\'|\")([a-zA-Z0-9\s\.\\\/\:\&\?\%\-\=\;]+)(\"|\')/igm;
var matches;

for (var i = 1; i <= max; i++) {

    unirest.get('http://webmotors.com.br')
        .end(function (response) {

            while ((matches = regexURL.exec(response.body)) !== null) {
                console.log(matches[3]);
            }

            counter++;

            if (counter == max) {
                var totalTime =  Date.now() - timestamp;
                console.log('Requests %s, Avg Per Request: %s, Total time: %s', max, (totalTime / max), totalTime);
            }
        });

}