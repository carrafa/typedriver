// server side game management

var request = require('request');
var Race = require('../models/race')
var Finisher = require('../models/finisher')

Array.prototype.getIndexBy = function(name, value) {
  for (var i = 0; i < this.length; i++) {
    if (this[i][name] == value) {
      return i;
    }
  }
  return -1;
};

function getRoomBySocket(socket, object) {

}

module.exports = {

  allPlayers: {}, //stores players on server
  roomCapacity: 2,

  addNewPlayer: function(data) {
    var room = data.room
    this.allPlayers[room] = this.allPlayers[room] || [];
    this.allPlayers[room].push(data); // adds it to server's array of players
  },

  startRace: function(data, callback) {
    if (this.allPlayers[data.room].length >= this.roomCapacity) {
      request('http://shakeitspeare.com/api/poem', function(error,
        response, body) {
        var sentence = JSON.parse(response.body).poem.replace(
          /(\r\n|\n|\r)/gm, "  ");
        callback(sentence);
      });
    }
  },

  updatePlayer: function(data) {
    index = this.allPlayers[data.room].getIndexBy('username', data.username); // find player in array by ID
    // console.log(this.allPlayers[data.room]);
    this.allPlayers[data.room][index].left = data.left; // update position
  },

  removePlayer: function(data) {
    console.log('remove player data :', data);
    if (this.allPlayers[data.room][data.index]) {
      var player = this.allPlayers[data.room][data.index];
      var username = player.username;
      this.allPlayers[data.room].splice(index, 1);
    };
  },

  getIdBySocket: function(room, socket) {
    this.allPlayers[room].getIndexBy('socket', socket);
    if (this.allPlayers[index]) {
      var player = this.allPlayers[index];
      return player.username
    }
  },

  playerFinishes: function(data) {
    var index = this.allPlayers[data.room].getIndexBy('username', data.username)
    player = this.allPlayers[data.room][index];
    player.time = data.time;
    console.log(this.allPlayers[data.room][index]);
    // save it to the database with the same race id
    console.log('pre-save finish: ', data);
    newFinisher = Finisher.create(data, function(err, finisher) {
      console.log('post-save finish: ', finisher)
    });
  },

  sortFinishers: function(finishers) {
    console.log("SORT THESE FINIHSERSSSSS: ", finishers);

    var finishersInOrder = finishers.sort(function(a, b) {
      if (a.time > b.time) {
        return 1;
      }
      if (a.time < b.time) {
        return -1;
      }
      return 0;
    });

    for (i = 0; i < finishersInOrder.length; i++) {
      finishersInOrder[i].place = i + 1;
      finishersInOrder[i].save(function(err, finisher) {
        console.log('supposed to sort these guys in order: ', finisher);
      });
    }

  },

  getFinishers: function(raceId, callback) {
    var scope = this;
    Finisher.find({
      raceId: raceId
    }, function(err, finishers) {
      if (finishers.length >= scope.roomCapacity)
        scope.sortFinishers(finishers);
    });
    // var scope = this;
    // var finishers = Finisher.find({
    //   raceId: raceId
    // }, function(err, dbFinishers) {
    //   console.log("FINISHER LENGTH:  ", dbFinishers.length);
    //   console.log("ROOM CAP:  ", scope.roomCapacity);
    //   if (dbFinishers.length < scope.roomCapacity) {
    //     console.log('nope, still racers');
    //     result = false;
    //     return false
    //   } else {
    //     console.log('everyone\'s done');
    //     result = true;
    //     return true
    //   }
    // });
    // console.log(result);
    // return result;
  }
}
