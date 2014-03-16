var Config = {
	FPS: 60,
	// timeStep : 16 ,
	width: 960,
	height: 600

};

var game = new Game({

	width: Config.width,
	height: Config.height,
	FPS: Config.FPS,
	container: "container",
	uiPool : 'ui-pool',
	resList: [{
		id: "sprite",
		src: "./res/sprite.png"
	}, {
		id: "tileset",
		src: "./res/tileset.png"
	}, 
	{ id: "bg", src: "./res/bg.png" },
	{ id: "clock1", src: "./res/clock1.png" },
	{ id: "clock2", src: "./res/clock2.png" },
	{ id: "clock3", src: "./res/clock3.png" },

	{ id: "clock1-min", src: "./res/clock1-min.png" },
	{ id: "clock2-min", src: "./res/clock2-min.png" },
	{ id: "clock3-min", src: "./res/clock3-min.png" },

	{ id: "clock1-hou", src: "./res/clock1-hou.png" },
	{ id: "clock2-hou", src: "./res/clock2-hou.png" },
	{ id: "clock3-hou", src: "./res/clock3-hou.png" },

	{ id: "cloud1", src: "./res/cloud1.png" },
	{ id: "cloud2", src: "./res/cloud2.png" },
	{ id: "cloud3", src: "./res/cloud3.png" },
	{ id: "top-cloud1", src: "./res/top-cloud1.png" },
	{ id: "top-cloud2", src: "./res/top-cloud2.png" },

	{
		id: "bgm0",
		type: "audio",
		src: "./res/bgm1.mp3"
	},
	{
		id: "bgm1",
		type: "audio",
		src: "./res/bgm1.mp3"
	}, {
		id: "bgm2",
		type: "audio",
		src: "./res/bgm2.mp3"
	}],
	onInit: function() {
		console.log("onInit");
	},
	beforeLoad: function() {
		$id("loading").style.display = "block";
	},

	onLoading: function(loadedCount, totalCount, res) {
		var p = Math.round(loadedCount / totalCount * 100);
		var bar = $id("loading-bar");

		var barWidth = bar.parentNode.offsetWidth;
		$id("loading-bar").style.clip = "rect(0px," + p * barWidth / 100 + "px,42px,0px)";

		// bar.style.width=p+"%";
		return 80;
	},

	onLoad: function(loadedCount, totalCount) {
		var Me = this;
		setTimeout(function() {
			$id("loading").style.display = "none";
			Me.ready();
		}, 1500);
	},
	initEvent: function() {
		var Me = this;

		var viewportPos = Me.viewport.getBoundingClientRect();

		this.supportTouch = "ontouchstart" in document;
		var touchDown = false;

		var downEvent = "mousedown",
			upEvent = "mouseup",
			moveEvent = "mousemove";

		if (this.supportTouch) {
			downEvent = "touchstart";
			upEvent = "touchend";
			moveEvent = "touchmove";
		}
		document.addEventListener(downEvent, function(event) {
			touchDown = true;
			var x = event.pageX,
				y = event.pageY;
			var dx = x - viewportPos.left,
				dy = y - viewportPos.top;
			if (Me.currentScene) {

				Me.currentScene.touchDown(dx, dy);
			}
		});

		document.addEventListener(moveEvent, function(event) {
			if (touchDown) {
				var x = event.pageX,
					y = event.pageY;
				var dx = x - viewportPos.left,
					dy = y - viewportPos.top;
				if (Me.currentScene) {
					Me.currentScene.touchMove(dx, dy);
				}
			}
			event.preventDefault();

		});

		document.addEventListener(upEvent, function(event) {
			touchDown = false;
			var x = event.pageX,
				y = event.pageY;
			var dx = x - viewportPos.left,
				dy = y - viewportPos.top;
			if (Me.currentScene) {
				Me.currentScene.touchUp(dx, dy);
			}
		});

		document.addEventListener("keydown", function(event) {
			KeyState[event.keyCode] = true;
		}, true);

		document.addEventListener("keyup", function(event) {
			var restart = KeyState[Key.R];
			if (restart){
				game.restart();
			}
			KeyState[event.keyCode] = false;
		}, true);


		window.addEventListener("blur", function(event) {
			Me.pause();
		});
		window.addEventListener("focus", function(event) {
			Me.resume();
		});

	},

	onInit: function() {
		console.log("onInit")
	},
	onReady: function() {
		this.mainmenu();
		// this.sceneIndex=0;
			// this.restart();	
	},
	onPause: function() {
		if (this.currentScene && this.currentScene.bgm) {
			this.currentScene.bgm.pause();
		}
	},

	gameover: function() {
		if (this.currentScene.bgm) {
			this.currentScene.bgm.pause();
			this.currentScene.bgm.currentTime=0;
		}
		this._playing = false;
		this.showUI("gameover");
		this.hideUI("time-bar");
		this.hideUI("keys-bar");

		setTimeout(function() {

			$id("gameover").style.opacity = 1;
		})
	},

	about : function(){

		alert("For ShangHai 2nd GameJam, 2012,Aug\n\n Author : fins , Leon");

	},
	start : function(){
		clearInterval(this.mainmenuInterval);
		this.bgm0.pause();
		this.bgm0.currentTime=0;
		this.canvas.style.opacity=0;
		$id("mainmenu").style.opacity=0;
		var Me=this;
		setTimeout(function(){
			Me.sceneIndex=0;
			Me.restart();		
		},2000)
	},
	mainmenu: function() {
		this.bgm0=ResPool.get("bgm0");
		this.mainLeaf=new Leaf2({
			count : 20,
			color : "rgba(200,200,200,0.3)",
			x : 0 ,
			y : 0 ,
			maxSize : 3,
			width : this.viewWidth,
			height : this.viewHeight
		});
		this.mainLeaf.init(this)
		this.bgm0.loop=true;
		this.bgm0.play();
		this.canvas.style.opacity = 1;
		this.context.fillStyle="#000";
		this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
		this.startMainmenuAnimation();
		this.showUI("mainmenu");
	},
	startMainmenuAnimation : function(){
		var leaf=this.mainLeaf;
		this.mainmenuInterval=setInterval(function(){

			var deltaTime=15;
			leaf.update(deltaTime);
			game.context.fillStyle="rgba(0,0,0,0.1)";
			game.context.fillRect(0,0,game.viewWidth, game.viewHeight);
			leaf.render(game.context,deltaTime);
		},40)

		


	},

	onResume: function() {
		if (this.currentScene && this.currentScene.bgm) {
			this.currentScene.bgm.play();
		}
	},

	getSceneInstance: function(idx) {

		var scene = new Scene({
			clocks: [

			]
		});
		return scene;
	}
});
window.onload = function() {

	game.init();
	game.load();

}