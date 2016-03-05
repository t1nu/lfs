var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());

var pg = require('pg');
// console.log('host: ' + process.env.OPENSHIFT_POSTGRESQL_DB_HOST);

// var connectionString = 'postgres://' + process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME + ':' + process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD + '@' + process.env.OPENSHIFT_POSTGRESQL_DB_ + ':5432/lfs';
var connectionString = process.env.OPENSHIFT_POSTGRESQL_DB_URL;
//var connectionString = 'postgres://dbAdmin:asdfasdf@mhdbinstance.cyvr2owy5pvv.eu-west-1.rds.amazonaws.com:5432/lfs';

var request = require('request');
var shortid = require('shortid');

//Mailgun
var api_key = 'key-38ddf96fbad6c8bb0e6fa3c20fc6fab5';
var domain = 'sandboxa3b7d53c9b08456c8a915da934cf4c86.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

app.use('/lfs', express.static(__dirname + '/app'));

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
    // var results = [];
    var data = req.body;
    data.request_user.key = shortid.generate();
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        var query = client.query("INSERT INTO lfs_request(model, request_user) VALUES ($1, $2)", [data.model, data.request_user]);

        var query = client.query("SELECT request_id, request_user as user2, model FROM lfs_request");

        query.on('row', function(row) {
            // results.push(row);
        });
        
        query.on('end', function() {
            done();
            return res.json({"key": data.request_user.key});
        });

    });

});

app.post('/sendMail', function(req, res) {
    var msg = req.body;
    var data = {
        from: 'Wavebusters <martin.haefelfinger@gmail.com>',
        to: msg.to,
        subject: msg.subject,
        text: msg.message,
        html: msg.message
    };
     
    mailgun.messages().send(data, function (error, body) {
        console.log(body);
        console.log(error);
        return res.json([]);
    });

});

app.post('/paypal', function(req,res){

res.send(200);
console.log("IN PAYPAL !! req.body : "+req.body);
var ipn = require('paypal-ipn');
ipn.verify(req.body, function callback(err, msg) {
      if (err) {
        console.log("Error:"+err);
      } else {
        //Do stuff with original params here
          console.log("req.body.payment_status :"+req.body.payment_status+" msg: "+msg);
          res.end();
        if (req.body.payment_status == 'Completed') {
          //Payment has been confirmed as completed
            console.log('payment confirmed');
        }
      }
    });
});


app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", function () {
  console.log('Example app listening on port:' + process.env.OPENSHIFT_NODEJS_PORT);
});