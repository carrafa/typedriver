// modules
var express = require('express');
var router = express.Router();
var User = require('../models/user');

//----- routes -----//


// index
router.get('/', function(req, res) {
  if (req.query.username) {
    var username = req.query.username;
    User.find({
      username: username
    }, function(err, databaseUser) {
      res.json({
        user: databaseUser
      });
    });
  } else if (req.user.token) {
    var token = req.user.token;
    User.find({
      token: token
    }, function(err, databaseUser) {
      res.json({
        user: databaseUser
      });
    });
  } else {
    User.find({}, function(err, databaseUsers) {
      res.json({
        users: databaseUsers
      });
    });
  }
});

// create & save
router.post('/', function(req, res) {
  var newUser = new User(req.body.user);
  newUser.save(function(err, databaseUser) {
    console.log(newUser);
    console.log("The error is: " + err);
    if (err) {
      res.json({
        error: err.errors
      });
    } else {
      res.json(databaseUser);
    }
  });
});

// update - may be not be functional?
router.patch('/', function(req, res) {
  if (req.user) {
    req.user.color = req.body.user.color;
    req.user.save(function(err, databaseUser) {
      res.json(databaseUser);
    });
  }
});

router.delete('/', function(req, res) {
  console.log("REQQQQ" + req.user);
  if (req.user) {
    User.findByIdAndRemove({
      _id: req.user._id
    }, function(err) {
      if (err) {
        res.status(500).end();
      }
      res.status(204).end();
    });
  }
});

// authenticate: if username & password match
router.post('/authenticate', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, databaseUser) {
    if (databaseUser) {
      databaseUser.authenticate(req.body.password, function(err,
        isMatch) {
        if (isMatch) {
          databaseUser.setToken(err, function() {
            res.json({
              description: 'success',
              token: databaseUser.token,
              username: databaseUser.username,
              id: databaseUser._id
            });
          });
        }
      });
    } else {
      res.json({
        description: 'No success',
        status: 302
      });
    }
  });
});

module.exports = router;
