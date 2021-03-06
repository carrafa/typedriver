var game = require('./game');
var Race = require('../models/race');
var Finisher = require('../models/finisher');
var _ = require('underscore');

userCounter = 1; // keeps track of users on the server
roomCounter = 1; // keeps track of the rooms

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
  console.log('player connected at socket ', socket.conn.id);


  socket.on('new player', function(data) { // new player clicks ready to race
    userCounter++; // add one to the user counter

    //assign player to room

    if (userCounter % game.roomCapacity !== 0) { // make sure room isn't full
      room = "room_" + roomCounter; // give the room a name
      socket.join(room); // put the user in that room
      console.log('joined room ', room);
      io.to(socket.id).emit('room', { // tell the user which room they're in
        room: room
      });
      data.room = room;
    } else { // if room is full, make another room, and assign user to that room
      roomCounter++;
      room = "room_" + roomCounter;
      socket.join(room);
      io.to(socket.id).emit('room', {
        room: room
      });
      data.room = room;
      console.log('last room full, joined room ' + room + ' instead');
    }
    // console.log('users reset.  userCounter at ' + userCounter +
    // ', roomCounter at ' + roomCounter);
    // console.log('game.allPlayers: ', game.allPlayers);
    // console.log("room length thingggg: " + io.sockets.clients(room).length);

    data.socket = socket.conn.id;
    console.log('new player function fired, data: ', data);
    game.addNewPlayer(data); //  adds new player to array of players in that game
    io.to(data.room).emit('update all players', game.allPlayers[data.room]); // sends new data to everyone in room


    game.startRace(data, function(sentence) { // api call to shake it speare, returns sentence
      var newRace = new Race({ // create new race in database
        sentence: sentence
      });
      data = {
        sentence: sentence,
        room: data.room
      };
      newRace.save(function(err, databaseRace) { //save race and send that info out to all users
        data.id = databaseRace._id;
        console.log("new race data: ", data);
        io.to(data.room).emit('start race', data); // emits sentence to all users, tells them to start race
        game.allPlayers[data.room].forEach(function(player) {
          player.raceId = data.id;
          player.sentence = data.sentence;
        });
        console.log('game started: ', game.allPlayers[data.room]);
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
    game.getFinishers(data.raceId);
    socket.emit('wait for finishers');
  });

  // player asks if race is over   THIS DOESN'T WORK.  WOMMMP
  socket.on('is race over', function(data) {
    // game.getFinishers(data.raceId, function(err, finishers) {
    //   console.log("length", finishers.length);
    //   console.log("err", err);
    //   if (finishers.length < game.roomCapacity) {
    //     console.log('race not over!!!');
    //     io.to(data.room).emit('race not over', data);
    //   } else {
    //     console.log('race over???');
    //     io.to(data.room).emit('race over', data);
    //   }
    // });
    game.isRaceOver(data.raceId, function(finishers) {
      console.log('is race over????', finishers);
    });
  });

  // chat room
  socket.on('user chat', function(data) {
    io.emit('global chat', data);
  });

  // player disconnects
  socket.on('disconnect', function(data) {
    socket = socket.conn.id;
    var room = getRoomBySocket(socket); // find the room of the player that disconnected
    console.log('player disconnected at socket ' + socket);
    // console.log('room from _ function: ', room);

    // find the index of the player that disconnected
    if (room) {
      index = game.allPlayers[room].getIndexBy('socket', socket);
      playerData = game.allPlayers[room][index];
      console.log("PLAYERDATA, ", playerData);
      playerData.sentence = "DNF";
      playerData.time = "DNF";
      playerData.place = "DNF";
      console.log("player that Disconnected Data", playerData);
      Finisher.create(playerData, function(err, player) {
        console.log('this player didn\'t finish: ', player);
      });
      game.removePlayer(playerData); //remove player from game array
      console.log('users left in game: ', game.allPlayers[room]);
      id = game.getIdBySocket(room, socket); // get id to send down to other players
      io.to(data.room).emit('user disconnected', id, game.allPlayers); // tell other players in room that player left
    }
  });

};
