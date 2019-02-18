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

class snakeBody {
	constructor(x, y, piece, direction) {
		this.x = x;
		this.y = y;
		this.piece = piece;
		this.direction = direction;
	}

	draw() {
		drawSnakePiece(this.x, this.y, this.piece, this.direction);
	}

	setDir(x, y) {
		this.direction = [x, y];
	}
}

var Snake = {
	direction: [1, 0],
	body: [
		new snakeBody(1, 6, SNAKE_TAIL, [1, 0]), 
		new snakeBody(2, 6, SNAKE_BODY, [1, 0]), 
		new snakeBody(3, 6, SNAKE_BODY, [1, 0]), 
		new snakeBody(4, 6, SNAKE_HEAD, [1, 0]) 
	],	
	head: function () {
		if (this.body.length > 2)
		{
			return this.body[this.body.length - 1];
		}
		else
		{
			return [];
		}
	},
	tail: function () {
		if (this.body.length > 2)
		{
			return this.body[0];
		}
		else
		{
			return [];
		}
	},
	grow: function () {
		return this.body.unshift(new snakeBody(this.head().x, this.head().y, SNAKE_HEAD, this.direction));
	},
	move: function (directionX, directionY) {
		if (this.changedDir(directionX, directionY)) {
			this.head().piece = SNAKE_TURN;
			this.head().setDir(directionX, directionY);
		}
		else
		{
			if (this.head().piece != SNAKE_FULL)
			{
				this.head().piece = SNAKE_BODY;
			}
		}
		this.body.push(new snakeBody(
					this.head().x + directionX, 
					this.head().y + directionY, 
					SNAKE_HEAD, 
					this.direction
					)
				);
		this.body.shift();
		this.tail().piece = SNAKE_TAIL;
		this.direction = [directionX, directionY];
	},
	setDir: function (directionX, directionY) {
		this.direction[0] = directionX;
		this.direction[1] = directionY;
	},
	changedDir: function (directionX, directionY) {
		
		if (this.body.length > 2)
		{
			if (this.body[Snake.body.length - 2].direction[0] == directionX && this.body[Snake.body.length - 2].direction[1] == directionY)
			{
				return false;
			}
			else
			{
				return true;
			}
		}
		else
		{
			return false;
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
	if (DRAW_SNAKE) {
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
}

function drawBackground() {
	ctx.fillStyle = "#bcb";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawGame() {
	drawBackground();
	drawGrid();
	drawHorizontalLine(6);
	drawOutline();
	for (let i = 0; i < Snake.body.length; i++)
	{
		Snake.body[i].draw();
		//console.log(Snake.body);
		//drawSnakePiece(Snake.body[i].x, Snake.body[i].y, Snake.body[i].piece, Snake.body[i].direction);
	}
}

function updateSnake() {
	if (Snake.checkCollison(Snake.head().x + Snake.direction[0], Snake.head().y + Snake.direction[1])) {
		SCORE = 0;
		Snake.direction = [0, 0];
		blinkSnake();
		//console.log("called");	
		/*
		Snake.body = [
			new snakeBody(1, 6, SNAKE_TAIL, [1, 0]), 
			new snakeBody(2, 6, SNAKE_BODY, [1, 0]), 
			new snakeBody(3, 6, SNAKE_BODY, [1, 0]), 
			new snakeBody(4, 6, SNAKE_HEAD, [1, 0]) 
		];
		*/
		
	}

	if (Snake.direction[0] != 0 || Snake.direction[1] != 0)
	{
		Snake.move(Snake.direction[0], Snake.direction[1]);
	}

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

	
	if (Snake.head().x == FOOD.pos.x && Snake.head().y == FOOD.pos.y)
	{
		SCORE += 3;
		Snake.body[Snake.body.length - 1].piece = SNAKE_FULL;
		Snake.grow();
		makeFood();
	}
}

function resetSnake() {
	DRAW_SNAKE = true;
	Snake.body = [
		new snakeBody(1, 6, SNAKE_TAIL, [1, 0]), 
		new snakeBody(2, 6, SNAKE_BODY, [1, 0]), 
		new snakeBody(3, 6, SNAKE_BODY, [1, 0]), 
		new snakeBody(4, 6, SNAKE_HEAD, [1, 0]) 
	];

}

function blinkSnake() {
	var blinkCount = 0;
	var tempSnakeBody = Snake.body;
	Snake.direction = [0, 0];
	var snakeBlinkInterval = setInterval(function () {

		if (blinkCount % 2 == 0) {
			DRAW_SNAKE = false;
		} else {
			DRAW_SNAKE = true;
		} 
		
		if (blinkCount > 9) {
			clearInterval(snakeBlinkInterval);
			resetSnake();
		}

		blinkCount++;
		
	}, 200);
}

function makeFood() {
	var foodX = Math.floor(Math.random() * 19);
	var foodY = Math.floor(Math.random() * 9) + 2;

	if (!Snake.checkCollison(foodX, foodY))
	{
		FOOD = {pos: {x: foodX, y: foodY}, piece: FOOD_PIECE};
	}
	else
	{
		makeFood();
	}
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
		case 38: // down arrow
			if (Snake.changedDir(0, 1)) {
				Snake.setDir(0, -1);;
			}
			break;
		case 40: // up arrow
			if (Snake.changedDir(0, -1)) {
				Snake.setDir(0, 1);
			}
			break;
		case 37: // left arrow
			if (Snake.changedDir(1, 0)) {
				Snake.setDir(-1, 0);
			}
			break;
		case 39: // right arrow
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
var DRAW_SNAKE = true;
var SCORE = 0;
var GameLoop = setInterval(gameLoop, GAME_SPEED);
var GAME_IS_PAUSED = false;
var NUM = 0;

makeFood();
