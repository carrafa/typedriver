var User = require('../models/user');

function loadUser(req, res, next) {
  console.log('req.cookies.token: ', req.cookies.token)
  if (req.cookies.token) {
    User.findOne({
      token: req.cookies.token
    }, function(err, databaseUser) {
      if (err) return err;
      req.user = databaseUser;
      console.log('databaseUser: ', databaseUser);
      next();
    });
  } else {
    next();
  }
}

module.exports = loadUser;
