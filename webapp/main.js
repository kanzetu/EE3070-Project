const express = require('express');
const session = require('express-session');
const app = express();
const https = require('https');
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


app.use(session({
	secret: 'd7d0b1d404f9b69415622290fef6242c',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var dash_root = __dirname + '/dashboard'

// ROUTER

//****************************************************** Permission 0 ****************************************************
//	Login not required

app.use(express.static(dash_root + '/login', { extensions: ['html'] }));
app.get('/login', function(request, response) {
	response.sendFile(path.join(dash_root + '/login/login.html'));
});

app.get('/logout', function(request, response) {
    request.session.destroy();
	response.redirect('/login');
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var ip = request.headers['x-real-ip'] || request.connection.remoteAddress;
	if (username && password) {
		conn.query('SELECT * FROM staff WHERE web_username = ? AND web_password = ?', [username, crypto.createHash('sha256').update(password).digest('base64')], function(error, results, fields) {
			if (results.length > 0) {
			    var sql = "INSERT INTO login_log (user_name, ip,success) VALUES ('" +username +"','"+ ip +"', 1)";
			    conn.query(sql, function (err, result) {if (err) throw err});
				request.session.loggedin = true;
				request.session.username = username;
				request.session.permission = results[0].permission;
				response.redirect("/");
			} else {
			    var sql = "INSERT INTO login_log (user_name, user_pw,ip, success) VALUES ('"+ username +"', '"+password+"','"+ ip +"', 0)";
			    conn.query(sql, function (err, result) {if (err) throw err});
				response.redirect('/login');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});



//****************************************************** Permission 10 ****************************************************
// Block not logged in request, Redirect to login page
app.use(function(req, res, next) {
    if (req.session.username == undefined) {  
          res.redirect('/login');
    }else {
        next();
    }
});


//======================== Main router

app.use(express.static(dash_root));
app.use(cookieParser());


app.use(function(req, res, next) {
    if (req.session.permission <= 5) {  
          res.redirect('/login');
    }else {
        next();
    }
});



//****************************************************** Permission 255 ****************************************************
// Login Page
app.use(function(req, res, next) {
    if (req.session.permission <= 250) {  
          res.redirect('/login');
    }else {
        next();
    }
});

app.get('/', function (req, res,next) {
    res.sendFile(dash_root +'/dashboard.html');
});
app.get('/user', function (req, res,next) {
    res.send(req.session.username);
});


app.get('/dashboard', function (req, res,next) {
    res.sendFile(dash_root +'/dashboard.html');
});

//****************************************** API ********************************************************

app.get('/api/current_user', function (req, res) {
    var sql = 'SELECT * FROM staff s\
                WHERE s.web_username="' + req.session.username + '"'
    conn.query(sql, function (error, results, fields) {
        res.send(results);
    });
});
app.get('/api/dashboard_item', function (req, res) {
    var sql = 'SELECT * FROM dashboard_item';
    conn.query(sql, function (error, results, fields) {
        res.send(results);
    });
});


// 404

app.get('/404', function (req, res) {
    res.sendFile(dash_root +'/404.html');
});
app.use(function(req, res, next) {
  return res.status(404).sendFile(dash_root +'/404.html');
});

// ************************************START WEB SERVER************************************
//********** http-SSL
/*
https.createServer({
    key: fs.readFileSync('/opt/ssl/key.pem'),
    cert: fs.readFileSync('/opt/ssl/cert.pem'),
    passphrase: 'JFG@SDF8dfga4Ad14Fs'
}, app)
.listen(443);*/

//********** http
var port = 80
app.listen(port, function () {
  console.log('Web app listening on port ' + port + '!');
});

}

function extend(r){return[].slice.call(arguments,1).forEach(function(n){for(var c in n)r[c]=n[c]}),r}
function time_convert(o){var r=Math.floor(o/86400);o%=86400;var t=Math.floor(o/3600);return o%=3600,r+" days, "+t+" hours, "+Math.floor(o/60)+" mins"}