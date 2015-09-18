// modules
var express = require('express')
  , http = require('http')
  , path = require('path')
  , morgan = require('morgan');

// app parameters
var app = express();

app.use(express.static(__dirname + '../../client'));
app.use(morgan('dev'));

//serve index
app.get('*', function (req, res) {
    res.sendFile('index.html', { 
    	root: __dirname + '../../client'
     });
});

// HTTP server
var server = http.createServer(app).listen(3001);

console.log('HTTP server listening on port ' + server.address().port);

// WebSocket server
var io = require('socket.io')(server);
io.on('connection', require('./socket'));

module.exports.app = app;