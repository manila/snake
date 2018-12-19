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

var SNAKE_DIR = "right";

Snake = [
		{x: 0, y: 0, piece: SNAKE_TAIL, direction: SNAKE_DIR}, 
		{x: 1, y: 0, piece: SNAKE_BODY, direction: SNAKE_DIR}, 
		{x: 2, y: 0, piece: SNAKE_BODY, direction: SNAKE_DIR}, 
		{x: 3, y: 0, piece: SNAKE_BODY, direction: SNAKE_DIR}, 
		{x: 4, y: 0, piece: SNAKE_BODY, direction: SNAKE_DIR}, 
		{x: 5, y: 0, piece: SNAKE_BODY, direction: SNAKE_DIR}, 
		{x: 6, y: 0, piece: SNAKE_BODY, direction: SNAKE_DIR}, 
		{x: 7, y: 0, piece: SNAKE_HEAD, direction: SNAKE_DIR}
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
	for (let i = 0; i < 16; i++)
	{
		if (part[i] == 1)
		{
			switch (direction) {
				case "right":
					drawPixel((x * 4) + Math.floor(i % 4), (y * 4) + Math.floor(i / 4));
					break;
				case "down":	
					drawPixel((x * 4) + Math.floor(i / 4), (y * 4) + Math.floor(i % 4));
					break;
				default:
					break;
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

function updateSnake() {
	if (SNAKE_DIR == "down") {
		Snake[0].y = Snake[Snake.length - 1].y + 1;
		Snake[0].x = Snake[Snake.length - 1].x;
	} else {
		Snake[0].x = Snake[Snake.length - 1].x + 1;
	}
	Snake[Snake.length - 1].piece = SNAKE_TURN;
	Snake.push(Snake.shift());
	Snake[0].piece = SNAKE_TAIL;
	Snake[Snake.length - 1].piece = SNAKE_HEAD;
	Snake[Snake.length - 1].direction = SNAKE_DIR;
}

function gameLoop() {
	ctx.clearRect(0,0, canvasWidth, canvasHeight);
	drawGame();
	updateSnake();
}

window.onkeydown = function (e) {
	console.log(e.keyCode);
	switch (e.keyCode) {
		case 40:
			SNAKE_DIR = "down";
		default:
			break;
	}
}

setInterval(gameLoop, 200);
