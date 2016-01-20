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

function checkUser(search) {
  $.ajax({
    method: 'get',
    url: '/api/user=name' + search,
    success: function(data) {
      if (data) {
        return true;
      }

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

    if (checkUser()) {
      console.log('user exists');
    } else {
      console.log('user dont exist');
    }

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
      // initData.username = usernameAttempt;
      // initData.id = data._id;
      // console.log('data: ', data);
      // console.log('init data: ', initData);
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
      if ($.cookie('token')) {
        $('#modal').toggle();
      }

    });

  });
}


//----------------------------
//---------- Logout ----------
//----------------------------
function setLogOutListener() {
  $('form#logout').on('submit', function(e) {
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
