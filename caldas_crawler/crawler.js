var ObjectMerger = require('./object_merger');
var Url = require('url');
var Extracter = require("./extracter");
var Compacter = require("./compacter");

module.exports = function(url, options) {
    var defaults = {
        connectionPoolSize: 10,
        flushSize: 100,
        triggerAlmostDoneWith: 10,
        keepQueueOnMemory: false,
        avoidDuplicates: false,
        almostDone: null,
        onQueueEmpty: null,
        needsFlushing: null,
        afterVisit: null
    };

    this.url = Url.parse(url);
    this.options = ObjectMerger.merge(defaults, options);

    this.waitingToProcess = [];
    this.waitingToProcessLength = 0;

    this.processing = [];
    this.processingLength = 0;

    this.processed = [];
    this.processedLength = 0;

    this.timer = Date.now();

    this._init = function() {
        if (this.waitingToProcessLength == 0) {
            this._addToProcessList('/');
        }
    };

    this._inMemory = function(uri) {
        return this.waitingToProcess[uri] || this.processing[uri] || this.processed[uri];
    };

    this._addToProcessList = function(uri) {
        this.waitingToProcess[uri] = 1;
        this.waitingToProcessLength++;
    };

    this._processing = function(uri) {
        this.processing[uri] = 1;
        this.processingLength++;
    };

    this._processed = function(uri) {
        this.processed[uri] = 1;
        this.processedLength++;
        this.processingLength--;
        delete this.processing[uri];
    };

    this._isValidLink = function(link) {
        var parsed = Url.parse(link);

        if (parsed.protocol != null && parsed.hostname != null) {
            var wwwHost = "www." + this.url.hostname.replace("www.", "");
            if (parsed.hostname != this.url.hostname && parsed.hostname != wwwHost) {
                return false;
            }
        } else {
            var invalids = ['javascript:', 'mailto:', 'skype:'];
            for (var i in invalids) {
                if (link.indexOf(invalids[i]) > -1) {
                    return false;
                }
            }
        }

        return true;
    };

    this._add = function(list) {
        if (typeof list == 'string') list = [list];

        for (var i = 0; i < list.length; i++) {
            var compacted = Compacter.compact(list[i]);

            if (this._isValidLink(list[i]) && !this._inMemory(compacted)) {
                this._addToProcessList(compacted);
            }
        }
    };

    this._provider = function() {
        var provider = [];
        var offsetControl = this.options.connectionPoolSize - this.waitingToProcess.length;

        for (var url in this.waitingToProcess) {
            if (offsetControl == 0) {
                break;
            }

            provider.push(url);
            delete this.waitingToProcess[url];
            this.waitingToProcessLength--;

            offsetControl--;
        }

        return provider;
    };

    this._checkPoolSize = function() {
        var pct = this.options.connectionPoolSize * 0.9;

        if (this.processingLength < pct) {
            this._log();
            this._crawl();
        }
    };

    this._crawl = function() {
        var urls = this._provider();

        for (var i = 0; i < urls.length; i++) {
            var uncompacted = Compacter.uncompact(urls[i]);

            this._processing(urls[i]);

            Extracter.extract(uncompacted, function(uncompactedURI, extractedUrls) {
                this._processed(Compacter.compact(uncompactedURI));

                this._add(extractedUrls);
                this._checkPoolSize();
            }.bind(this));
        }

        return null;
    };


    this._log = function() {
        // if (this.visited < this.options.connectionPoolSize) return;

        var time = Date.now() - this.timer;
        var avg = time / this.options.connectionPoolSize;
        this.timer = Date.now();

        console.log('Waiting to process: %s, Processing: %s, Processed: %s, Avg Time: %s, Time: %s!', this.waitingToProcessLength, this.processingLength, this.processedLength, avg, time);
    };

    this.run = function() {
        try {

            this._init();
            this._crawl();

        } catch (err) {
            console.log("Um erro ocorreu:\n%s", err);
        }
    };
};

