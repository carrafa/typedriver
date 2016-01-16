var express = require('express');
require('dotenv').load();
var app = express();
var server = require('http').Server(app);
var socketIo = require('socket.io');
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

var allPlayers = {};


// socket stuff
io.on('connection', function(socket) {
  console.log('new connection');
  socket.on('new player', function(data) {
    var playerId = data.id;
    allPlayers[playerId] = data;
    io.sockets.emit('global init player', data);
  })
  socket.on('update player', function(data) {
    io.sockets.emit('update all players', allPlayers);
  });
});


// listen up
var port = parseInt(process.env.PORT) || 8080;

server.listen(port, function() {
  console.log('i am a server.  i am listening on port ' + port);
});
