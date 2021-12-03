const backgcol = '#00000';
const snakecol = '#c2c2c2';
const foodcol = '#ee6916';

const socket = io('https://radiant-headland-58152.herokuapp.com/');
socket.on('init', manageInit);
socket.on('gamestate', managegameState)
socket.on('init', manageInit);

socket.on('gameOver', manageGameOver);
socket.on('gameCode', manageGameCode);
socket.on('unknownCode', manageUnknownCode);
socket.on('tooManyPlayers', manageTooManyPlayers);

let canvas, ctx, playerNum;
let gameActive = false;

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

function newGame() {
    socket.emit('newGame');
    init();
}

function joinGame() {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
    init();
}

function init() {
    //initialScreen.style.display = "none";
    gameScreen.style.display = "block";

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = canvas.height = 600;
    ctx.fillStyle = backgcol;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('list', list);



}

function list(e) {
    socket.emit('keydown', e.keyCode);
}



init();


function fillgame(state) {
    ctx.fillStyle = backgcol;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const grid = state.grid;
    const size = canvas.width / grid;

    ctx.fillStyle = foodcol;
    ctx.fillRect(food.x * size, food.y * size, size, size);

    fillplayer(state.players[0], size, snakecol);

    fillPlayer(state.players[1], size, 'red');

}

function fillplayer(playerstate, size, colour) {
    const snake = playerstate.snake;
    ctx.fillStyle = colour;
    for (let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }



}



function manageInit(msg) {
    console.log(msg);
}

function managegameState(gameState) {
    gamestate = JSON.parse(gamestate);
    requestAnimationFrame(() => fillgame(gamestate));
}

function manageGameOver(data) {
    if (!gameActive) {
        return;
    }
    data = JSON.parse(data);

    gameActive = false;

    if (data.winner === playerNum) {
        alert('You Win!');
    } else {
        alert('You Lose :(');
    }
}

function manageGameCode(gameCode) {
    gameCodeDisplay.innerText = gameCode;
}

function manageUnknownCode() {
    reset();
    alert('Unknown Game Code')
}

function manageTooManyPlayers() {
    reset();
    alert('This game is already in progress');
}

function reset() {
    playerNum = null;
    gameCodeInput.value = '';
    initialScreen.style.display = "block";
    gameScreen.style.display = "none";
}
