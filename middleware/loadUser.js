var User = require('../models/user');

function loadUser(req, res, next) {
  if (req.cookies.token) {
    User.findOne({
      token: req.cookies.token
    }, function(err, databaseUser) {
      if (err) return err;
      req.user = databaseUser;
      next();
    });
  } else {
    next();
  }
}

module.exports = loadUser;
