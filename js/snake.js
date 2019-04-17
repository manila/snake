const canvas = document.getElementById("snake-game");
const ctx = canvas.getContext("2d");

const gameGridWidth = 21; //
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

const SNAKE_EAT = [[[1, 0, 1, 0,
      0, 1, 0, 0,
      1, 1, 0, 0,
      0, 0, 1, 0],
      [0, 1, 0, 1,
      0, 0, 1, 0,
      0, 0, 1, 1,
      0, 1, 0, 0]],
      [[0, 0, 0, 0,
      1, 0, 0, 1,
      0, 1, 1, 0,
      1, 0, 1, 0],
      [1, 0, 1, 0,
      0, 1, 1, 0,
      1, 0, 0, 1,
      0, 0, 0, 0]]];

const SNAKE_BODY = [[[1, 1, 0, 1,
      1, 0, 1, 1],
      [1, 0, 1, 1,
      1, 1, 0, 1]],
      [[1, 1,
      0, 1,
      1, 0,
      1, 1],
      [1, 1,
      1, 0,
      0, 1,
      1, 1]]];

const SNAKE_BEND = [[[1, 1, 0,
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


/* Every "piece" of the snake is a class, the snake is broken up into head, tail, etc... */
class SnakePiece {
	constructor(x, y, width, height, piece, direction, offsetX, offsetY) {

		/* Figure our what direction piece faces, use the correct oriented bitmap */
		this.pieceDirX = Math.abs(direction[1]);
		this.pieceDirY = (direction[0] < 0 ? 1 : 0) + (direction[1] > 0 ? 1 : 0);

		/* X & Y coornate of body on the grid */
		this.x = x;
		this.y = y;
		
		/* Offset in "Pixels" of piece in grid */
		this.offsetX = offsetX;
		this.offsetY = offsetY;

		/* Width and Height of bitmaps */
		this.width = width;
		this.height = height;

		/* Bitmap, select the right orientation */
		this.piece = piece[this.pieceDirX][this.pieceDirY];

		/* Direction piece is headed */
		this.directionX = direction[0];
		this.directionY = direction[1];
		
		/* A copy of direction piece is headed */
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
			SNAKE_HEAD, 
			[directionX, directionY],
			2,
			2
		     );
	}

	eat() {
		this.piece = SNAKE_EAT[this.pieceDirX][this.pieceDirY];
	}	
}

class SnakeBody extends SnakePiece {
	constructor(x, y, directionX, directionY) {
		super(
			x,
			y,
			directionX !== 0 ? 4 : 2, // Based on direction, change with and height to match orientation of the piece
			directionY !== 0 ? 4 : 2, 
			SNAKE_BODY,
			[directionX, directionY],
			directionX !== 0 ? 2 : 3, // Based on direction, change the offset in coodinate
			directionY !== 0 ? 2 : 3
		);
	}

	bend(directionX, directionY) {

		/* This is the snake body bend bitmap, we need to know which way to bend */
		this.bendX = this.direction[0] !== 0 ? (this.direction[0] < 0 ? 0 : 1) : (directionX < 0 ? 0 : 1);
		this.bendY = this.direction[1] !== 0 ? (this.direction[1] < 0 ? 0 : 1) : (directionY < 0 ? 0 : 1);

		this.width = 3;
		this.height = 3;

		this.piece = SNAKE_BEND[this.bendX][this.bendY];

		this.setDir(directionX, directionY);


		/*
		TODO

		clean this section up, this calculates the offset of the bend based on which direction snake is coming, going
		*/
		if ((this.x + this.direction[0] >= this.x || this.direction[1] < 0) && (this.directionX < 1))
		{
			this.offsetX = 3;
		}
		else
		{
			this.offsetX = 2
		}

		if (this.y + this.direction[1] > this.y || this.directionY < 0)
		{
			this.offsetY = 3
		}
		else
		{
			this.offsetY = 2;
		}

	}
}

class SnakeTail extends SnakePiece {
	constructor(x, y, directionX, directionY) {
		super(
			x,
			y,
			4,
			4,
			SNAKE_TAIL,
			[directionX, directionY],
			2,
			2
		);
	}
}

class Snake {
	constructor(startX, startY, length) {
		this.x;
		this.y;
			
		this.direction = [0 , 0];
		
		this.body = [
			new SnakeTail(1, 6, 1, 0),
			new SnakeBody(2, 6, 1, 0),
			new SnakeBody(3, 6, 1, 0),
			new SnakeHead(4, 6, 1, 0)
		]

		/*
		for (let i = 0; i < length; i++)
		{
			if (i == 0)
			{
				this.body.push(new SnakeTail, this.x - length, this.y, 1, 0);
			}
			else if (i == length)
			{
				this.body.push(new SnakeHead, this.x - length, this.y, 1, 0);
			}
			else
			{
				this.body.push(new SnakeBody, this.x - length, this.y, 1, 0);
			}
		}
		*/
	}

	get head() { // Getter function to return the head as a property
		if (this.body.length > 2)
		{
			return this.body[this.body.length - 1];
		}
		else
		{
			return [];
		}
	}

	set head(snakePiece) { // Setter function to change the head into another type of piece
		this.body[this.body.length - 1] = snakePiece;
	}

	get tail() { 
		if (this.body.length > 2)
		{
			return this.body[0];
		}
		else
		{
			return [];
		}
	}

	set tail(snakePiece) {
		this.body[0] = snakePiece;		
	}

	grow() {
		// Grow snake by adding a new SnakeHead at the end of the Array
		return this.body.unshift(new SnakeHead(this.head.x, this.head.y, this.direction[0], this.direction[1]));
	}

	move(directionX, directionY) {
		if (Game.snake.active) {
		if (this.changedDir(directionX, directionY)) 
		{	
			this.head = new SnakeBody(
						  this.head.x, 
						  this.head.y, 
						  this.head.direction[0], 
						  this.head.direction[1]
						 );

			this.head.bend(directionX, directionY);
		}
		else
		{
			if (this.head.piece != SNAKE_FULL)
			{
				this.head = new SnakeBody(this.head.x, this.head.y, directionX, directionY);
			}
		}

		
		this.body.push(new SnakeHead(
					      this.head.x + directionX, 
					      this.head.y + directionY, 
					      this.direction[0],
					      this.direction[1]
					     ));

		this.body.shift();

		this.tail = new SnakeTail(
					  this.tail.x, 
					  this.tail.y, 
					  this.tail.direction[0], 
					  this.tail.direction[1]
					 );
		}
	}

	setDir(directionX, directionY) {
		this.direction[0] = directionX;
		this.direction[1] = directionY;
	}

	changedDir(directionX, directionY) {
		
		if (this.body.length > 2)
		{
			if (
				this.body[Game.snake.body.length - 2].direction[0] == directionX && 
				this.body[Game.snake.body.length - 2].direction[1] == directionY
			)
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
		
	}

	willEat(foodX, foodY) {
		if (
			Game.snake.head.x + (Game.snake.direction[0]) == foodX &&
			Game.snake.head.y + (Game.snake.direction[1]) == foodY
		)
		{
			Game.snake.head.eat();
		}
	}

	checkCollision(x, y) {
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

var Game = {
	canvas: canvas,
	ctx: ctx,
	gridWidth: 21,
	gridHeight: 12,
	height: 48,
	width: 84,
	pixelPadding: 1,
	scaleMultiplier: 4,
	canvasWidth: (gameWidth * scaleMultiplier) + gameWidth,
	canvasHeight: (gameHeight * scaleMultiplier) + gameHeight,
	foodPieces: [[0 , 0]],
	food: {},
	score: 0,
	active: true,
	speed: 200,
	snake: new Snake(6, 6, 4)
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

/* draw a horizonal line of pixels given how many pixels down */
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
			if (
				h == 8 || 
				h == gameHeight - 1 || 
				w == 0 || 
				w == gameWidth -1
			   )
			{
				drawPixel(w, h, 0, 0);
			}
		}
	}
}

function drawScore() {
	drawBitmap(0, 0, 3, 5, NUMBERS[Math.floor(Game.score / 1000) % 10], 1, 0);
	drawBitmap(1, 0, 3, 5, NUMBERS[Math.floor(Game.score / 100) % 10], 1, 0);
	drawBitmap(2, 0, 3, 5, NUMBERS[Math.floor(Game.score / 10) % 10], 1, 0);
	drawBitmap(3, 0, 3, 5, NUMBERS[Game.score % 10], 1, 0);

	if (Game.score > 9999) {
		Game.score = 0;
	}
}

function drawPixel(x, y, pixelOffSetX, pixelOffSetY, color) {

	if (color) {
		ctx.fillStyle = color;
	} else {
		ctx.fillStyle = "#222" //"rgba(0,0,0,0.7)";
	}

	ctx.fillRect(
			(x + pixelOffSetX) * (pixelPadding + scaleMultiplier), 
			(y + pixelOffSetY) * (scaleMultiplier + pixelPadding),
			scaleMultiplier, 
			scaleMultiplier
		    );
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
					pixelOffSetY
				 );
		}
	}
}

function drawSnakePiece(x, y, width, height, part, offsetX, offsetY) {

	drawBitmap(x, y, width, height, part, offsetX, offsetY);
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
	for (let i = 0; i < Game.snake.body.length; i++)
	{
		Game.snake.body[i].draw();
	}
}

function updateSnake() {
	if (Game.snake.checkCollision(Game.snake.head.x + Game.snake.direction[0], Game.snake.head.y + Game.snake.direction[1])) {
		Game.snake.direction = [0, 0];
		resetSnake();
	}

	if (Game.snake.direction[0] != 0 || Game.snake.direction[1] != 0)
	{
		Game.snake.move(Game.snake.direction[0], Game.snake.direction[1]);
	}

	if (Game.snake.head.x > 19) {
		Game.snake.head.x = 0;
	} else if (Game.snake.head.y > 10) {
		Game.snake.head.y = 2;
	} else if (Game.snake.head.x < 0) {
		Game.snake.head.x = 19;
	} else if (Game.snake.head.y < 2) {
		Game.snake.head.y = 10;
	}

	Game.snake.willEat(FOOD.pos.x, FOOD.pos.y);

	
	if (Game.snake.head.x == FOOD.pos.x && Game.snake.head.y == FOOD.pos.y)
	{
		Game.score += 3;
		Game.snake.body[Game.snake.body.length - 1].piece = SNAKE_FULL;
		Game.snake.grow();
		makeFood();
	}
}

/* Delete snake and make a new one */
function resetSnake() {
	Game.snake.active = false;

	setTimeout(function () {
		Game.snake.body = [
			new SnakeTail(1, 6, 1, 0),
			new SnakeBody(2, 6, 1, 0),
			new SnakeBody(3, 6, 1, 0),
			new SnakeHead(4, 6, 1, 0)
		]

		Game.score = 0;
		Game.snake.active = true;
	}, 1500);
}

// Generate an apple somwhere randomly on the board
function makeFood() {
	var foodX = Math.floor(Math.random() * 19);
	var foodY = Math.floor(Math.random() * 9) + 2;

	if (!Game.snake.checkCollision(foodX, foodY))
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
}



window.onkeydown = function (e) {
	//console.log(e.keyCode);
	switch (e.keyCode) {
		case 38: // down arrow
			if (Game.snake.changedDir(0, 1)) {
				Game.snake.setDir(0, -1);;
			}
			break;
		case 40: // up arrow
			if (Game.snake.changedDir(0, -1)) {
				Game.snake.setDir(0, 1);
			}
			break;
		case 37: // left arrow
			if (Game.snake.changedDir(1, 0)) {
				Game.snake.setDir(-1, 0);
			}
			break;
		case 39: // right arrow
			if (Game.snake.changedDir(-1, 0)) {
				Game.snake.setDir(1, 0);
			}
			break;
		/*
		case 71: // Debug
			Game.snake.grow();
			break;
		case 80: // Debug
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
		*/
		default:
			break;
	}
	//Game.snake.move(Game.snake.direction[0], Game.snake.direction[1]);
}

function setupGame() {
	makeFood();
	Game.active = true;
	Game.snake.active = true;
	GAME_LOOP = setInterval(gameLoop, Game.speed);
}

setupGame();
