console.log('hello, i am login.js');

function toggleModal() {
  $('#modal').toggle();
};

// Send request to create a user
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

function setCreateUserFormHandler() {
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

      toggleModal();
    });


  });
}

function updateUser(userData, callback) {
  $.ajax({
    method: 'patch',
    url: '/api/users',
    data: {
      user: userData
    },
    success: function(data) {
      callback(data);
    }
  });
}

function setUpdateUserFormHandler() {
  $('form#update-time').on('submit', function(e) {
    e.preventDefault();

    var username = $(this).find('input[name="username"]');
    var usernameText = username.val();
    bioField.val('');

    var userData = {
      username: usernameText
    };

    updateUser(userData, function(user) {
      console.log(user);
      // updateUsersAndView();
    });

  });
}

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

function getAllUsers(callback) {
  $.ajax({
    url: '/api/users',
    success: function(data) {
      var users = data.users || [];
      callback(users);
    }
  });
}

function updateUsersAndView() {

  getAllUsers(function(users) {
    $('section#users').empty();
    var usersElement = renderUsers(users);
    $('section#users').append(usersElement);
  });

  if ($.cookie('token')) {
    $('.user-only').show();
  } else {
    $('.user-only').hide();
  }

}


$(function() {
  setUpdateUserFormHandler();
  setCreateUserFormHandler();
  setLogInFormHandler();
});
