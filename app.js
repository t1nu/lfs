var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());

var pg = require('pg');
var connectionString = 'postgres://dbAdmin:asdfasdf@mhdbinstance.cyvr2owy5pvv.eu-west-1.rds.amazonaws.com:5432/lfs';

app.use('/lfs', express.static(__dirname + '/app'));
// app.use('/lfs', express.static(__dirname + '/app'));

app.get('/requestList', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        var query = client.query("SELECT request_id, request_user as user, model, timestamp_creation creationDate FROM lfs_request");

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            return res.json(results);
        });

    });

});

app.post('/requestList', function(req, res) {
    var results = [];
    var data = req.body;
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        var query = client.query("INSERT INTO lfs_request(model, request_user) VALUES ($1, $2)", [data.model, data.request_user]);

        var query = client.query("SELECT request_id, request_user as user2, model FROM lfs_request");

        query.on('row', function(row) {
            results.push(row);
        });
        
        query.on('end', function() {
            done();
            return res.json(results);
        });

    });

});

app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port:' + process.env.PORT);
});