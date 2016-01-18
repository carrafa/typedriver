// this is barebones now.  and it doesn't actually do anything.
// but we should put as much server-side game logic in here as possible.

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
