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

function colorChanger() {
  $('#color-form').on('change', function() {
    color = $('#color').val();
    $('.username').css({
      color: color
    });
  });
};

function colorFormHandler() {
  $('#color-form').on('submit', function(e) {
    e.preventDefault();
    color = $('#color').val();
    data = {
      color: color
    };
    updateUser(data);
  });
};

function updateUser(data) {
  $.ajax({
    method: 'patch',
    url: '/api/users/',
    data: {
      user: data
    },
    success: function(data) {
      console.log("SUCCESSSSS", data);
    }
  })
}


$(function() {
  getProfileData();
  colorChanger();
  colorFormHandler();
});
