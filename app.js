var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
app.use(express.static("public"));
var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(8888, function() {
    console.log('listening on *:8888');
});





io.on('connection', function(socket) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("texts").find().sort({ $natural: -1 }).limit(5).toArray(function(err, result) {
            db.close();
            for (var i = 0; i < result.length; i++) {
                io.emit('chat message', [result[result.length - 1 - i].valueOf()["text"], result[result.length - 1 - i].valueOf()["time"], result[result.length - 1 - i].valueOf()["user"], result[result.length - 1 - i].valueOf()["img"], result[result.length - 1 - i].valueOf()["upload"]]);
            }
        });

    });



    socket.on('chat message', function(msg) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");

            var date = new Date();
            var currenttime = date.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });




            var myobj = {
                text: msg[0],
                time: currenttime,
                user: msg[1],
                img: msg[2],
                upload: msg[3]
            };
            dbo.collection("texts").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection("texts").find().sort({ $natural: -1 }).limit(1).toArray(function(err, result) {
                db.close();
                console.log([result[0].valueOf()["text"], result[0].valueOf()["time"], result[0].valueOf()["user"], result[0].valueOf()["img"], result[0].valueOf()["upload"]]);
                io.emit('chat message', [result[0].valueOf()["text"], result[0].valueOf()["time"], result[0].valueOf()["user"], result[0].valueOf()["img"], result[0].valueOf()["upload"]]);
            });

        });


    });
});


var formidable = require('formidable');

app.post('/input', function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function(name, file) {
        if (file.name != null && file.name != '') {
            file.path = __dirname + '/public/uploads/' + file.name;
        }

    });

    form.on('file', function(name, file) {
        if (file.name != null && file.name != '') {
            console.log('Uploaded ' + file.name);
        }
    });
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/input', function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function(name, file) {
        if (file.name != null && file.name != '') {
            file.path = __dirname + '/public/uploads/' + file.name;
        }

    });

    form.on('file', function(name, file) {
        if (file.name != null && file.name != '') {
            console.log('Uploaded ' + file.name);
        }
    });
    res.sendFile(__dirname + '/public/index.html');
});
app.post('/input', function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function(name, file) {
        if (file.name != null && file.name != '') {
            file.path = __dirname + '/public/uploads/' + file.name;
        }

    });

    form.on('file', function(name, file) {
        if (file.name != null && file.name != '') {
            console.log('Uploaded ' + file.name);
        }
    });
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/admin', function(req, res) {
    res.sendFile(__dirname + '/public/admin.html');
});