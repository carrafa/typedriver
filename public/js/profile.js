console.log('profile');



function renderHandlebars(data) {
  var source = $('#handlebars-template').html();
  var template = Handlebars.compile(source);
  compiledHTML = template(data);
  $('#profile-container').html(compiledHTML);
};

function getProfileData() {
  $.ajax({
    method: 'get',
    url: '/api/users',
    success: function(data) {
      console.log(data)
      renderHandlebars(data);
    }
  });
};


$(function() {
  getProfileData();
})
