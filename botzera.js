var Crawler = require("./caldas_crawler/crawler");

var bot = new Crawler('http://webmotors.com.br', {
    connectionPoolSize: 500,
    flushSize: 50000,

    triggerAlmostDoneWith: 30,
    keepQueueOnMemory: true,
    avoidDuplicates: true,

    afterVisit: function(url, html) {


    },

    almostDone: function() {

        // bot.pushListIntoQueue([]);
    },

    onQueueEmpty: function() {

        // bot.pushListIntoQueue([]);
    },

    needsFlushing: function(arrayFound) {



    }
});

bot.run();