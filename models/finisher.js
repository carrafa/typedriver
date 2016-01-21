var mongoose = require('mongoose');

FinisherSchema = mongoose.Schema({
  username: {
    type: String
  },
  raceId: {
    type: String
  },
  room: {
    type: String
  },
  sentence: {
    type: String
  },
  time: {
    type: String
  },
  place: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Finisher', FinisherSchema);
