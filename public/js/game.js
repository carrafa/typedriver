//game logic here
console.log('hello, i am game.js');


var pos = 0; // starting point
var speed = 1; //speed.  starts at 1.  could change depending on how fast the game will be
var m = 0; // minutes on clock
var s = 0; // seconds on clock
var c = 0; // centiseconds on clock
var id = Math.floor(Math.random() * 100); //random id for now.  will fill with database id later
var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); //random color for now.  can let player choose color later.
var countdown = 5; // countdown to when the race starts

initData = { //initialization data to render player.
  id: id, //will be userID
  left: pos,
  color: randomColor // player can choose eventually
}

var raceStart = false;

function startRace() {
  var intervalID = window.setInterval(function() {
    console.log(countdown);
    $('#timer').text(countdown);
    if (countdown === 0) {
      $('#timer').text('go!');
      raceStart = true;
    }
    if (countdown < 0) {
      $('#timer').text('');
      clearInterval(intervalID);
      startRaceClock();
      countdown = 5;
    }
    countdown--;
  }, 1000)
};


function startRaceClock() {
  clockID = window.setInterval(function() {
    c++;
    if (c === 100) {
      c = 0;
      s++;
    };
    if (s === 60) {
      s = 0;
      m++;
    }
    renderTime(m, s, c);
  }, 10)
};

function renderTime(m, s, c) {
  if (s < 10) {
    s = "0" + s;
  }
  if (m < 10) {
    m = "0" + m;
  }
  if (c < 10) {
    c = "0" + c;
  }
  $('#race-clock').text(m + ":" + s + ":" + c);
};

function stopRaceClock() {
  s = 0;
  m = 0;
  window.clearInterval(clockID);
};
