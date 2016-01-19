var request = require('request');
var game = require('./game');

module.exports = function(socket, io) {
  // socket stuff
  console.log('player connected at socket ', socket.conn.id)

  //adds new player to racetrack
  socket.on('new player', function(data) { // new player signs in
    data.socket = socket.conn.id;
    game.addNewPlayer(data);
    io.emit('update all players', game.allPlayers); // sends new data to everyone
    console.log('socket.js all players: ', game.allPlayers);
    game.getSentence(function(sentence) {
      io.emit('start race', sentence);
    });
  });

  // updates all player status
  socket.on('update player', function(data) {
    game.updatePlayer(data); // insert updated player data in to allPlayers array (database eventually? or maybe just database after the game is over)
    io.emit('update all players', game.allPlayers); // send new data out to everyone
  });

  // player finishes race
  socket.on('player finishes', function(data) {
    console.log(data.time);
  });

  // player disconnects
  socket.on('disconnect', function(data) {
    socket = socket.conn.id
    console.log('player disconnected at socket ' + socket);

    index = game.allPlayers.getIndexBy('socket', socket); // find that player
    game.removePlayer(index); //remove player from game array
    id = game.getIdBySocket(socket); // get id to send down to other players
    io.emit('user disconnected', id, game.allPlayers);
  });

};
