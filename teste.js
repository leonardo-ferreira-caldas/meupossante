var unirest = require('unirest');
var counter = 0;
var max = 1000;
var timestamp = Date.now();

for (var i = 1; i <= max; i++) {

    unirest.get('http://google.com')
        .end(function (response) {
            counter++;

            if (counter == max) {
                var totalTime =  Date.now() - timestamp;
                console.log('Requests %s, Avg Per Request: %s, Total time: %s', max, (totalTime / max), totalTime);
            }
        });

}