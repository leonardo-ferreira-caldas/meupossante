var Crawler         = require("crawler");
var url             = require('url');
var db              = require('./schema');
var CrawlerProvider = require('./crawler_provider');
var CrawlerController = require('./controllers/CrawlerController');
var CarroController   = require('./controllers/CarroController');
var maxConnections = 20;
var c = null;

var CrawlerCallback = function (error, result, $) {
        
    if (error || $ == undefined || !result.uri) return;

    result.uri = CrawlerController.sanitizeUrl(result.uri);
    console.log(result.uri);

    $('a').each(function(index, a) {
        var url = $(a).attr('href');

        if (!CrawlerController.isValidUrl(url)) return;

        url = CrawlerController.sanitizeUrl(url);

        CrawlerController.create(url);

    });

    CarroController.ifIsCarAndNotExists(result.uri, function() {
        CrawlerProvider.get(result.uri, db, $, function(json) {
            CarroController.create(json);
            json = null;
        });
    });

};

var CrawlerDrained = function() {

    c = null;

    c = new Crawler({
        maxConnections : maxConnections,
        skipDuplicates: true,

        onDrain: CrawlerDrained,

        callback: CrawlerCallback
    });

    CrawlerController.fetch(200, function(url) {
        c.queue({
            url: CrawlerController.normalizeUrl(url),
            timeout: 5000
        });
    });

};

c = new Crawler({
    maxConnections : maxConnections,
    skipDuplicates: true,

    onDrain: CrawlerDrained,

    callback: CrawlerCallback
});


c.queue('http://www.webmotors.com.br');