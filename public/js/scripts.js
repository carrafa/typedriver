console.log('hello, i am scripts.js');

var socketUrl = location.origin;

var socket = io.connect(socketUrl);

function renderPlayer(data) { //renders player on screen
  $player = $('<div>').addClass('player').attr('id', data.id);
  $name = $('<div>').addClass('username').text(data.username);
  $player.css({
    "background-color": data.color,
    "left": data.left,
    "color": data.color
  });
  $($player).append($name);
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
      room = null;
      stopRaceClock();
    }
  });
};

// stop the cheaters!!
function pasteStopper() {
  $('input').bind('paste', function(e) {
    console.log('paste');
    e.preventDefault();
    $(this).val('(╯°□°）╯︵ ┻━┻ CHEATER!!!!!!!!!!');
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
    getUserAJAX(initData);
    // initData.username = $.cookie('username');
    // initializePlayer(initData);
    $(this).hide();
  })
};

function getUserAJAX(initData) {
  $.ajax({
    method: 'get',
    url: '/api/users',
    success: function(data) {
      console.log('ajax data.user: ', data.user[0]);
      console.log('data.user.username: ', data.user[0].username);
      initData.username = data.user[0].username;
      if (data.user[0].color) {
        initData.color = data.user[0].color;
      };
      console.log('initData: ', initData);
      initializePlayer(initData);
    }
  });
};

// chat stuff
function chatHandler() {
  $('#chat-input').on('keydown', function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      var $textField = $('#chat-input');
      var message = $textField.val();

      data = {
        message: message,
        user: $.cookie('username'),
        room: initData.room,
        color: initData.color
      }
      socket.emit('user chat', data);
      $textField.val('');
    }
  });
};

function renderChat(data) {
  var $username = $('<span>').text(data.user).css({
    "font-weight": 'bold',
    "margin-right": ".5em",
    color: data.color
  });
  var $message = $('<div>').addClass('message').text(data.message);
  $message.prepend($username);
  var $li = $('<li>').append($message);
  $('#chat-window').append($li);
}

function isRaceOver(raceId) {
  socket.emit('is race over', raceId)
  console.log(' i asked if it\'s over');
};

//socket stuff
function globalListener() { // listens for socket messages

  socket.on('update all players', function(allPlayerData) {
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
    $('#status').append($('<li>').text(
      'room is full! now you have to wait'));
  });

  socket.on('room', function(data) {
    initData.room = data.room
    room = data.room
    console.log(room);
  });

  socket.on('global chat', function(data) {
    renderChat(data);
    var $chatWindow = $('#chat-window');
    $chatWindow.scrollTop($chatWindow.prop("scrollHeight"));
  });

  socket.on('wait for finishers', function(data) {
    waitForFinishers();
  });

  socket.on('race not over', function(data) {
    console.log('race not over!!!', data);
  });

  socket.on('race over', function(raceId) {
    clearInterval(waitForFinishersId);
    console.log('race over!!!!', data);
  });

  socket.on('disconnect', function(data) {
    data.room = initData.room;
  });
};

$(function() { // start 'er upppppp
  setKeyboardListener();
  globalListener();
  joinRaceHandler();
  chatHandler();
  pasteStopper();
});
