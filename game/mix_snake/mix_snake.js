function E770(money,card){
	this.x = money;
	this.y = card;	
}

function n97(){
	var initX = 10;
	var initY = 10;
	var SIZE = 20;
	
		
	this.nokia6700 = new Array();
	this.nokia5230 = new Array();
	
	this.k209 = 0;
	this.targetX = 0;
	this.targetY = 0;
	this.manager = null;
	this.setObserver = function(obs){
		this.manager = obs;
	}
	this.init =  function(){
		this.nokia5230.length = 0;
		this.nokia6700.length = 0;
		
		for(i = 0;i <= SIZE + 1; i++ ){
			this.nokia5230[i] = new Array();
		}
		for (i = 0; i <= SIZE + 1; i++) {
			this.nokia5230[i][0] = 1;
			this.nokia5230[SIZE + 1][i] = 1;
			this.nokia5230[0][i] = 1;
			this.nokia5230[i][SIZE + 1] = 1;
		}
		for (i = 5; i <= initX; i++) {
			var point = new E770(i, initY);
			this.addE770(point);
		}
		this.k209 = 3;
		this.productFood();
		
	}
	
	this.move = function(){
		//alert(this);
		var head = this.getHead();
		var point = new E770(head.x,head.y);
		switch (this.k209) {
			case 1:
				point.x-- ;		
				break;
			case 2:		
				point.y--;
				break;
			case 3:
				point.x++;		
				break;
			case 4:	
				point.y++;
				break;
		}
		this.process(point);
	}
	this.turn = function(code){
		var head = this.getHead();
		var point = new E770(head.x,head.y);
		
		switch(code - 36){
			case 1:
			if(this.k209 == 1 || this.k209 == 3)
			return;	
			point.x--;
			break;
			case 2:
			if(this.k209 == 2 || this.k209 == 4)
			return;
			point.y--;
			break;
			case 3:
			if(this.k209 == 1 || this.k209 == 3)
			return;
			point.x++;	
			break;
			case 4:
			if(this.k209 == 2 || this.k209 == 4)
			return;
			point.y++;
			break;		
		}
		this.k209 = code - 36;
		this.process(point);
	}
	this.process = function(point){
		if (this.ifDie(point)) {
			alert("Game Over");
			this.manager.stopGame();
			return;
		}
		
		if (this.eatable(point)) {
			this.manager.removeE770(point);
			this.addE770(point);
			this.manager.addScore();
			this.productFood();
		}
		else {
			this.addE770(point);
			this.delTailE770();	
		}
		
		
	}
	this.ifDie = function(point){
		return this.nokia5230[point.x][point.y] == 1;
	}
	this.getHead = function(){
		return this.nokia6700[0];
	}
	
	this.getTail = function(){
		return this.nokia6700[this.nokia6700.length - 1];
	}
	this.eatable = function(head){
		return (head.x == this.targetX && head.y == this.targetY);
	}
	this.addE770 = function(point){
		this.nokia5230[point.x][point.y] = 1;
		this.nokia6700.unshift(point);
		this.manager.drawE770(point);
	}
	this.delTailE770 = function(){
		var point = this.nokia6700.pop();
		this.nokia5230[point.x][point.y] = 0;	
		this.manager.removeE770(point);
	}

	
	this.productFood = function(){		
		do {
			var x = Math.round(Math.random() * 100 % SIZE);
			var y = Math.round(Math.random() * 100 % SIZE);
		}
		while (this.nokia5230[x][y] == 1)
		this.targetX = x;
		this.targetY = y;
		this.manager.drawFood(x,y);
	}
}

 function Ga1900(canvasId){
 	var WIDTH = 20;
 	var canvas = document.getElementById(canvasId);
	var RED = "#FF0000"
	var WHITE = "#FFFFFF";
	var BLACK = "#000000";
	this.cxt = canvas.getContext("2d");
 	var e398 = new n97();
	this.moveHandle = null;
	this.gamePanel = document.getElementById("gamePanel");
	this.scoreLabel =  document.getElementById("score");
	this.maxScoreLabel =  document.getElementById("highestScore");
	this.step = 0;
	this.score = 0;
	this.maxScore = 0;
	if(localStorage.maxScore)  
	this.maxScore = localStorage.maxScore;
		
	this.maxScoreLabel.innerHTML = this.maxScore;	
	e398.setObserver(this);
	
 	this.startGame = function(step){
		this.clear();
 		e398.init();
		this.score = 0;	
		this.scoreLabel.innerHTML = this.score; 
		this.gamePanel.onkeydown = onKeyDown;
		this.step = parseInt(step);
 		this.moveHandle = setInterval(move, 500 - 50 * this.step);
 	}
	var move = function(){
		e398.move();
	}
	this.stopGame = function(){
		this.pause();
		document.getElementById("control").disabled = true;
		localStorage.maxScore = this.maxScore; 
		//alert(localStorage.maxScore);
	}
	this.pause = function(){
		clearInterval(this.moveHandle);
		this.gamePanel.onkeydown = null;
	}
	this.goon = function(){
		this.gamePanel.onkeydown = onKeyDown;
		this.moveHandle = setInterval(move, 500 - 50 * this.step);
	}
	this.addScore = function(){
		this.score += this.step;
		this.scoreLabel.innerHTML = this.score; 
		if(this.score > this.maxScore){
			this.maxScore = this.score;
			this.maxScoreLabel.innerHTML = this.score;
		}
	}
	var onKeyDown = function(e){
		if (e.which < 37 || e.which > 40) 
			return;
		e398.turn(e.which);
	}
		this.removeFood = function(x,y){
		this.cxt.fillStyle = WHITE;
		this.cxt.fillRect((x - 1)*WIDTH, (y - 1)*WIDTH, WIDTH, WIDTH);
	}
	this.drawFood = function(x,y){
		this.cxt.fillStyle = RED;
		this.cxt.fillRect((x - 1)*WIDTH, (y - 1)*WIDTH, WIDTH, WIDTH);
	}
	this.drawE770 = function(point){
		this.cxt.fillStyle = BLACK;
		this.cxt.fillRect((point.x-1) * WIDTH, (point.y-1) * WIDTH, WIDTH, WIDTH);	
	}
	this.removeE770 = function(point){
		this.cxt.fillStyle = WHITE;
		this.cxt.fillRect((point.x-1) * WIDTH, (point.y-1) * WIDTH, WIDTH, WIDTH);	
	}
	this.clear = function(){
		this.cxt.fillStyle = WHITE;
		this.cxt.fillRect(0,0,20*WIDTH,20*WIDTH);
	}
 }	





