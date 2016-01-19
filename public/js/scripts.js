console.log('hello, i am scripts.js');

var port = 8080; //does this have to be hidden in .env?

var socket = io.connect('localhost:' + port);

function renderPlayer(data) { //renders player on screen
  $player = $('<div>').addClass('player').attr('id', data.id);
  $player.css({
    "background-color": data.color,
    "left": data.left,
    "color": data.color
  });
  $('#race-track').append($player);
};

function initializePlayer(initData) { //initialization function.  used so every user can render the other players on connect.
  socket.emit('new player', initData);
}

function setKeyboardListener() { //listens for keyboard input
  $('body').on('keyup', 'input', function(e) {
    pos = (sentenceChecker() * 100) || pos;
    if (raceStart) {
      data = {
        "left": pos + "%",
        "id": id,
        "color": randomColor
      };
    }
    updateOnePlayer($('#' + id), data);
    socket.emit('update player', data);
    console.log(pos);
  });
};

function sentenceChecker() { // checks sentence
  var sentence = $('#sentence').text();
  var playerInput = $('#text-box').val();
  var match = sentence.substr(0, playerInput.length);
  console.log('match: ', match);
  console.log('playerInput: ', playerInput);
  if (playerInput === match) {
    return playerInput.length / sentence.length;
  } else {
    return false
  }
};

function renderFinishLine(numOfPlayers) {
  $('#finish-line').css({
    height: numOfPlayers * 20
  })
}

function updateOnePlayer(player, data) {
  player.remove();
  renderPlayer(data);
  console.log('one player updated');
}

function updateAllPlayers(allPlayers) { // empties racetrack and updates with new player data
  $('#race-track').empty();
  for (i = 0; i < allPlayers.length; i++) {
    data = allPlayers[i];
    renderPlayer(data);
  }
  renderFinishLine(allPlayers.length);
};

function globalListener() { // listens for socket messages

  socket.on('update all players', function(allPlayerData) {
    updateAllPlayers(allPlayerData);
  });

  socket.on('user disconnected', function(id, allPlayerData) {
    console.log(id);
    $('#', id).remove();
    updateAllPlayers(allPlayerData);
  });

  socket.on('start race', function(sentence) {
    $('#status').append($('<li>').text('race tiiiime'));
    startRace(sentence);
  })

  socket.on('room full', function() {
    $('#status').append($('<li>').text('room is full! now you have to wait'));
  })
};

$(function() { // start 'er upppppp
  initializePlayer(initData);
  setKeyboardListener();
  globalListener();
});
