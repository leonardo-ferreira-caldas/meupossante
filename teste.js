var http = require('http');
var c = Date.now();
var finished = 0;

http.globalAgent.maxSockets = 9999;

for (var i = 0; i < 1000; i++) {

    http.get({
        host: 'google.com',
        path: '/',
        agent: false,
        port: 80
    }, function (response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {

            finished++;

            if (finished == 1000) {
                console.log(Date.now() - c);
            }

        });
    });

}