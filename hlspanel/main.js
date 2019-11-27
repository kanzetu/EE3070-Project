const express = require('express');
const session = require('express-session');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const cluster = require('cluster');
const cookieParser = require("cookie-parser");


const fs = require('fs');
const os = require('os');

if (cluster.isMaster) {
  cluster.fork();

  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
  });
}
if (cluster.isWorker) {
// INITIAL

//************** Mysql connection
/*
const conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'ee3070',
  password : 'ee3070',
  database : 'office'
});

function disconnect_handler() {
   let conn = mysql.createConnection(mysql_config);
    conn.connect(err => {
        (err) && setTimeout('disconnect_handler()', 2000);
    });

    conn.on('error', err => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            // db error reconnect
            disconnect_handler();
        } else {
            throw err;
        }
    });
    exports.conn = conn;
}

exports.disconnect_handler =  disconnect_handler;
*/

app.use(session({
	secret: 'd7d0b1d404f9b69415622290fef6242c',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var dash_root = __dirname

// ROUTER

//****************************************************** Permission 0 ****************************************************
//	Login not required


app.use(express.static(dash_root));

app.get('/', function (req, res,next) {
    res.sendFile(dash_root +'/index.html');
});
app.get('/camara', function (req, res,next) {
    res.sendFile(dash_root +'/camara.html');
});

//********** http
var port = 80
app.listen(port, function () {
  console.log('Web app listening on port ' + port + '!');
});

}

function extend(r){return[].slice.call(arguments,1).forEach(function(n){for(var c in n)r[c]=n[c]}),r}
function time_convert(o){var r=Math.floor(o/86400);o%=86400;var t=Math.floor(o/3600);return o%=3600,r+" days, "+t+" hours, "+Math.floor(o/60)+" mins"}