var Crawler         = require("crawler");
var url             = require('url');
var db              = require('./schema');
var CrawlerProvider = require('./crawler_provider');
var CrawlerController = require('./controllers/CrawlerController');
var CarroController   = require('./controllers/CarroController');
var found = [];

var CrawlerCallback = function (error, result, $) {
        
    if (error || $ == undefined || !result.uri) return;

    result.uri = CrawlerController.normalizeUrl(result.uri);
    console.log(result.uri);

    $('a').each(function(index, a) {
        var url = $(a).attr('href');

        if (!CrawlerController.isValidUrl(url)) return;

        url = CrawlerController.normalizeUrl(url);

        found.push({url: url});

        url = null;

    });

    CarroController.ifIsCarAndNotExists(result.uri, function() {
        CrawlerProvider.get(result.uri, db, $, function(json) {
            CarroController.create(json);
            json = null;
        });
    });

};

var CrawlerDrained = function() {

    CrawlerController.create(found, function() {

        found = [];

        c = null;

        c = new Crawler({
            maxConnections : 15,
            skipDuplicates: true,

            onDrain: CrawlerDrained,

            callback: CrawlerCallback
        });

        CrawlerController.fetch(200, function(url) {
            c.queue({
                url: url,
                timeout: 5000
            });
        });

    });

};

var c = new Crawler({
    maxConnections : 15,
    skipDuplicates: true,

    onDrain: CrawlerDrained,

    callback: CrawlerCallback
});


c.queue('http://www.webmotors.com.br');