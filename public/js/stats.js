console.log('stats');

function renderHandlebars(data) {
  var source = $('#handlebars-template').html();
  var template = Handlebars.compile(source);
  compiledHTML = template(data);
  $('#leaderboard').html(compiledHTML);
};

Handlebars.registerHelper('wpm', function(sentence, time) {
  var words = getWordsInSentence(sentence);
  var num = convertToNum(time);
  wpm = words / num * 60
  return wpm.toFixed(2)
});

Handlebars.registerHelper('cpm', function(sentence, time) {
  var chars = sentence.length;
  var num = convertToNum(time);
  cpm = chars / num * 60;
  return cpm.toFixed(2)
});

Handlebars.registerHelper('place', function(time, raceId) {
  var num = convertToNum(time);
  var players = getPlayersInRace(raceId)
  return players

});

function getFinishers() {
  $.ajax({
    url: '/api/finishers',
    method: 'get',
    success: function(data) {
      renderHandlebars(data);
      $("#simpleTable").stupidtable();
    }
  });
};

function getPlayersInRace(raceId) {
  $.ajax({
    url: '/api/finishers?search=' + raceId,
    method: 'get',
    success: function(data) {
      return data
    }
  });
}

function convertToNum(numString) {
  var array = numString.split(":");
  var m = Math.floor(array[0]) * 60;
  var s = Math.floor(array[1]);
  var c = Math.floor(array[2]) / 100;
  return c + s + m;
};

function getWordsInSentence(sentence) {
  var words = 0;
  var array = sentence.split("  ");
  array.forEach(function(array) {
    newArray = array.split(" ");
    words = words + newArray.length;
  })
  return words
};

function renderFinisher(finisher){
  var lines = finisher.body.split("\n");
  var $el = $('<div>').addClass('finisher content-block'); // <div class="haiku content-block">
  $el.append(  $('<h2>').addClass('username').text(finisher.username)  );  //   <h2 class='username'>
  for (var i = 0; i < lines.length; i++) { //   <p>
    $el.append( $('<p>').text(lines[i]) );
  }


function renderFinisherList(finishers, $list){
  $list.empty();
  var finisher;
  for (var i = 0; i < finishers.length; i++) {
    finisher = finishers[i];
    $finisherView = renderFinisher(finisher);
    $list.append($finisherView);
  }
}

$(function() {
  getFinishers();
  $('input#search-field').on('keyup', function(){ //
    var searchText = $(this).val();
    $.ajax({
      url: '/api/finishers?search=' + searchText,
      success: function(data){
        var finishers = data.finishers;
        var $list = $('#finisher-list');
        renderInfoList(finishers, $list)
      }
    })
  })
});
