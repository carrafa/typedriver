console.log('hello, i am login.js');

function toggleModal() {
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

    // Obtain the username from form
    var usernameField = $(this).find('input[name="username"]');
    var usernameText = usernameField.val();
    usernameField.val('');

    // Obtain the password from form
    var passwordField = $(this).find('input[name="password"]');
    var passwordText = passwordField.val();
    passwordField.val('');

    // Organize the data to be sent
    var userData = {
      username: usernameText,
      password: passwordText
    };
    console.log('userdata', userData);

    // Create a new user
    createUser(userData, function(user) {
    console.log(user);
 });

    // Login new user
    logInUser(usernameText, passwordText, function(data) {
      $.cookie('token', data.token); // save the token as a cookie
      console.log('Token:', $.cookie('token'));
    });

    console.log("Before close");
    // Close modal
    toggleModal();

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
      // updateUsersAndView();
      renderPlayer(userData);

      toggleModal();

    });

  });
}


//----------------------------
//---------- Logout ----------
//----------------------------
function setLogOutListener(){
  $('form#log-out').on('submit', function(e){
    e.preventDefault();
    $.removeCookie('token');

    //Open modal
    toggleModal();
  });
}


$(function() {
  toggleModal();
  setSignUpFormHandler();
  setLogInFormHandler();
  setLogOutListener();
});
