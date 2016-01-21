console.log('profile');



function renderHandlebars(data, el) {
  var source = $('#handlebars-template').html();
  var template = Handlebars.compile(source);
  compiledHTML = template(data);
  el.html(compiledHTML);
};

function getProfileData() {
  el = $('#profile-container')
  $.ajax({
    method: 'get',
    url: '/api/users',
    success: function(data) {
      console.log(data)
      renderHandlebars(data, el);
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
};

function deleteHandlerOne() {
  $('.delete').on('click', function(e) {
    e.preventDefault();
    $('#delete-sequence').text('seriously???? why?????');
    $('#delete-sequence-2').show();
  });
};

function deleteHandlerTwo() {
  $('.delete-2').on('click', function(e) {
    e.preventDefault();
    $('#delete-sequence').text(
      'No. You are wrong.  It\'s because you are boring.  Type your dumb password in again to confirm and I\'ll delete your dumb profile.'
    );
    $('#delete-sequence-2').hide();
    $('#delete-sequence-3').show();
  });
};

function deleteHandlerThree() {
  $('.delete-3').on('click', function(e) {
    e.preventDefault();
    $('#delete-sequence').text(
      'Ok fine.  fair enough.  : (    Type your password in again to confirm and I\'ll pretend like you were never born.'
    );
    $('#delete-sequence-2').hide();
    $('#delete-sequence-3').show();
  });
};


$(function() {
  getProfileData();
  colorChanger();
  colorFormHandler();
  deleteHandlerOne();
  deleteHandlerTwo();
  deleteHandlerThree();
});
