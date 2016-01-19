var mongoose = require('mongoose');

FinisherSchema = mongoose.Schema({
  userId: {
    type: String
  },
  raceId: {
    type: String
  },
  sentence: {
    type: String
  },
  time: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Finisher', FinisherSchema);
