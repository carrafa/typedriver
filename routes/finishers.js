// modules
var express = require('express');
var router = express.Router();
var Finisher = require('../models/finisher');

//GET ALL
router.get('/', function(req, res) {
  if (req.query.raceId) {
    var search = req.query.raceId;
    Finisher.find({
      raceId: search
    }, function(err, databaseFinishers) {
      res.json({
        user: databaseFinishers
      });
    });
  } else if (req.query.sentence) {
    var searchTerm = req.query.sentence;
    Finisher.find({
      sentence: new RegExp(searchTerm, 'i')
    }, function(err, databaseFinishers) {
      res.json({
        finishers: databaseFinishers
      })
    });
  } else {
    Finisher.find({}, function(err, dbFinishers) {
      res.json({
        finishers: dbFinishers
      });
    });
  }
});

// GET SINGLE RESOURCE
router.get('/:id', function(req, res, next) {
  Finisher.findById(req.params.id, function(err, dbFinisher) {
    if (err) {
      return next(err);
    }
    if (!dbFinisher) {
      return next({
        status: 404,
        message: 'Not found'
      });
    }
    res.json(dbFinisher);
  });
});

// POST
router.post('/', function(req, res, next) {
  console.log('creating!');
  if (!req.body.finisher) {
    return next({
      status: 422,
      message: 'Missing arguments'
    });
  }
  Finisher.create(req.body.finisher, function(err, finisher) {
    res.redirect('/');
  })
});

// DELETE
router.delete('/:id', function(req, res) {
  console.log("deleting");
  Finisher.findByIdAndRemove(req.params.id, function(err) {
    res.status(204).end();
  })
});


module.exports = router;
