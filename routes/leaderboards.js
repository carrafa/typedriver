console.log("let the games begin");

function getFinisherData(){
  $.ajax({
    url: '/api/finishers',
    success: function(Finisher){
      renderTemplate(Finisher);
    }
  });
}
function renderTemplate(data){
  var source = $('#leader-stat').html();
  var template = Handlebars.compile(source);
  var compiledHtml = template(data);
  $('#render-me').html(compiledHtml);
}
$(function(){
  getFinisherData();
});
