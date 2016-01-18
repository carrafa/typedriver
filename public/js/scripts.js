// console.log('hello, i am scripts.js');
//
// var port = 8080; //does this have to be hidden in .env?
//
// var socket = io.connect('localhost:' + port);
//
// var pos = 0; // starting point
// var speed = 1; //speed.  starts at 1.  could change depending on how fast the game will be
// var id = Math.floor(Math.random() * 100); //random id for now.  will fill with database id later
// var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); //random color for now.  can let player choose color later.
// var countdown = 5;
//
// initData = {
//   id: id,
//   left: pos,
//   color: randomColor
// }
//
// var raceStart = false;
//
// function startRace() {
//   var intervalID = window.setInterval(function() {
//     console.log(countdown);
//     $('#timer').text(countdown);
//     if (countdown === 0) {
//       $('#timer').text('go!');
//       raceStart = true;
//     }
//     if (countdown < 0) {
//       $('#timer').text('');
//       clearInterval(intervalID);
//       countdown = 5;
//     }
//     countdown--;
//   }, 1000)
// }

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
  $('body').on('keydown', 'input', function(e) {
    if (raceStart && sentenceChecker()) {;
      pos = pos + speed;
      data = {
        "left": pos + "px",
        "id": id
      };
    }
    socket.emit('update player', data);
  });
};

function sentenceChecker() { // checks sentence
  var sentence = $('#sentence').text();
  var playerInput = $('#text-box').val();
  var match = sentence.substr(0, playerInput.length);
  if (playerInput === match) {
    return true;
  }
};

function updateAllPlayers(allPlayers) { // empties racetrack and updates with new player data
  $('#race-track').empty();
  for (i = 0; i < allPlayers.length; i++) {
    data = allPlayers[i];
    renderPlayer(data);
  }
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

  socket.on('start race', function() {
    $('#status').append($('<li>').text('race tiiiime'));
    startRace();
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
