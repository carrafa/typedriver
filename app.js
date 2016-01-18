var express = require('express');
require('dotenv').load();
var app = express();
var server = require('http').Server(app);
var socketIo = require('socket.io');
var request = require('request');
var io = socketIo(server);

// middleware
var morgan = require('morgan');
app.use(morgan('dev'));

app.set('view engine', 'ejs');

app.use(express.static('./public'));

// routes
app.get('/', function(req, res) {
  res.render('index');
});

// sockets
var socketHandler = require('./lib/sockets');
io.on('connection', function(socket) {
  socketHandler(socket, io);
});

// listen up
var port = parseInt(process.env.PORT) || 8080;

server.listen(port, function() {
  console.log('i am a server.  i am listening on port ' + port);
});
