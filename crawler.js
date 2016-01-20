var Crawler         = require("crawler");
var url             = require('url');
var db              = require('./schema');
var CrawlerProvider = require('./crawler_provider');
var CrawlerController = require('./controllers/CrawlerController');
var CarroController   = require('./controllers/CarroController');
var maxConnections = 15;
var c = null;

var CrawlerCallback = function (error, result, $) {
        
    if (error || $ == undefined || !result.uri) return;

    result.uri = CrawlerController.normalizeUrl(result.uri);
    console.log(result.uri);

    $('a').each(function(index, a) {
        var url = $(a).attr('href');

        if (!CrawlerController.isValidUrl(url)) return;

        url = CrawlerController.normalizeUrl(url);

        CrawlerController.create(url);

        url = null;

    });

    console.log("Terminou iteração de Links!");

    CarroController.ifIsCarAndNotExists(result.uri, function() {
        CrawlerProvider.get(result.uri, db, $, function(json) {
            CarroController.create(json);
            json = null;
        });
    });

};

var CrawlerDrained = function() {

    console.log("Executou drained!");

    c = null;

    c = new Crawler({
        maxConnections : maxConnections,
        skipDuplicates: true,

        onDrain: CrawlerDrained,

        callback: CrawlerCallback
    });

    CrawlerController.fetch(100, function(url) {
        c.queue({
            url: url,
            timeout: 5000
        });
    }, function() {
        console.log("Executou drained no results callback!");
        setTimeout(CrawlerDrained, 500);
    });

};

c = new Crawler({
    maxConnections : maxConnections,
    skipDuplicates: true,

    onDrain: CrawlerDrained,

    callback: CrawlerCallback
});


c.queue('http://www.webmotors.com.br');