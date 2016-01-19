// modules
var express = require('express');
var router = express.Router();
var User = require('../models/user');



//----- routes -----//
// index
router.get('/', function(req, res) {
  User.find({}, function(err, databaseUsers) {
    res.json({
      users: databaseUsers
    });
  });
});

// create & save
router.post('/', function(req, res) {
  var newUser = new User(req.body.user);
  newUser.save(function(err, databaseUser) {
    res.json(databaseUser);
  });
});

// update - may be not be functional?
router.patch('/', function(req, res) {
  if (req.user) {
    req.user.bio = req.body.user.bio;

    req.user.save(function(err, databaseUser) {
      res.json(databaseUser);
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
              token: databaseUser.token
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
