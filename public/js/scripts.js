console.log('hello, i am scripts.js');

var port = 8080; //does this have to be hidden in .env?

var socket = io.connect('localhost:' + port);

var pos = 0; //starting point
var id = Math.floor(Math.random() * 100); //random id for now.  will fill with database id later
var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); //random color for now.  can let player choose color later.

initData = {
  left: pos,
  id: id,
  color: randomColor
}

function renderPlayer(data) { //renders player on screen
  $player = $('<div>').addClass('player').attr('id', data.id);
  $player.css({
    background: data.color,
    left: data.left,
    color: data.color
  });
  addPlayerClickListener($player); //just for testing, before i get the typing stuff going
  $('#race-track').append($player);
};

function initializePlayer(initData) { //initialization function.  used so every user can render the other players on connect.
  socket.emit('new player', initData);
}

function addPlayerClickListener(el) { // just for testing until i get type stuff working
  el.on('click', function() {
    pos = pos + 1;
    data = {
      "left": pos + "px",
      "id": id
    };
    $(this).css(data);
    socket.emit('update player', data);
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
    socket.emit('update player', data);
  });
};

function updatePlayer(data) { //updates position for player.  will be constantly running
  var $player = $('#' + data.id)
    // console.log($player, data.left);
  $player.css({
    left: data.left + 'px'
  });
};

function updateAllPlayers(allPlayers) {
  $('#race-track').empty();
  for (i = 0; i < allPlayers.length; i++) {
    data = allPlayers[i];
    renderPlayer(data);
  }
};

function globalListener() { //listens for socket messages
  var socket = io('localhost:' + port);
  socket.on('update all players', function(allPlayerData) {
    updateAllPlayers(allPlayerData);
  });
};

$(function() { //start 'er upppppp
  initializePlayer(initData);
  setKeyboardListener();
  globalListener();
});
