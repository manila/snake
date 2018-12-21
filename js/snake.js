const canvas = document.getElementById("snake-game");
const ctx = canvas.getContext("2d");

const gameHeight = 48;
const gameWidth = 84;
const pixelPadding = 1;
const scaleMultiplier = 4;

const canvasWidth = (gameWidth * scaleMultiplier) + gameWidth;
const canvasHeight = (gameHeight * scaleMultiplier) + gameHeight;

const SNAKE_HEAD = [1, 0, 0, 0,
		    0, 1, 1, 0,
		    1, 1, 1, 0,
	    	    0, 0, 0, 0];

const SNAKE_BODY = [0, 0, 0, 0,
		    1, 1, 0, 1,
		    1, 0, 1, 1,
		    0, 0, 0, 0];

const SNAKE_TURN = [0,0,0,0,
		    1,1,0,0,
		    1,0,1,0,
		    0,1,1,0];


const SNAKE_TAIL = [0, 0, 0, 0,
		    0, 0, 1, 1,
		    1, 1, 1, 1,
		    0, 0, 0, 0];

var SNAKE_DIR = [1, 0];

Snake = [
		{x: 0, y: 0, piece: SNAKE_TAIL, direction: [1, 0]}, 
		{x: 1, y: 0, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 2, y: 0, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 3, y: 0, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 4, y: 0, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 5, y: 0, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 6, y: 0, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 7, y: 0, piece: SNAKE_HEAD, direction: [1, 0]}
	]; 

function drawGrid() {
	for (w = 0; w < canvasWidth / scaleMultiplier; w++)
	{
		for (h = 0; h < canvasHeight / scaleMultiplier; h++)
		{
			drawPixel(w, h);
		} 
	}
}

function drawPixel(x, y) {
	ctx.shadowColor = "rgba(0,0,0,0.2)";
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0.5;
	ctx.shadowOffsetY = 0.5;
	
	ctx.fillRect(x * (pixelPadding + scaleMultiplier), y * (scaleMultiplier + pixelPadding), scaleMultiplier, scaleMultiplier);
}

function drawSnakePiece(x, y, part, direction) {
	for (let i = 0; i != 16 * direction[0]; i += direction[0])
	{
		if (part[i] == 1)
		{
			if (direction[1] == -1) {
				drawPixel((x * 4) + Math.floor((i) / 4), (y * 4) + Math.floor((15 - i) % 4));
			} else {
				drawPixel((x * 4) + Math.floor((i) % 4), (y * 4) + Math.floor((i) / 4));
			}
		}
	}
}

function drawGame() {
	for (let i = 0; i < Snake.length; i++)
	{
		drawSnakePiece(Snake[i].x, Snake[i].y, Snake[i].piece, Snake[i].direction);
	}
}

Array.prototype.head = function () {
	return this[this.length - 1];
}

function updateSnake() {
	if (Snake.head().x > 21) {
		Snake.head().x = 0;
	} else if (Snake.head().y > 12) {
		Snake.head().y = 0;
	} else if (Snake.head().x < 0) {
		Snake.head().x = 21;
	} else if (Snake.head().y < 0) {
		Snake.head().y = 12;
	}

	Snake[0].x = Snake.head().x + SNAKE_DIR[0];
	Snake[0].y = Snake.head().y + SNAKE_DIR[1];

	Snake.head().piece = SNAKE_BODY;
	Snake.push(Snake.shift());
	Snake[0].piece = SNAKE_TAIL;
	Snake.head().piece = SNAKE_HEAD;
	Snake.head().direction = SNAKE_DIR;
}

function gameLoop() {
	ctx.clearRect(0,0, canvasWidth, canvasHeight);
	drawGame();
	updateSnake();
}

window.onkeydown = function (e) {
	console.log(e.keyCode);
	switch (e.keyCode) {
		case 38:
			SNAKE_DIR = [0, -1];
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
		default:
			break;
	}
}

setInterval(gameLoop, 200);
