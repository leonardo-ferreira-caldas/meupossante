var ObjectMerger = require('./object_merger');
var Url = require('url');
var Extracter = require("./extracter");

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
    this.queue = [];
    this.found = [];
    this.populateIndex = 0;
    this.pooling = 0;
    
    this._init = function() {
        if (this.queue.length == 0) {
            this.queue = [this.url.href];
        }
    };
    
    this._inMemory = function(url) {
        return this.found.indexOf(url) > -1;
    };
    
    this._found = function(link) {
        this.found.push(link);
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
            if (!this._inMemory(list[i]) && this._isValidLink(list[i])) {
                this._found(list[i]);
            }
        }
    };
    
    this._getPoolEmptySize = function() {
        return this.options.connectionPoolSize - this.queue.length;
    };
    
    this._pushToQueue = function(list) {
        for (var i = 0; i < list.length; i++) {
            this.queue.push(list[i]);
        }
    }
    
    this._populate = function() {
        var offset = this._getPoolEmptySize();
        var currentFoundSize = this.found.length - this.populateIndex;
        
        if (currentFoundSize < offset) {
            offset = currentFoundSize;
        }
        
        var offsetEnd = offset + this.populateIndex;
        
        this._pushToQueue(this.found.slice(this.populateIndex, offsetEnd));
        this.populateIndex += offset; 
    };
    
    this._provider = function() {
        return this.queue.splice(0, this.queue.length);
    };
    
    this._checkPoolSize = function() {
        var pct = this.options.connectionPoolSize * 0.9;
        
        if (this.pooling < pct) {
            console.log('Found %s, Queue: %s, Pool: %s', this.found.length, this.queue.length, this.pooling);
            this._populate();
            this._crawl();
        }
    };
    
    this._crawl = function() {
        var urls = this._provider();
      
        for (var i = 0; i < urls.length; i++) {
            this.pooling++;
            
            Extracter.extract(urls[i], function(extractedUrls) {
                this.pooling--;
                this._add(extractedUrls);
                this._checkPoolSize();
            }.bind(this));
        }
        
        return null;
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

