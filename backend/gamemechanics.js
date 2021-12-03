const { GRID } = require('/constants');

module.exports = {
    initGame,
    updatedVelocity,
    gameLoop,

}

function initGame() {
    const state = crgameState()
    foodRandom(state);
    return state;
}

function crgameState() {
    return {
        player: {
            pos: {
                x: 3,
                y: 10,
            },
            vel: {
                x: 1,
                y: 0,
            },
            snake: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }],
        },
        food: {
            x: 7,
            y: 7,
        },
        grid: GRID,



    };

}

function gameLoop(state) {
    if (!state) {
        return;
    }

    const playerOne = state.players[0];
    const playerTwo = state.players[1];


    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;

    if (playerOne.pos.x < 0 || playerOne.pos.x > GRID || playerOne.pos.y < 0 || playerOne.pos.y > GRID) {
        return 2; //player 2 wins the game
    }
    if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRID || playerTwo.pos.y < 0 || playerTwo.pos.y > GRID) {
        return 1;
    }

    if (state.food.x === playerOne.pos.x && state.food.y === playerOne.food.y) {
        playerOne.snake.push({...playerOne.pos }) //to inc the size of the snake if it ate the food
        playerOne.pos.x += playerOne.vel.x;
        playerOne.pos.y += playerOne.vel.y

        foodRandom(state);
    }
    if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
        playerTwo.snake.push({...playerTwo.pos });
        playerTwo.pos.x += playerTwo.vel.x;
        playerTwo.pos.y += playerTwo.vel.y;
        foodRandom(state);
    }

    if (playerOne.vel.x || playerOne.vel.y) {
        for (let cell of playerOne.snake) {
            if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) //bumped into itself
                return 2;
        }

        playerOne.snake.push({...playerOne.pos });
        playerOne.snake.shift();
    }
    if (playerTwo.vel.x || playerTwo.vel.y) {
        for (let cell of playerTwo.snake) {
            if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
                return 1;
            }
        }

        playerTwo.snake.push({...playerTwo.pos });
        playerTwo.snake.shift();
    }

    return false; //there isnt a winner
}

function foodRandom(state) {
    food = {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID),
    }
    for (let cell of state.player.snake) { //for placing a peice of food that isnt on the snake
        if (cell.x === food.x && cell.y === food.y) {
            return foodRandom(state);
        }


    }
    for (let cell of state.players[1].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state);
        }

    }
    state.food = food;
}

function updatedVelocity(keyCode) {
    switch (keyCode) {
        case 37:
            { // left
                return { x: -1, y: 0 };
            }
        case 38:
            { // down
                return { x: 0, y: -1 };
            }
        case 39:
            { // right
                return { x: 1, y: 0 };
            }
        case 40:
            { // up
                return { x: 0, y: 1 };
            }
    }
}