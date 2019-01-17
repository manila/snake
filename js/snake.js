const canvas = document.getElementById("snake-game");
const ctx = canvas.getContext("2d");

var DISABLE_SHADOWS = true;

const gameGridWidth = 21;
const gameGridHeight = 12;
const gameHeight = 48;
const gameWidth = 84;
const pixelPadding = 1;
const scaleMultiplier = 4;

const canvasWidth = (gameWidth * scaleMultiplier) + gameWidth;
const canvasHeight = (gameHeight * scaleMultiplier) + gameHeight;

const NUMBERS = [[1,1,1,
		  1,0,1,
		  1,0,1,
		  1,0,1,
		  1,1,1],
	         [0,1,0,
		  1,1,0,
		  0,1,0,
		  0,1,0,
		  0,1,0],
		 [1,1,1,
		  0,0,1,
		  1,1,1,
		  1,0,0,
		  1,1,1],
		 [1,1,1,
		  0,0,1,
		  1,1,1,
		  0,0,1,
		  1,1,1],
		 [1,0,1,
		  1,0,1,
		  1,1,1,
		  0,0,1,
		  0,0,1],
		 [1,1,1,
		  1,0,0,
		  1,1,1,
		  0,0,1,
		  1,1,1],
		 [1,1,1,
		  1,0,0,
		  1,1,1,
		  1,0,1,
		  1,1,1],
		 [1,1,1,
		  0,0,1,
		  0,1,0,
		  0,1,0,
		  0,1,0],
		 [1,1,1,
		  1,0,1,
		  1,1,1,
		  1,0,1,
		  1,1,1],
		 [1,1,1,
		  1,0,1,
		  1,1,1,
		  0,0,1,
		  0,0,1]];

const SNAKE_HEAD = [1, 0, 0, 0,
		    0, 1, 1, 0,
		    1, 1, 1, 0,
	    	    0, 0, 0, 0];

const SNAKE_EAT = [1, 0, 1, 0,
		    0, 1, 0, 0,
		    1, 1, 0, 0,
	    	    0, 0, 1, 0];

const SNAKE_BODY = [0, 0, 0, 0,
		    1, 1, 0, 1,
		    1, 0, 1, 1,
		    0, 0, 0, 0];

const SNAKE_TURN = [0, 0, 0, 0,
		    0, 0, 1, 1,
		    0, 1, 0, 1,
		    0, 1, 1, 0];


const SNAKE_FULL = [0, 1, 1, 0,
		    1, 1, 0, 1,
		    1, 0, 1, 1,
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

var FOOD = {};

var Snake = {
	direction: [1, 0],
	body: [
		{x: 0, y: 6, piece: SNAKE_TAIL, direction: [1, 0]}, 
		{x: 1, y: 6, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 2, y: 6, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 3, y: 6, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 4, y: 6, piece: SNAKE_BODY, direction: [1, 0]}, 
		{x: 5, y: 6, piece: SNAKE_HEAD, direction: [1, 0]}
	],	
	head: function () {
		return this.body[this.body.length - 1];
	},
	tail: function () {
		return this.body[0];
	},
	grow: function () {
		return this.body.unshift({x: this.head().x, y: this.head().y, piece: SNAKE_HEAD, direction: this.direction});
	},
	move: function (directionX, directionY) {
		if (this.changedDir(directionX, directionY)) {
			this.head().piece = SNAKE_TURN;
			this.head().direction = [directionX, directionY];
		}
		else
		{
			if (this.head().piece != SNAKE_FULL)
			{
				this.head().piece = SNAKE_BODY;
			}
		}
		this.body.push({x: this.head().x + directionX, y: this.head().y + directionY, piece: SNAKE_HEAD, direction: this.direction});
		this.body.shift();
		this.tail().piece = SNAKE_TAIL;
		this.direction = [directionX, directionY];
	},
	setDir: function (directionX, directionY) {
		this.direction[0] = directionX;
		this.direction[1] = directionY;
	},
	changedDir: function (directionX, directionY) {
		if (this.body[Snake.body.length - 2].direction[0] == directionX && this.body[Snake.body.length - 2].direction[1] == directionY)
		{
			return false;
		}
		else
		{
			return true;
		}
	},
	willEat: function (foodX, foodY) {
		if (Snake.head().x + (Snake.direction[0]) == foodX && Snake.head().y + (Snake.direction[1]) == foodY) {
			Snake.head().piece = SNAKE_EAT;
		} else {
			//Snake.head().piece = SNAKE_HEAD;
		}
	},
	checkCollison: function (x, y) {
		for (let i = 0; i < this.body.length - 1; i++)
		{
			if (x == this.body[i].x && y == this.body[i].y)
			{
				return true;

			}
		}

		return false;
	}
}

function drawGrid() {
	for (w = 0; w < canvasWidth / scaleMultiplier; w++)
	{
		for (h = 0; h < canvasHeight / scaleMultiplier; h++)
		{
			drawPixel(w, h, 0, 0, "#b0c0b0" /*"rgba(0,0,0,0.1)"*/);
		} 
	}
}

function drawHorizontalLine(y) {
	for (let x = 0; x < gameWidth; x++)
	{
		drawPixel(x, y, 0, 0);
	}
}

function drawOutline() {
	for (w = 0; w < canvasWidth / scaleMultiplier; w++)
	{
		for (h = 8; h < canvasHeight / scaleMultiplier; h++)
		{
			if (h == 8 || h == gameHeight - 1 || w == 0 || w == gameWidth -1)
			{
				drawPixel(w, h, 0, 0);
			}
		}
	}
}

function drawScore() {
	drawBitmap(0, 0, 3, 5, NUMBERS[Math.floor(SCORE / 1000) % 10], 1, 0);
	drawBitmap(1, 0, 3, 5, NUMBERS[Math.floor(SCORE / 100) % 10], 1, 0);
	drawBitmap(2, 0, 3, 5, NUMBERS[Math.floor(SCORE / 10) % 10], 1, 0);
	drawBitmap(3, 0, 3, 5, NUMBERS[SCORE % 10], 1, 0);

	if (SCORE > 9999) {
		SCORE = 0;
	}
}

function drawPixel(x, y, pixelOffSetX, pixelOffSetY, color) {

	if (color) {
		ctx.fillStyle = color;
	} else {
		ctx.fillStyle = "#222" //"rgba(0,0,0,0.7)";
	}

	if (!DISABLE_SHADOWS) {
		ctx.shadowColor = "#b4c4b4" //"rgba(0,0,0,0.2)";
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0.5;
		ctx.shadowOffsetY = 0.5;
	}

	ctx.fillRect((x + pixelOffSetX) * (pixelPadding + scaleMultiplier), (y + pixelOffSetY) * (scaleMultiplier + pixelPadding), scaleMultiplier, scaleMultiplier);
}

function drawBitmap(x, y, width, height, bitmap, pixelOffSetX, pixelOffSetY, flipX, flipY) {
	
	for (let i = 0; i < width*height; i++)
	{
		if (bitmap[i] == 1)
		{
			drawPixel((x * 4) + Math.floor((i % width)), (y * 4) + Math.floor(i / width), pixelOffSetX, pixelOffSetY);
		}
	}
}

function drawSnakePiece(x, y, part, direction) {

	for (let i = 0; i < 16; i++)
	{
		if (part[i] == 1)
		{
			if (direction[1] == -1) {
				drawPixel((x * 4) + Math.floor((i) / 4), (y * 4) + Math.floor((15 - i) % 4), 2, 2);
			} else if (direction[0] == -1) {
				drawPixel((x * 4) + Math.floor((15 - i) % 4), (y * 4) + Math.floor(i / 4), 2, 2);
			} else if (direction[1] == 1) {
				drawPixel((x * 4) + Math.floor((15 - i) / 4), (y * 4) + Math.floor((i) % 4), 2, 2);
			} else {
				drawPixel((x * 4) + Math.floor(i % 4), (y * 4) + Math.floor(i / 4), 2, 2);
			}
		}
	}
}

function drawGame() {
	drawGrid();
	drawHorizontalLine(6);
	drawOutline();
	for (let i = 0; i < Snake.body.length; i++)
	{
		drawSnakePiece(Snake.body[i].x, Snake.body[i].y, Snake.body[i].piece, Snake.body[i].direction);
	}
}

function updateSnake() {
	Snake.move(Snake.direction[0], Snake.direction[1]);

	if (Snake.head().x > 19) {
		Snake.head().x = 0;
	} else if (Snake.head().y > 10) {
		Snake.head().y = 2;
	} else if (Snake.head().x < 0) {
		Snake.head().x = 19;
	} else if (Snake.head().y < 2) {
		Snake.head().y = 10;
	}

	Snake.willEat(FOOD.pos.x, FOOD.pos.y);

	if (Snake.checkCollison(Snake.head().x, Snake.head().y)) {
		SCORE = 0;
		Snake.body = [
			{x: 0, y: 6, piece: SNAKE_TAIL, direction: [1, 0]}, 
			{x: 1, y: 6, piece: SNAKE_BODY, direction: [1, 0]}, 
			{x: 2, y: 6, piece: SNAKE_BODY, direction: [1, 0]}, 
			{x: 3, y: 6, piece: SNAKE_BODY, direction: [1, 0]}, 
			{x: 4, y: 6, piece: SNAKE_BODY, direction: [1, 0]}, 
			{x: 5, y: 6, piece: SNAKE_HEAD, direction: [1, 0]}, 
		];
	}

	if (Snake.head().x == FOOD.pos.x && Snake.head().y == FOOD.pos.y)
	{
		SCORE += 3;
		Snake.body[Snake.body.length - 1].piece = SNAKE_FULL;
		Snake.grow();
		makeFood();
	}
}

function makeFood() {
	var foodX = Math.floor(Math.random() * 19);
	var foodY = Math.floor(Math.random() * 9) + 2;
	FOOD = {pos: {x: foodX, y: foodY}, piece: FOOD_PIECE};
}

function generateBeets() {
	FOOD_PIECES.push({x: 0, y: 0});
}

function gameLoop() {
	updateSnake();
	ctx.clearRect(0,0, canvasWidth, canvasHeight);
	drawGame();
	drawBitmap(FOOD.pos.x, FOOD.pos.y, 3, 3, FOOD_PIECE, 2, 2);
	drawScore();
	if (NUM > 9)
	{
		NUM = 0;
	}
}

window.onkeydown = function (e) {
	console.log(e.keyCode);
	switch (e.keyCode) {
		case 38:
			if (Snake.changedDir(0, 1)) {
				Snake.setDir(0, -1);;
			}
			break;
		case 40:
			if (Snake.changedDir(0, -1)) {
				Snake.setDir(0, 1);
			}
			break;
		case 37:
			if (Snake.changedDir(1, 0)) {
				Snake.setDir(-1, 0);
			}
			break;
		case 39:
			if (Snake.changedDir(-1, 0)) {
				Snake.setDir(1, 0);
			}
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
				GameLoop = setInterval(gameLoop, GAME_SPEED);
				GAME_IS_PAUSED = false;
			}
			break;
		case 83:
			GAME_SPEED += 50;
			clearInterval(GameLoop);
			GameLoop = setInterval(gameLoop, GAME_SPEED);
			break;
		case 70:
			GAME_SPEED -= 50;
			clearInterval(GameLoop);
			GameLoop = setInterval(gameLoop, GAME_SPEED);
			break;
		default:
			break;
	}
	//Snake.move(Snake.direction[0], Snake.direction[1]);
}

var GAME_SPEED = 200;
var SCORE = 0;
var GameLoop = setInterval(gameLoop, GAME_SPEED);
var GAME_IS_PAUSED = false;
var NUM = 0;

makeFood();
