var mongoose = require('mongoose');

RaceSchema = mongoose.Schema({
  sentence: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Race', RaceSchema);
