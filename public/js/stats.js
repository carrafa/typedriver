console.log('stats');

function renderHandlebars(data) {
  var source = $('#handlebars-template').html();
  var template = Handlebars.compile(source);
  compiledHTML = template(data);
  $('#leaderboard').html(compiledHTML);
};

function getFinishers() {
  $.ajax({
    url: '/api/finishers',
    method: 'get',
    success: function(data) {
      renderHandlebars(data);
    }
  });
}

function convertToNum(numString) {
  var array = numString.split(":");
  var m = Math.floor(array[0]) * 60;
  var s = Math.floor(array[1]);
  var c = Math.floor(array[2]) / 100;
  console.log('convert to numresult: ' + c + s + m)
  return c + s + m;
};

function getWordsInSentence(sentence) {
  sentence.split(" ");
  console.log("getWordsInSentenceresult" + sentence.length)
  return sentence.length
}

function calculateWPM(sentence, numString) {
  time = convertToNum(numString);
  words = getWordsInSentence(sentence);
  return
}

function renderWPM() {
  $('tr').each(function(index) {
    var numString = $(this).find('.time').text();
    var sentence = $(this).find('.sentence').text();
    var wpm = calculateWPM(sentence, numString)
    console.log(wpm);
    $(this).find('.wpm').text(wpm);

  });
}

$(function() {
  getFinishers();
  renderWPM();

})
