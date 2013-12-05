function Scene(cfg) {
	merger(this, cfg);

}

Scene.prototype = {

	constructor: Scene,

	clocks: null,

	power: 0,
	maxPower: 200,

	rotation: 0,
	scale: 1,
	time: null,
	timeout: 0,

	width : 64*56 ,
	height : 64*100, 

	useTouch: false,
	useMouse: false,

	minX : 0,
	minY : 0,
	maxX : Infinity ,
	maxY : Infinity ,


	init: function(game) {
		this.game = game;
		game.context.font="normal 14px pix-en";
		game.context.textBaseline="bottom"; //"top";
		game.context.textAlign="center";
		this.useTouch = game.supportTouch || this.useMouse;
		this.viewWidth = game.viewWidth;
		this.viewHeight = game.viewHeight;

		this.img=ResPool.get("tileset");
		this.bgImg=ResPool.get("bg");
		//TEST 
		this.player = new Player({
			radius : 24 ,
			x : this.width/2,
			y: this.height -64*6-0.5-24-50,
			minX: 64*4+24,
			maxX: this.width-64*4-24,
			maxY: this.height+100,
		});
		this.player.init(this);

		this.x=(this.width-this.viewWidth)/2;
		this.initClocks();
		this.initBlocks();

		this.clouds=createClouds(this);

		this.beats=[];

		this.gate=new Gate({
			x : 1620,
			y : 256-64
		})
		this.gate.init(this);

		this.water=new Water({
			distance : 40 ,
			x : 0 ,
			width : this.width,
			height : 350

		});
		this.water.y=this.height-this.water.height;
		this.water.init(this);

		this.leaf=new Leaf({
			x : 0 ,
			y : 0 ,
			width : this.viewWidth,
			height : this.viewHeight
		});
		this.leaf.init();

	},
	initClocks: function() {
		this.clocks = createClocks(this.width, this.height);
		// this.finalClock = createFinalClock(this.width, this.height);
		// this.clocks.push(this.finalClock)
		var Me = this;
		this.clocks.forEach(function(clock) {
			clock.init(Me);
		})

	},


	initBlocks: function() {
		this.blocks = createBlocks(this.width, this.height);
		// this.blocks.push(this.finalClock)
		var Me = this;
		this.blocks.forEach(function(block) {
			block.init(Me);
		})

	},

	beforeRun: function(){
		this.finished=false;
		this.game.canvas.style.opacity=1;
		if (this.bgm){
			this.bgm.pause();
			this.bgm.currentTime=0;
		}
		this.bgm= ResPool.get("bgm1");
		if (this.bgm){
			var Me=this;
			Me.bgm.addEventListener("ended",function(event){
				Me.bgm.pause();
				Me.bgm.currentTime=0;
				Me.bgm=ResPool.get("bgm2");
				Me.bgm.addEventListener("ended",function(){
					Me.beats=getBeats();
					Me.bgm.play();
				});
				Me.beats=getBeats();
				Me.bgm.play();
			})
			Me.bgm.play();
		}
		this.playCurrent=0;
		this.game.showUI("time-bar");
		this.game.showUI("keys-bar");

		this.game.hideUI("mainmenu");
		this.game.hideUI("gameover");
		this.game.hideUI("finish");
		$id("gameover").style.opacity=0;
		$id("finish").style.opacity=0;

		this.timeDisplay = $q("#time-bar span");
		this.timeDisplay.innerHTML = 0;
		this.keysDisplay = $q("#keys-bar span");
		this.keysDisplay.innerHTML = 0;

				// this.game.showUI("gameover");


		var cidx=[]
		for (var i=0;i<this.clocks.length;i++){
			cidx.push(i);
		}
		arrayShuffle(cidx);

		var texts=$qs(".text-bar");
		
		this.keyCount=texts.length;

		var len=Math.min(this.clocks.length , texts.length);
		for (var i=0;i<len;i++){
			var dom=texts[i];
			var clock=this.clocks[cidx[i]];
			var text=new TextBar({
				dom : dom
			});
			clock.text=text;
			text.parent=clock
			text.init(this);
			this.game.container.appendChild(dom);
		}
	},
	

	beating : 0 ,
	onBeat : function(){
		var fix=this.game._sleep;
		var beat=this.beats[0];
		this.playCurrent=this.bgm? this.bgm.currentTime*1000:0;
		// console.log(this.playCurrent)
		if (beat){
			var d=beat-this.playCurrent;
			if ( Math.abs(d)<fix && this.beating<=0){
				this.beats.shift();
				this.beating=400;
				return true;
			}else if(d<=-fix){
				this.beats.shift();
			}
		}
		return false; 
	},

	finished : false ,
	finish : function(){
		this.finished=true;
		this.game.showUI("finish");
		setTimeout(function(){
			$id("finish").style.opacity=1;
		})
	},

	x: 0,
	y: 0,
	padding: {
		left: 300,
		right: 300,
		top: 300,
		bottom: 150,
	},


	moveCamera: function(deltaTime) {
		var l = this.player.x - this.x;
		var r = this.x + this.viewWidth - this.player.x;
		var t = this.player.y - this.y;
		var b = this.y + this.viewHeight - this.player.y;

		if (l < this.padding.left) {
			this.x = this.player.x - this.padding.left;
		} else if (r < this.padding.right) {
			this.x = this.player.x + this.padding.right - this.viewWidth;
		}

		if (t < this.padding.top) {
			this.y = this.player.y - this.padding.top;
		} else if (b < this.padding.bottom) {
			this.y = this.player.y + this.padding.bottom - this.viewHeight;
		}

		this.maxX=this.width-this.viewWidth;
		this.maxY=this.height-this.viewHeight;

		this.x=Math.min( this.maxX ,Math.max( this.minX ,this.x ) );
		this.y=Math.min( this.maxY ,Math.max( this.minY ,this.y ) );
	},

	update: function(deltaTime) {
		if (this.time === null) {
			this.time = 0;
		} else {
			this.time += deltaTime;
		}
		this.beating-=deltaTime;
		this.onBeat();

		deltaTime=Math.min(deltaTime,this.game._sleep*2);
		this.timeout-=deltaTime;

		this.player.update(deltaTime);
		

		this.viewWidth = this.game.viewWidth / this.scale;
		this.viewHeight = this.game.viewHeight / this.scale;

		this.moveCamera(deltaTime);

		this.clocks.forEach(function(clock) {
			clock.update(deltaTime);
		});
		this.gate.update(deltaTime);

		var coll=false;
		for (var i = 0; i < this.clocks.length; i++) {

			if (this.clocks[i].collide(this.player)) {
				coll=true;
				break;
			}
		}

		this.blocks.forEach(function(block) {
			block.update(deltaTime);
		});
		if (!coll){
			this.player.clock=null;
			for (var i = 0; i < this.blocks.length; i++) {

				if (this.blocks[i].collide(this.player)) {
					break;
				}
			}

			this.gate.collide(this.player);
		}

		


		this.leaf.update(deltaTime);
		if (this.water.y-100<this.y+this.viewHeight){
			this.water.update(deltaTime);
		}
		this.clouds.forEach(function(cloud) {
			cloud.update(deltaTime);
		});
		if (this.player.y+20>this.water.y){
			if (!this.player.inWater){
				this.player.inWater=true;
				this.water.fall(this.player.x,20);
			} 
		}else{
			this.player.inWater=false;

		}

		
	},

	render: function(context, deltaTime) {
		var bx=this.x;
		var by=this.y;
		var bw=this.game.viewWidth;
		var bh=this.game.viewHeight;
		context.drawImage(this.bgImg,
			bx,by,bw,bh,0, 0, this.game.viewWidth, this.game.viewHeight )
		// context.fillStyle="#ccddff";
		// context.fillRect(0, 0, this.game.viewWidth, this.game.viewHeight);
		context.save();

			
		if (this.scale !== 1) {
			// context.translate(this.player.x, this.player.y);
			var ox = this.player.x - this.x,
				oy = this.player.y - this.y;
			ox = this.game.viewWidth * (ox / this.viewWidth);
			oy = this.game.viewHeight * (oy / this.viewHeight);

			context.translate(ox, oy);
			context.scale(this.scale, this.scale);
			context.translate(-ox, -oy);
		}
		context.translate(-this.x, -this.y);
		this.clocks.forEach(function(clock) {
			clock.render(context, deltaTime);
		})
		
		this.renderGround(context);
		this.gate.render(context,deltaTime);
		this.player.render(context, deltaTime);
		this.renderClouds(context, deltaTime);




		this.renderPowerBar(context, deltaTime);

		context.restore();

		if (this.water.y-100<this.y+this.viewHeight){
				this.water.render( context, deltaTime);
		}

		this.leaf.render( context, deltaTime);


		// context.fillText("If you have a new Choice",200,200)
		if (this.finished){
			return;
		}
		this.timeDisplay.innerHTML = (this.time / 1000).toFixed(2);
		this.keysDisplay.innerHTML = this.player.keys+"/"+this.keyCount;
	},

	renderClouds : function(context, deltaTime){

		this.clouds.forEach(function(cloud) {
			cloud.render(context, deltaTime);
		});
	},

	renderPowerBar: function(context, deltaTime) {
		if (this.touched) {

			context.save();
			context.translate(this.player.x, this.player.y);

			var tx = this.touchX + this.x;
			var ty = this.touchY + this.y;
			var dx=tx - this.player.x;
			var dy=ty - this.player.y;
			var touchDownRotation = Math.atan2( -dy, -dx );
			context.rotate(touchDownRotation);
			context.strokeStyle = "yellow";
			context.fillStyle = "yellow";

			//Date.now() - this.touchDownTime;
			var power = this.power;
			power = Math.min(this.maxPower, power);

			context.fillRect(0, -10, power, 20);

			context.strokeRect(0, -10, this.maxPower, 20);

			context.restore();
		}
	},

	renderGround: function(context,deltaTime) {
		var offsetX=null;
		if (this.x<64*4){
			offsetX=0;
		}else if(this.x>=this.width-64*4){
			offsetX=this.width-64*4;
		}
		if (offsetX!==null){
			var offsetY=this.y-this.y%64
			for (var i=0;i<16;i++){
				context.drawImage(this.img,128,0,64,64, offsetX+0, offsetY+i*64,  64,64)
				context.drawImage(this.img,128,0,64,64, offsetX+64, offsetY+i*64,  64,64)
				context.drawImage(this.img,128,0,64,64, offsetX+128, offsetY+i*64,  64,64)
				context.drawImage(this.img,128,0,64,64, offsetX+192, offsetY+i*64,  64,64)
			}			
		}


		this.blocks.forEach(function(block) {
			block.render(context,deltaTime);
		});


	},

	touchDownTime: 0,
	touchDown: function(x, y) {

		if (!this.useTouch) {
			return;
		}

		if (this.player.jumping) {
			return;
		}
		this.touched = true;
		this.touchDownX = x;
		this.touchDownY = y;
		this.touchX = x;
		this.touchY = y;
		this.touchDownTime = Date.now();
	},
	touchMove: function(x, y) {
		if (this.touched) {
			this.touchX = x;
			this.touchY = y;
			var px = this.player.x - this.x;
			var py = this.player.y - this.y;
			this.power = Math.sqrt(Math.pow(px - x, 2) + Math.pow(py - y, 2))*1.25;

		}
	},

	touchUp: function(x, y) {
		if (this.game.cheat){
			this.player.x=x+this.x;
			this.player.y=y+this.y;
			return;
		}
		if (!this.touchDownTime || this.player.jumping) {
			return;
		}
		this.touched = false;
		// x=this.touchDownX;
		// y=this.touchDownY;
		this.touchUpX = x;
		this.touchUpY = y;
		// this.touchX = x;
		// this.touchY = y;
		// var power = Date.now() - this.touchDownTime;
		var power = this.power;
		var tx = this.touchX + this.x;
		var ty = this.touchY + this.y;
		this.player.jump(tx, ty, power);
		this.touchDownTime = 0;
	},
	cheat : false ,
	handleInput: function() {
		if (this.finished){

			return;
		}
		if (this.useTouch) {
			return;
		}

		var up = KeyState[Key.W];
		var down = KeyState[Key.S];
		var left = KeyState[Key.A];
		var right = KeyState[Key.D];
		var jump = KeyState[Key.J];
		var timeout = KeyState[Key.T];

		var cheat = KeyState[Key.I];
		var uncheat = KeyState[Key.O];

		if (cheat){
			this.game.cheat=true;
		}
		if (uncheat){
			this.game.cheat=false;
		}


		if (timeout) {
			this.timeout = 3000;
		}

		var speedY = 0,
			speedX = 0;
		if (jump || up) {
			if (this.canJump && !this.player.jumping) {
				speedY = this.player.defaultVY;
				if (this.beating>0 && this.player.clock){
					speedY-= this.beating/400/10;
				}

				this.player.vy = speedY;
				this.player.jump();
			}
			this.canJump = false;
		} else {
			this.canJump = true;
		}

		if (left && !right) {
			speedX = -this.player.defaultVX;
		} else if (right && !left) {
			speedX = this.player.defaultVX;
		} else {
			speedX = 0;
		}

		this.player.vx = speedX;

	}

};

function createFinalClock(w, h) {

	var x = w / 2,
		y = -220;
	var clock = {
		radius: 200,
		x: x,
		y: y,
		minuteSpeedR: -6 / 1000,
		minuteRotation: 0.1,
		hourSpeedR: -6 / 1000 / 60,
		hourRotation: 0.1
	}
	return new Clock(clock);
}


function createClocks(w, h) {

	var data=clocksData.slice(0);

	data.sort(function(a,b){
		return a.y-b.y;
	})
	var clocks=[];
	data.forEach(function(clockD,idx){
		var num;
		if (clockD.r<70){
			num="3";
		}else if (clockD.r<100){
			num="2";
		}else{
			num="1"
		}
		var clock = {
				img : "clock"+num,
				id : "c_"+idx,
				radius: clockD.r,
				x: clockD.cx,
				y: clockD.cy,
				minuteImg : "clock"+num+"-min",
				hourImg : "clock"+num+"-hou",
				minuteSpeedR: getRandom(5, 10) / 100,
				hourSpeedR: getRandom(3, 7) / 100,
				minuteRotation: getRandom(0, 359)
			}
			clocks.push(new Clock(clock));
	})
	return clocks;
}

function createClouds(scene){

	var clouds=[];

	for (var i=0; i<60 ;i++){alpha : 
		var cloud=new Cloud({
			img : "top-cloud",
			x :getRandom( 0,  scene.width ),
			y : getRandom( 100 , scene.height- 500 ),
			alpha : getRandom(5,9)/10,
			vx : - getRandom(1,2)/40 
		})
		cloud.init(scene)
		clouds.push(cloud)
	}
	return clouds;

}

function createBlocks(w,h){
	var data=blocksData.slice(0);

	data.sort(function(a,b){
		return a.y-b.y;
	})
	var blocks=[];
	data.forEach(function(blockD,idx){
		var block = {
				id : "b_"+idx,
				x: blockD.x,
				y: blockD.y,
				width: blockD.w,
				height: blockD.h
			}
			blocks.push(new Block(block));
	})
	return blocks;
}

function getBeats(){
	return [50,890,1575,2309,2971,3729,4478,5244,5954,6680,7438,8114,8889,9614,10300,11832,13087,14562,16094,17573,19097,20492,21947,23319,24574,26016,27500,28996,29709,30395,31160,31907,33330]
}