var express = require('express');
require('dotenv').load();
var app = express();
var server = require('http').Server(app);
var socketIo = require('socket.io');
var io = socketIo(server);

// database
var mongoPath = process.env.MONGOLAB_URI || 'mongodb://localhost/typist'
var mongoose = require('mongoose');
mongoose.connect(mongoPath);

// middleware
var morgan = require('morgan');
app.use(morgan('dev'));

app.set('view engine', 'ejs');

app.use(express.static('./public'));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

var loadUser = require('./middleware/loadUser');
app.use(loadUser);

// routes
var users = require('./routes/users');
app.use('/api/users', users);

app.get('/', function(req, res) {
  res.render('index');
});

//api route
var finishers = require('./routes/finishers');
app.use('/api/finishers', finishers);

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
