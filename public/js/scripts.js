console.log('hello, i am scripts.js');

var port = 8080; //does this have to be hidden in .env?

var socket = io.connect('localhost:' + port);

var pos = 0; //starting point
var id = Math.floor(Math.random() * 10000); //random id for now.  will fill with database id later
var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); //random color for now.  can let player choose color later

initData = {
  left: pos,
  id: id,
  color: randomColor
}

function renderPlayer(data) { //renders player on screen
  $player = $('<div>').addClass('player').attr('id', id);
  data = {
    left: data.left,
    id: data.id,
    color: data.color
  };
  $player.css({
    background: data.color
  });
  addPlayerClickListener($player); //just for testing, before i get the typing stuff going
  $('#race-track').append($player);
};

function initializePlayer(id) { //initializtion function.  used so every user can render the other players on connect.
  data = {
    left: 0,
    id: id,
    color: randomColor
  };
  socket.emit('connection', data);
}


function addPlayerClickListener(el) { // just for testing until i get type stuff working
  el.on('click', function() {
    pos = pos + 1;
    data = {
      "left": pos + "px",
      "id": id
    };
    $(this).css(data);
    socket.emit('connection', data);
  })
};

function setKeyboardListener() { //workin on this.  not functional yet.
  $('body').on('keydown', 'input', function(e) {
    e.preventDefault();
    pos = pos + 1;
    data = {
      "left": pos + "px",
      "id": id
    };
    console.log(data.left, data.id);
    el = $(this);
    updatePlayer(el, data);
    socket.emit('user', data);
  });
};

function updatePlayer(el, data) { //updates position for player.  will be constantly running
  player = el.find('#' + data.id)
  el.css({
    'left': data.left + 'px'
  });
};

function globalListener() { //listens for socket messages
  var socket = io('localhost:' + port);
  socket.on('global init user', function(data) {
    console.log(data);
    renderPlayer(data);
  })
  socket.on('globally sent message', function(data) {
    updatePlayer(data);
  });
};

$(function() { //start 'er upppppp
  initializePlayer(initData);
  setKeyboardListener();
  globalListener();
});
