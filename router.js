var server,
    http = require('http'),
    url = require('url'),
    fs = require("fs"),
    abx = require('./db.js'),
    jade = require('jade'),
    qs = require('querystring'),
    bs = require('mongodb').BSONPure;

server = http.createServer(function (req, res) {
    var path = url.parse(req.url),
        parameter = qs.parse(path.query);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    function file(f) {
        fs.readFile(f, function (err, data) {
            if (err) {
                throw err;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    };
    function jad(r,j) {
        jade.renderFile(j, {items: r}, function (err, html) {
            console.log(err);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end()
        });
    }
    switch (path.pathname) {
        case "/index":
            file('views/2.html');
            break;
        case "/":
            file('views/index.html');
            break;
        case "/ygopropwtsp":
            file('views/tsp.html');
            break;
        case "/show":
            abx.fi({},function (r) {jad(r,'views/new.jade')});
            break;
        case "/show2":
            var o_id = bs.ObjectID.createFromHexString(String(JSON.parse(JSON.stringify(parameter)).id));
            abx.fi({"_id": { $lt: o_id}}, function (r) {jad(r,'views/new.jade')});
        break;
        case "/send":
            abx.out(parameter);
            res.writeHead(302, {'Location': "/"});
            res.end();
            break;
        case "/del":
            console.log(JSON.parse(JSON.stringify(parameter)).id);
            var o_id = bs.ObjectID.createFromHexString(String(JSON.parse(JSON.stringify(parameter)).id));
            abx.del({"_id": o_id});
            res.writeHead(302, {'Location': "/ygopropw"});
            res.end();
            break;
        case "/delt":
            console.log(JSON.parse(JSON.stringify(parameter)).time);
            abx.del({"time":JSON.parse(JSON.stringify(parameter)).time});
            res.writeHead(302, {'Location': "/ygopropw"});
            res.end();
            break;
        case "/ts":
            file('views/ts.html');
            break;
        case "/fit":
            console.log(parameter);
            var tt = JSON.parse(JSON.stringify(parameter));
            abx.fit({ "time": { $gte: tt.t1, $lte: tt.t2 } }, function (r) {jad(r,'views/sh.jade')});
            break;
        case "/fic":
            console.log(parameter);
            var tt = JSON.parse(JSON.stringify(parameter));
            abx.fic({ "time": { $gte: tt.t1, $lte: tt.t2 }, win: tt.lx}, function (w) {
                abx.fic({ "time": { $gte: tt.t1, $lte: tt.t2 }, lose: tt.lx}, function (l) {
                    res.write(tt.lx + "   WIN:" + JSON.stringify(w) + "   LOSE:" + JSON.stringify(l));
                    res.end();
                });
            });
            break;
        case "/fis":
            console.log(parameter);
            var tt = JSON.parse(JSON.stringify(parameter));
            abx.fis(Number(tt.s), Number(tt.f), function (r) {
                res.write(JSON.stringify(r));
                res.end();
            });
            break;
        case "/fia":
            var tt = JSON.parse(JSON.stringify(parameter));
            abx.fit({ "time": { $gte: tt.t1, $lte: tt.t2 } }, function (r) {jad(r,'views/fia.jade')});
            break;
        case "/ygopropw":
            abx.fi({}, function (r) {jad(r,'views/ypw.jade')});
            break;
        case "/ygopropw2":
            var o_id = bs.ObjectID.createFromHexString(String(JSON.parse(JSON.stringify(parameter)).id));
            abx.fi({"_id": { $lt: o_id}}, function (r) {jad(r,'views/ypw.jade')});
            break;
        default:
            res.end("error,404");
            break;
    }
});
server.listen(1338);
console.log("Server running");