const io = require('socket.io')();


const { initGame, gameLoop, updatedVelocity } = require('./gamemechanics');
const { FRAME } = require('./constants');
const { id } = require('./utils');
//immediately calling the function
const state = {};
const clientRooms = {};
io.on('connection', client => { //conencts to the client
    io.on('connection', client => {

        client.on('keydown', manageKeydown);
        client.on('newGame', manageNewGame);
        client.on('joinGame', manageJoinGame);
    });

    function manageJoinGame(roomName) {
        const room = io.sockets.adapter.rooms[roomName];

        let allUsers;
        if (room) {
            allUsers = room.sockets;
        }

        let numClients = 0;
        if (allUsers) {
            numClients = Object.keys(allUsers).length;
        }

        if (numClients === 0) {
            client.emit('unknown code');
            return;
        } else if (numClients > 1) {
            client.emit('too many players');
            return;
        }

        clientRooms[client.id] = roomName;

        client.join(roomName);
        client.number = 2;
        client.emit('init', 2);

        gameInterval(roomName);
    }

    function manageNewGame() {
        let roomName = id(5);
        clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName);

        state[roomName] = initGame();

        client.join(roomName);
        client.number = 1;
        client.emit('init', 1);
    }

    function manageKeydown(keyCode) {
        const roomName = clientRooms[client.id];
        if (!roomName) {
            return;
        }
        try {
            keyCode = parseInt(keyCode);
        } catch (e) {
            console.error(e);
            return;
        }
        const vel = updatedVelocity(keyCode);
        if (vel) {
            state[roomName].players[client.number - 1].vel = vel;
        }
    }
});



function gameInterval(client, state) { //send game data
    const intervalid = setInterval(() => {
        const winner = gameLoop(state); //return a value based on whether the game is over or not
        console.log('interval');
        if (!winner) {
            client.emit('gamestate', JSON.stringify(state));
        } else {
            client.emit('gameOver');
            clearInterval(intervalid);
        }

    }, 1000 / FRAME);
}

function finishGameState(room, gamestate) {

    io.sockets.in(room)
        .emit('game state', JSON.stringify(gamestate));
} //sends a message to everyone

function finishGame(room, winner) {
    io.sockets.in(room)
        .emit('game over', JSON.stringify({ winner }));
}

io.listen(process.env.PORT || 3000);