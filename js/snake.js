const canvas = document.getElementById("snake-game");
const ctx = canvas.getContext("2d");

const gameGridWidth = 21;
const gameGridHeight = 12;
const gameHeight = 48;
const gameWidth = 84;
const pixelPadding = 1;
const scaleMultiplier = 4;

const canvasWidth = (gameWidth * scaleMultiplier) + gameWidth;
const canvasHeight = (gameHeight * scaleMultiplier) + gameHeight;

const NUMBERS = [[0,0,0,
		  0,0,0,
		  0,0,0,
		  0,0,0,
		  0,0,0]];

const SNAKE_HEAD = [1, 0, 0, 0,
		    0, 1, 1, 0,
		    1, 1, 1, 0,
	    	    0, 0, 0, 0];

const SNAKE_BODY = [0, 0, 0, 0,
		    1, 1, 0, 1,
		    1, 0, 1, 1,
		    0, 0, 0, 0];

const SNAKE_TURN = [0, 0, 0, 0,
		    0, 0, 1, 1,
		    0, 1, 0, 1,
		    0, 1, 1, 0];

const SNAKE_TAIL = [0, 0, 0, 0,
		    0, 0, 1, 1,
		    1, 1, 1, 1,
		    0, 0, 0, 0];

const FOOD_PIECE = [0, 1, 0,
	            1, 0, 1,
	            0, 1, 0];

var FOOD_PIECES = [[0, 0]];

var SNAKE_DIR = [1, 0];

var Snake = {
	direction: [1, 0],
	body: [
		{x: 0, y: 1, piece: SNAKE_TAIL, direction: [1, 0]}, 
		{x: 1, y: 1, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 2, y: 1, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 3, y: 1, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 4, y: 1, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 5, y: 1, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 6, y: 1, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 7, y: 1, piece: SNAKE_HEAD, direction: [1, 0]}
	],	
	head: function () {
		return this.body[this.body.length - 1];
	},
	tail: function () {
		return this.body[0];
	},
	grow: function () {
		return this.body.unshift({x: this.head().x, y: this.head().y, piece: SNAKE_HEAD, direction: SNAKE_DIR});
	},
	move: function (directionX, directionY) {
		if (this.changedDir(directionX, directionY)) {
			this.head().piece = SNAKE_TURN;
			this.head().direction = [directionX, directionY];
		}
		else
		{
			this.head().piece = SNAKE_BODY;
		}
		this.body.push({x: this.head().x + directionX, y: this.head().y + directionY, piece: SNAKE_HEAD, direction: SNAKE_DIR});
		this.body.shift();
		this.tail().piece = SNAKE_TAIL;
		this.direction = [directionX, directionY];
	},
	changedDir: function (directionX, directionY) {
		if (this.direction[0] == directionX && this.direction[1] == directionY)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}

function drawGrid() {
	for (w = 0; w < canvasWidth / scaleMultiplier; w++)
	{
		for (h = 0; h < canvasHeight / scaleMultiplier; h++)
		{
			drawPixel(w, h, "rgba(0,0,0,0.1)");
		} 
	}
}

function drawOutline() {
	for (w = 0; w < canvasWidth / scaleMultiplier; w++)
	{
		for (h = 0; h < canvasHeight / scaleMultiplier; h++)
		{
			if (h == 0 || h == gameHeight - 1 || w == 0 || w == gameWidth -1)
			{
				drawPixel(w, h);
			}
		}
	}
}

function drawScore() {
}

function drawPixel(x, y, color) {
	if (color) {
		ctx.fillStyle = color;
	} else {
		ctx.fillStyle = "rgba(0,0,0,0.7)";
	}
	ctx.shadowColor = "rgba(0,0,0,0.2)";
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0.5;
	ctx.shadowOffsetY = 0.5;

	ctx.fillRect(x * (pixelPadding + scaleMultiplier), y * (scaleMultiplier + pixelPadding), scaleMultiplier, scaleMultiplier);
}

function drawSnakePiece(x, y, part, direction) {

	

	for (let i = 0; i < 16; i++)
	{

		if (part[i] == 1)
		{
			if (direction[1] == -1) {
				drawPixel((x * 4) + Math.floor((i) / 4), (y * 4) + Math.floor((15 - i) % 4));
			} else if (direction[0] == -1) {
				drawPixel((x * 4) + Math.floor((15 - i) % 4), (y * 4) + Math.floor(i / 4));
			} else if (direction[1] == 1) {
				drawPixel((x * 4) + Math.floor((15 - i) / 4), (y * 4) + Math.floor((i) % 4));
			} else {
				drawPixel((x * 4) + Math.floor(i % 4), (y * 4) + Math.floor(i / 4));
			}
		}
	}
}

function drawGame() {
	drawGrid();
	drawOutline();
	for (let i = 0; i < Snake.body.length; i++)
	{
		drawSnakePiece(Snake.body[i].x, Snake.body[i].y, Snake.body[i].piece, Snake.body[i].direction);
	}
}

function updateSnake() {
	if (Snake.head().x > 20) {
		Snake.head().x = 1;
	} else if (Snake.head().y > 11) {
		Snake.head().y = 1;
	} else if (Snake.head().x < 0) {
		Snake.head().x = 20;
	} else if (Snake.head().y < 0) {
		Snake.head().y = 11;
	}

	Snake.move(SNAKE_DIR[0], SNAKE_DIR[1]);
}

function generateBeets() {
	FOOD_PIECES.push({x: 0, y: 0});
}

function gameLoop() {
	updateSnake();
	ctx.clearRect(0,0, canvasWidth, canvasHeight);
	drawGame();
}

window.onkeydown = function (e) {
	console.log(e.keyCode);
	switch (e.keyCode) {
		case 38:
			if (SNAKE_DIR != [0, -1]) {
				SNAKE_DIR = [0, -1];
			}
			//Snake.move(-1, 0);
			break;
		case 40:
			SNAKE_DIR = [0, 1];
			break;
		case 37:
			SNAKE_DIR = [-1, 0];
			break;
		case 39:
			SNAKE_DIR = [1, 0];
			break;
		case 71: // g - for growing
			Snake.grow();
			break;
		case 80: // p - for pausing
			if (!GAME_IS_PAUSED)
			{
				clearInterval(GameLoop);
				GAME_IS_PAUSED = true;
			} else {
				GameLoop = setInterval(gameLoop, 600);
				GAME_IS_PAUSED = false;
			}
		default:
			break;
	}
}

var GameLoop = setInterval(gameLoop, 600);
var GAME_IS_PAUSED = false;
