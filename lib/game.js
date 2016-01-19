// server side game management

var request = require('request');

Array.prototype.getIndexBy = function(name, value) {
  for (var i = 0; i < this.length; i++) {
    if (this[i][name] == value) {
      return i;
    }
  }
  return -1;
};

module.exports = {
  allPlayers: [], //stores players in current game
  rooms: ['room_1', 'room_2', 'room3'], //doesn't do anything now

  addNewPlayer: function(data) {
    this.allPlayers.push(data); // adds it to server's array of players
  },

  startRace: function(callback) {
    if (this.allPlayers.length >= 2) {
      request('http://shakeitspeare.com/api/poem', function(error,
        response, body) {
        var sentence = JSON.parse(response.body).poem.replace(
          /(\r\n|\n|\r)/gm, "  ");
        callback(sentence);
      });
    }
  },

  updatePlayer: function(data) {
    index = this.allPlayers.getIndexBy('id', data.id); // find player in array by ID
    this.allPlayers[index].left = data.left; // update position
  },

  removePlayer: function(index) {
    if (this.allPlayers[index]) {
      var player = this.allPlayers[index];
      var id = player.id;
      this.allPlayers.splice(index, 1);
    };
  },

  getIdBySocket: function(socket) {
    this.allPlayers.getIndexBy('socket', socket);
    if (this.allPlayers[index]) {
      var player = this.allPlayers[index];
      return player.id
    }
  },

  playerFinishes: function(data) {
    var index = this.allPlayers.getIndexBy('id', data.id)
    player = this.allPlayers[index];
    player.time = data.time;
    console.log(this.allPlayers[index]);
  }
}
