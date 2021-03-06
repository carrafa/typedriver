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
  if (isNaN(wpm)) {
    return 0
  } else {
    return wpm.toFixed(2)
  }
});

Handlebars.registerHelper('cpm', function(sentence, time) {
  var chars = sentence.length;
  var num = convertToNum(time);
  cpm = chars / num * 60;
  if (isNaN(cpm)) {
    return 0
  } else {
    return cpm.toFixed(2)
  }
});

function DNFFilterHandler() {
  $('#dnf-filter').on('click', function() {
    var bg = $(this).css("background-color")
    console.log('did i hide it?')
    $('.time').each(function() {
      if ($(this).text() === "DNF") {
        $(this).parent().toggle()
      };
    });
    if (bg === 'rgb(0, 0, 0)') {
      $(this).css('background-color', 'rgb(50, 50, 50)');
    }
    if (bg === 'rgb(50, 50, 50)') {
      $(this).css('background-color', 'rgb(0, 0, 0)');
    }
  });
};

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


function getFinishers(search) {
  url = '/api/finishers';
  if (search) {
    url = url + "?sentence=" + search;
  }
  $.ajax({
    url: url,
    method: 'get',
    success: function(data) {
      renderHandlebars(data);
      $("#simpleTable").stupidtable();
    }
  });
};

function searchFormHandler() {
  $('input#search').on('keyup', function() { //
    search = $('input#search').val();
    $('#leaderboard').empty();
    getFinishers(search);
  });
};

$(function() {
  getFinishers();
  searchFormHandler();
  DNFFilterHandler();
});
