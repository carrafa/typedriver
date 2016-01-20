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
      console.log(data);
      renderHandlebars(data);
    }
  });
}

$(function() {
  getFinishers();
})
