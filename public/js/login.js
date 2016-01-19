console.log('hello, i am login.js');

function checkCookie() {
  if ($.cookie('token')) {
  console.log('Already logged in!');
  } else {
  $('#modal').toggle();
  }
};


//----------------------------
//---------- Signup ----------
//----------------------------
function createUser(userData, callback) {
  $.ajax({
    method: 'post',
    url: '/api/users',
    data: {
      user: userData
    },
    success: function(data) {
      callback(data);
    }
  });
}

function setSignUpFormHandler() {
  $('form#signup').on('submit', function(e) {
    e.preventDefault();

    // obtain the username from form
    var usernameField = $(this).find('input[name="username"]');
    var usernameText = usernameField.val();
    usernameField.val('');

    // obtain the password from form
    var passwordField = $(this).find('input[name="password"]');
    var passwordText = passwordField.val();
    passwordField.val('');

    // organize the data to be sent
    var userData = {
      username: usernameText,
      password: passwordText
    };
    console.log('userdata', userData);

    // create a new user
    createUser(userData, function(user) {
    console.log(user);
 });

    // login new user
    logInUser(usernameText, passwordText, function(data) {
      $.cookie('token', data.token); // save the token as a cookie
      console.log('Token:', $.cookie('token'));
    });

    // close modal
    $('#modal').toggle();

  });
}


//----------------------------
//---------- Login -----------
//----------------------------
function logInUser(usernameAttempt, passwordAttempt, callback) {
  $.ajax({
    method: 'post',
    url: '/api/users/authenticate',
    data: {
      username: usernameAttempt,
      password: passwordAttempt
    },
    success: function(data) {
      callback(data);
      socket.emit('new player', initData);
    }
  });
}

function setLogInFormHandler() {
  $('form#login').on('submit', function(e) {
    e.preventDefault();

    var usernameField = $(this).find('input[name="username"]');
    var usernameText = usernameField.val();
    usernameField.val('');

    var passwordField = $(this).find('input[name="password"]');
    var passwordText = passwordField.val();
    passwordField.val('');

    var userData = {
      username: usernameText,
      password: passwordText
    };

    logInUser(usernameText, passwordText, function(data) {

      $.cookie('token', data.token); // save the token as a cookie
      console.log('Token:', $.cookie('token'));

      renderPlayer(userData);

      // close modal
      $('#modal').toggle();

    });

  });
}


//----------------------------
//---------- Logout ----------
//----------------------------
function setLogOutListener(){
  $('form#log-out').on('submit', function(e){
    console.log('working');
    e.preventDefault();
    $.removeCookie('token');

    // refresh browser window
    window.location.reload();
  });
}


$(function() {
  checkCookie();
  setSignUpFormHandler();
  setLogInFormHandler();
  setLogOutListener();
});
