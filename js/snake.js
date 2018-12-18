const canvas = document.getElementById("snake-game");
const ctx = canvas.getContext("2d");

const gameHeight = 48;
const gameWidth = 48;
const pixelPadding = 1;
const scaleMultiplier = 4;
const canvasWidth = (gameWidth * scaleMultiplier) + gameWidth;
const canvasHeight = (gameHeight * scaleMultiplier) + gameHeight;

function drawGrid() {
	ctx.shadowColor = "#444";
ctx.shadowBlur = 0;
ctx.shadowOffsetX = 0.5;
ctx.shadowOffsetY = 0.5;
	for (w = 0; w < canvasWidth; w += 4 + pixelPadding)
	{
		for (h = 0; h < canvasHeight; h += 4 + pixelPadding)
		{
			ctx.fillRect(w, h, scaleMultiplier, scaleMultiplier);
		} 
	}


	/*
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#abddbc";

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);

	for (var w = 0; w < canvasWidth; w += 4) {
		ctx.moveTo(w + 0.5, 0);
		ctx.lineTo(w + 0.5, canvasHeight); 
		ctx.stroke();
	}

	for (var h = 0; h < canvasHeight; h += 4)
	{
		ctx.moveTo(0, h + 0.5);
		ctx.lineTo(canvasWidth, h + 0.5);
		ctx.stroke();
	}

	ctx.translate(-0.5, -0.5);
	*/
}

function drawGame() {
}

drawGrid();
