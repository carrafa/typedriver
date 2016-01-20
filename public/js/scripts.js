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

function initializePlayer(initData) { // initialization function.  used so every user can render the other players on connect.
  socket.emit('new player', initData);
}

function setKeyboardListener() { // listens for keyboard input
  $('body').on('keyup', 'input', function(e) {
    pos = (sentenceChecker() * 100) || pos;
    if (raceStart) {
      data = {
        "left": pos + "%",
        "id": id,
        "color": randomColor,
        "room": room,
        "username": initData.username
      };
      updateOnePlayer($('#' + id), data);
      socket.emit('update player', data);
    }
    if (raceStart && pos === 100) {
      time = $('#race-clock').text();
      data = {
        username: initData.username,
        raceId: raceId,
        sentence: $('#sentence').text(),
        time: time,
        room: room
      }
      socket.emit('player finishes', data);
      console.log('finished: ', data.time);
      raceStart = false;
      pos = 0;
      stopRaceClock();
    }
  });
};


function sentenceChecker() { // checks sentence
  var sentence = $('#sentence').text();
  var playerInput = $('#text-box').val();
  var match = sentence.substr(0, playerInput.length);
  if (playerInput === match) {
    return playerInput.length / sentence.length;
  } else {
    return false
  }
};

function renderFinishLine(numOfPlayers) {
  $('#finish-line').css({
    height: numOfPlayers * 20
  });
};

function updateOnePlayer(player, data) {
  player.remove();
  renderPlayer(data);
};

function updateAllPlayers(allPlayers) { // empties racetrack and updates with new player data
  $('#race-track').empty();
  for (i = 0; i < allPlayers.length; i++) {
    data = allPlayers[i];
    renderPlayer(data);
  }
  renderFinishLine(allPlayers.length);
};

function joinRaceHandler() {
  $('#ready').on('click', function(e) {
    e.preventDefault();
    // getUserByUsername()
    initData.username = $.cookie('username');
    initializePlayer(initData);
    $(this).hide();
  })
};

function getUserAJAX(callback) {
  $.ajax({
    method: 'get',
    url: '/api/users',
    success: function(data) {
      callback(data);
    }
  });
};

function globalListener() { // listens for socket messages

  socket.on('update all players', function(allPlayerData) {
    console.log(allPlayerData);
    updateAllPlayers(allPlayerData);
  });

  socket.on('user disconnected', function(id, allPlayerData) {
    $('#', id).remove();
    updateAllPlayers(allPlayerData);
  });

  socket.on('start race', function(sentence) {
    $('#status').append($('<li>').text('race tiiiime'));
    startRace(sentence);
  });

  // probably don't need this.
  socket.on('room full', function() {
    console.log('room fulllll!!!');
    $('#status').append($('<li>').text('room is full! now you have to wait'));
  });

  socket.on('room', function(data) {
    initData.room = data.room
    room = data.room
    console.log(room);
  });

  socket.on('disconnect', function(data) {
    data.room = initData.room;
  });
};

$(function() { // start 'er upppppp
  setKeyboardListener();
  globalListener();
  joinRaceHandler();
});
