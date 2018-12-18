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

const SNAKE_TAIL = [0, 0, 0, 0,
		    0, 0, 1, 1,
		    1, 1, 1, 1,
		    0, 0, 0, 0];

Snake = [
		{x: 0, y: 0, piece: SNAKE_TAIL}, 
		{x: 1, y: 0, piece: SNAKE_BODY}, 
		{x: 2, y: 0, piece: SNAKE_BODY}, 
		{x: 3, y: 0, piece: SNAKE_BODY}, 
		{x: 4, y: 0, piece: SNAKE_BODY}, 
		{x: 5, y: 0, piece: SNAKE_BODY}, 
		{x: 6, y: 0, piece: SNAKE_BODY}, 
		{x: 7, y: 0, piece: SNAKE_HEAD}
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

function drawSnakePiece(x, y, part) {
	for (let i = 0; i < 16; i++)
	{
		if (part[i] == 1)
		{
			drawPixel((x * 4) + Math.floor(i % 4), (y * 4) + Math.floor(i / 4));
		}
	}
}

function drawGame() {
	for (let i = 0; i < 8; i++)
	{
		drawSnakePiece(Snake[i].x, Snake[i].y, Snake[i].piece);
	}
}

function updateSnake() {
	for (let i = 0; i < 8; i++)
	{
		Snake[i].x++;
		if (Snake[i].x > 20)
		{
			Snake[i].x = 0;
			Snake[i].y++;
			if (Snake[i].y > 11)
			{
				Snake[i].y = 0;
			}
		}
	}
}

function gameLoop() {
	ctx.clearRect(0,0, canvasWidth, canvasHeight);
	drawGame();
	updateSnake();
}

setInterval(gameLoop, 200);
