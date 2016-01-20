var game = require('./game');
var Race = require('../models/race')
var Finisher = require('../models/finisher')
var _ = require('underscore');

userCounter = 0;
roomCounter = 1;

function getRoomBySocket(socket) {
  var room = _.findKey(game.allPlayers, function(room) {
    for (i = 0; i < room.length; i++) {
      if (room[i].socket === socket) {
        return true;
      }
    }
  });
  return room;
}

module.exports = function(socket, io) {
  // socket stuff
  console.log('player connected at socket ', socket.conn.id)

  // ---------------------------------
  // this assigns a user to a room
  // ---------------------------------
  userCounter++; // add one to the user counter
  if (userCounter <= game.roomCapacity) { // make sure room isn't full
    room = "room_" + roomCounter; // give the room a name
    socket.join(room); // put the user in that room
    console.log('joined room ', room)
    io.to(socket.id).emit('room', { // tell the user which room they're in
      room: room
    });
  } else { // if room is full, reset the user counter, and make another room, assign user to that room
    userCounter = 1;
    roomCounter++;
    room = "room_" + roomCounter;
    socket.join(room);
    io.to(socket.id).emit('room', {
      room: room
    });
    console.log('last room full, joined room ' + room + ' instead')
      // console.log('users reset.  userCounter at ' + userCounter +
      // ', roomCounter at ' + roomCounter);
      // console.log('game.allPlayers: ', game.allPlayers);
  }

  //adds new player to racetrack
  socket.on('new player', function(data) { // new player signs in
    data.socket = socket.conn.id;
    console.log('new player function fired, data: ', data)
    game.addNewPlayer(data); //  adds player to array
    io.to(data.room).emit('update all players', game.allPlayers[data.room]); // sends new data to everyone
    game.startRace(data, function(sentence) { // api call to shake it speare, returns sentence
      var newRace = new Race({
        sentence: sentence
      });
      data = {
        sentence: sentence,
        room: data.room
      };
      newRace.save(function(err, databaseRace) {
        data.id = databaseRace._id
        console.log("new race data: ", data);
        io.to(data.room).emit('start race', data); // emits sentence to all users, tells them to start race
      });
    });
  });

  // updates all player status
  socket.on('update player', function(data) {
    game.updatePlayer(data); // inserts player into playerArray
    io.to(data.room).emit('update all players', game.allPlayers[data.room]); // send new data out to everyone
  });

  // player finishes race
  socket.on('player finishes', function(data) {
    game.playerFinishes(data);
    game.getFinishers(data.raceId)
  });

  // player disconnects
  socket.on('disconnect', function(data) {
    userCounter--;
    socket = socket.conn.id
    var room = getRoomBySocket(socket);
    console.log('player disconnected at socket ' + socket);
    console.log('room from _ function: ', room);

    if (room) {
      index = game.allPlayers[room].getIndexBy('socket',
        socket); // find that player
      playerData = {
        room: room,
        index: index
      }
      game.removePlayer(playerData); //remove player from game array
      console.log('users left in room: ', game.allPlayers[room]);
      id = game.getIdBySocket(room, socket); // get id to send down to other players
      io.to(data.room).emit('user disconnected', id, game.allPlayers);
    }
  });

};
