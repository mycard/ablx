var MongoClient = require('mongodb').MongoClient,
    format = require('util').format;
if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb-1.8'][0]['credentials'];
}
else {
    var mongo = {
        "hostname": "localhost",
        "port": 27017,
        "username": "",
        "password": "",
        "name": "",
        "db": "db"
    }
}
var generate_mongo_url = function (obj) {
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if (obj.username && obj.password) {
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else {
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}
var mdb = generate_mongo_url(mongo);

function out(doc) {
    MongoClient.connect(mdb, function (err, db) {
        if (err) throw err;
        var collection = db.collection('test_insert');
        collection.insert(doc, function (err, docs) {
            collection.count(function (err, count) {
                console.log(format("count = %s", count));
            });
        });
    });
}
function fi(dat, callback) {
    MongoClient.connect(mdb, function (err, db) {
        if (err) throw err;
        var collection = db.collection('test_insert');
        dat = dat || {};
        collection.find(dat, {'sort': [
            ['_id', -1 ]
        ]}).limit(20).toArray(function (err, results) {
                callback(results);
                db.close();
            });
    });
}
function fit(dat, callback) {
    MongoClient.connect(mdb, function (err, db) {
        if (err) throw err;
        var collection = db.collection('test_insert');
        dat = dat || {};
        collection.find(dat).toArray(function (err, results) {
            callback(results);
            db.close();
        });
    });
}
function fic(dat, callback) {
    MongoClient.connect(mdb, function (err, db) {
        if (err) throw err;
        var collection = db.collection('test_insert');
        collection.find(dat).count(function (err, results) {
            callback(results);
            db.close();
        });
    });
}
function fis(s, f, callback) {
    MongoClient.connect(mdb, function (err, db) {
        if (err) throw err;
        var collection = db.collection('test_insert');
        collection.find().skip(s).limit(f).toArray(function (err, results) {
            callback(results);
            db.close();
        });
    });
}
function del(x) {
    MongoClient.connect(mdb, function (err, db) {
        if (err) throw err;
        var collection = db.collection('test_insert');
        collection.remove(x, function (err, doc) {
            if (err) throw err;
            console.log(doc);
            db.close();
        });
    });
}
function fia(r) {
    var a,i,k={};
    for (a in r) {
        i=r[a].win;
        if (i in k){k[i].win +=1;}else{k[i]={win: 1, lose: 0}};
        i=r[a].lose;
        if (i in k){k[i].lose +=1;}else{k[i]={win: 0, lose: 1}};
    }
    return k
};
exports.del = del;
exports.out = out;
exports.fi = fi;
exports.fit = fit;
exports.fic = fic;
exports.fia = fia;
exports.fis = fis;