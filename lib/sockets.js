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

module.exports = function(socket, io) {
  // socket stuff
  console.log('player connected at socket ', socket.conn.id)

  //adds new player to racetrack
  socket.on('new player', function(data) { // new player signs in
    data.socket = socket.conn.id;
    allPlayers.push(data); // adds it to local array of players
    io.emit('update all players', allPlayers); // sends new data to everyone
    console.log('all players: ', allPlayers);
    if (allPlayers.length >= 5) {;
      io.emit('start race');
    };
  });

  // updates all player status
  socket.on('update player', function(data) {
    // insert updated player data in to allPlayers array (database eventually? or maybe just database after the game is over)
    index = allPlayers.getIndexBy('id', data.id); // find that player
    allPlayers[index].left = data.left; // update position
    io.emit('update all players', allPlayers); // send new data out to everyone
  });

  // player disconnects
  socket.on('disconnect', function(data) {
    socket = socket.conn.id
    console.log('player disconnected at socket ' + socket); // why does this log twice on disconnect?  who is that phantom disconnecter???
    index = allPlayers.getIndexBy('socket', socket); // find that player

    if (allPlayers[index]) {
      var player = allPlayers[index];
      var id = player.id;
      allPlayers.splice(index, 1);
    };

    io.emit('user disconnected', id, allPlayers);
  });

};
