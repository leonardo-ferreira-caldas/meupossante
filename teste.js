var db = require('./schema');

for (var i = 200000; i < 400000; i++) {
    db.crawler.collection.insert({url: "/compras/carros/" + i});
}