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
  $('#race-track').append($player);
};

function initializePlayer(initData) { //initialization function.  used so every user can render the other players on connect.
  socket.emit('new player', initData);
}

function setKeyboardListener() { //workin on this.  not functional yet.
  $('body').on('keydown', 'input', function(e) {
    if (sentenceChecker()) {;
      pos = pos + 1;
      data = {
        "left": pos + "px",
        "id": id
      };
    }
    socket.emit('update player', data);
  });
};

function sentenceChecker() { //check sentence
  var sentence = $('#sentence').text();
  var playerInput = $('#text-box').val();
  var match = sentence.substr(0, playerInput.length);
  if (playerInput === match) {
    return true;
  }
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
  socket.on('user disconnected', function(id) {
    console.log(id);
    $('#', id).remove();
  });
};

$(function() { //start 'er upppppp
  initializePlayer(initData);
  setKeyboardListener();
  globalListener();
});
