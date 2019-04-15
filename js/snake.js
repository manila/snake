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

/* Bitmap numbers */
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

/* Snake head bitmap */
const SNAKE_HEAD = [[[1, 0, 0, 0,
		      0, 1, 1, 0,
		      1, 1, 1, 0,
	    	      0, 0, 0, 0],
		     [0, 0, 0, 1,
		      0, 1, 1, 0,
		      0, 1, 1, 1,
	    	      0, 0, 0, 0]],
		    [[0, 0, 0, 0,
		      0, 1, 1, 0,
		      0, 1, 1, 0,
	    	      1, 0, 1, 0],
		     [1, 0, 1, 0,
		      0, 1, 1, 0,
		      0, 1, 1, 0,
	    	      0, 0, 0, 0]]];


/* Open mouth snake bitmap */
const SNAKE_EAT = [1, 0, 1, 0,
		   0, 1, 0, 0,
		   1, 1, 0, 0,
	    	   0, 0, 1, 0];

const SNAKE_BODY = [[[0, 0, 0, 0,
		      1, 1, 0, 1,
		      1, 0, 1, 1],
		     [0, 0, 0, 0,
		      1, 0, 1, 1,
		      1, 1, 0, 1,
		      0, 0, 0, 0]],
		    [[0, 1, 1, 0,
		      0, 0, 1, 0,
		      0, 1, 0, 0,
		      0, 1, 1, 0],
		     [0, 1, 1, 0,
		      0, 1, 0, 0,
		      0, 0, 1, 0,
		      0, 1, 1, 0]]];

const SNAKE_TURN = [[[1, 1, 0,
		      1, 0, 1,
		      0, 1, 1],
		     [0, 1, 1,
		      1, 0, 1,
		      1, 1, 0]],
		    [[0, 1, 1,
		      1, 0, 1,
		      1, 1, 0], 
		     [1, 1, 0,
		      1, 0, 1,
		      0, 1, 1]]];

const SNAKE_FULL = [0, 1, 1, 0,
		    1, 1, 0, 1,
		    1, 0, 1, 1,
		    0, 1, 1, 0];

const SNAKE_TAIL = [[[0, 0, 0, 0,
		      0, 0, 1, 1,
		      1, 1, 1, 1,
		      0, 0, 0, 0],
		     [0, 0, 0, 0,
		      1, 1, 0, 0,
		      1, 1, 1, 1,
		      0, 0, 0, 0]],
		    [[0, 1, 1, 0,
		      0, 1, 1, 0,
		      0, 0, 1, 0,
		      0, 0, 1, 0],
		     [0, 0, 1, 0,
		      0, 0, 1, 0,
		      0, 1, 1, 0,
		      0, 1, 1, 0]]];

/* bitmap for food piece/apple */
const FOOD_PIECE = [0, 1, 0,
		    1, 0, 1,
	            0, 1, 0];

class Game {
	constructor(canvasElem) {
		this.canvas = canvasElem;
		this.ctx = canvasElem.getContext("2d");
		this.gameGridWidth = 21;
		this.gameGridHeight = 12;
		this.gameHeight = 48;
		this.gameWidth = 84;
		this.pixelPadding = 1;
		this.scaleMultiplier = 4;

		this.canvasWidth = (gameWidth * scaleMultiplier) + gameWidth;
		this.canvasHeight = (gameHeight * scaleMultiplier) + gameHeight;
		
		this.foodPieced = [[0 , 0]];
		this.food = {};

		this.score = 0;
	}

	/*
	function draw() {

	}

	function drawBackground() {

	}
	*/
};

var FOOD_PIECES = [[0, 0]];

var SNAKE_DIR = [1, 0];

var FOOD = {};

class FoodPiece {
	constructor() {
		this.x;
		this.y;
	}
}

/* Snake body object, these are the pieces that make up the whole snake */
class SnakePiece {
	constructor(x, y, width, height, piece, direction, offsetX, offsetY) {
		this.x = x;
		this.y = y;
		this.offsetX = 2;
		this.offsetY = 2;
		this.width = width;
		this.height = height;
		this.piece = piece;
		this.directionX = direction[0];
		this.directionY = direction[1];
		this.direction = direction;
	}

	draw() {
		drawSnakePiece(this.x, this.y, this.width, this.height, this.piece, this.offsetX, this.offsetY);
	}

	setDirection(x, y) {
		this.directionX = x;
		this.directionY = y;
	}

	setDir(x, y) {
		this.direction = [x, y];
	}
}

class SnakeHead extends SnakePiece {
	constructor(x, y, directionX, directionY) {
		super(
			x, 
			y, 
			4, 
			4, 
			SNAKE_HEAD[0][0], 
			[directionX, directionY],
			0,
			0
		);
	}

}

class SnakeBody extends SnakePiece {
	constructor(x, y, directionX, directionY) {
		super(
			x,
			y,
			2,
			4,
			SNAKE_BODY[0][0],
			[directionX, directionY],
			0,
			0
		);
	}

	bend(directionX, directionY) {
		this.bendX = this.direction[0] !== 0 ? (this.direction[0] ? 1 : 0) : (directionX ? 1 : 0);
		this.bendY = this.direction[1] !== 0 ? (this.direction[1] ? 1 : 0) : (directionY ? 1 : 0);

		this.width = 3;
		this.height = 3;

		this.offsetX = 0;
		this.offsetY = 0;

		this.piece = SNAKE_BEND[this.bendX][this.bendY];
	}
}

class SnakeTail extends SnakePiece {
	constructor(x, y, directionX, directionY) {
		let pieceDirX = directionX ? 1 : 0;
		let pieceDirY = directionY ? 1 : 0;

		super(
			x,
			y,
			4,
			4,
			SNAKE_TAIL[pieceDirX][pieceDirY],
			[directionX, directionY],
			0,
			0
		);
	}
}

/* Snake object, this is the whole snake made up of SnakePiece objects */
var Snake = {
	direction: [1, 0],
	body: [
		new SnakeTail(1, 6, 1, 0),
		new SnakeBody(2, 6, 1, 0),
		new SnakeBody(3, 6, 1, 0),
		new SnakeHead(4, 6, 1, 0)
	],	
	get head() {
		if (this.body.length > 2)
		{
			return this.body[this.body.length - 1];
		}
		else
		{
			return [];
		}
	},
	get tail() {
		if (this.body.length > 2)
		{
			return this.body[0];
		}
		else
		{
			return [];
		}
	},
	grow() {
		return this.body.unshift(new SnakePiece(this.head.x, this.head.y, 4, 4, SNAKE_HEAD, this.direction));
	},
	move(directionX, directionY) {
		if (this.changedDir(directionX, directionY)) {
			this.head.piece = SNAKE_TURN[this.head.direction[0] !== 0 ? (this.head.direction[0] < 0 ? 0 : 1) : (directionX < 0 ? 0 : 1)][this.head.direction[1] !== 0 ? (this.head.direction[1] < 0 ? 0 : 1) : (directionY < 0 ? 0 : 1)];
			this.head.setDir(directionX, directionY);
			this.head.width = 3;
			this.head.height = 3;
			this.head.offsetX = directionX < 0 ? 2 : 3;
			this.head.offsetY = directionY < 0 ? 2 : 3;
		}
		else
		{
			if (this.head.piece != SNAKE_FULL)
			{
				this.head.piece = SNAKE_BODY[Math.abs(directionY)][(directionX < 0 ? 1 : 0) + (directionY > 0 ? 1 : 0)];
			}
		}
		this.body.push(new SnakePiece(
					this.head.x + directionX, 
					this.head.y + directionY, 
					4,
					4,
					SNAKE_HEAD[Math.abs(directionY)][(directionX < 0 ? 1 : 0) + (directionY > 0 ? 1 : 0)], 
					this.direction
					)
				);
		this.body.shift();
		this.tail.piece = SNAKE_TAIL[Math.abs(this.tail.direction[1])][(this.tail.direction[0] < 0 ? 1 : 0) + (this.tail.direction[1] > 0 ? 1 : 0)]
		this.tail.width = 4;
		this.tail.height = 4;
		this.tail.offsetX = 2;
		this.tail.offsetY = 2;
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
		if (Snake.head.x + (Snake.direction[0]) == foodX && Snake.head.y + (Snake.direction[1]) == foodY) {
			Snake.head.piece = SNAKE_EAT;
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

/* draw the outline of a box around the playable area */
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

function drawBitmap(x, y, width, height, bitmap, pixelOffSetX, pixelOffSetY) {

	for (let i = 0; i < width*height; i++)
	{
		if (bitmap[i] == 1)
		{
			drawPixel(
				(x * 4) + Math.abs(Math.floor(i % width)),
				(y * 4) + Math.abs(Math.floor(i / width)), 
				pixelOffSetX, 
				pixelOffSetY);
		}
	}
}

function drawSnakePiece(x, y, width, height, part, offsetX, offsetY) {
	
	drawBitmap(x, y, width, height, part, offsetX, offsetY);

	/*
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
	*/
}

/* Fill canvas with a solid color rectangle AKA background */
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
	if (Snake.checkCollison(Snake.head.x + Snake.direction[0], Snake.head.y + Snake.direction[1])) {
		Snake.direction = [0, 0];
		SCORE = 0;
	}

	if (Snake.direction[0] != 0 || Snake.direction[1] != 0)
	{
		Snake.move(Snake.direction[0], Snake.direction[1]);
	}

	if (Snake.head.x > 19) {
		Snake.head.x = 0;
	} else if (Snake.head.y > 10) {
		Snake.head.y = 2;
	} else if (Snake.head.x < 0) {
		Snake.head.x = 19;
	} else if (Snake.head.y < 2) {
		Snake.head.y = 10;
	}

	Snake.willEat(FOOD.pos.x, FOOD.pos.y);

	
	if (Snake.head.x == FOOD.pos.x && Snake.head.y == FOOD.pos.y)
	{
		SCORE += 3;
		Snake.body[Snake.body.length - 1].piece = SNAKE_FULL;
		Snake.grow();
		makeFood();
	}
}

/* Delete snake and make a new one */
function resetSnake() {
	DRAW_SNAKE = true;
	Snake.body = [
		new SnakePiece(1, 6, SNAKE_TAIL[0][0], [1, 0]), 
		new SnakePiece(2, 6, SNAKE_BODY[0][0], [1, 0]), 
		new SnakePiece(3, 6, SNAKE_BODY[0][0], [1, 0]), 
		new SnakePiece(4, 6, SNAKE_HEAD[0][0], [1, 0]) 
	];

}

// Generate an apple somwhere randomly on the board
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

function gameLoop(gameObj) {
	updateSnake();
	ctx.clearRect(0,0, canvasWidth, canvasHeight);
	drawGame();
	drawBitmap(FOOD.pos.x, FOOD.pos.y, 3, 3, FOOD_PIECE, 2, 2, 0, 0, 0);
	drawScore();
	if (NUM > 9)
	{
		NUM = 0;
	}
}

window.onkeydown = function (e) {
	//console.log(e.keyCode);
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

function setupGame() {
	var game = new Game(document.getElementById("snake-game"));
	game.makeFood();
}

var GAME_SPEED = 200;
var DRAW_SNAKE = true;
var SCORE = 0;
var GameLoop = setInterval(gameLoop, GAME_SPEED);
var GAME_IS_PAUSED = false;
var NUM = 0;

makeFood();
