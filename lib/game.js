var request = require('request');

var allPlayers = [];
var rooms = ['room_1', 'room_2', 'room3'];

Array.prototype.getIndexBy = function(name, value) {
  for (var i = 0; i < this.length; i++) {
    if (this[i][name] == value) {
      return i;
    }
  }
  return -1;
};

module.exports = function() {
  request()
}
