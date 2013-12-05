
;(function(scope,undefined){
	

var Game=scope.Game=function(cfg){
	scope.merger(this,cfg);
}

Game.prototype={
	constructor : Game,

	container : null ,
	viewport : null ,
	canvas : null ,
	context : null,

	width : 640,
	height : 480,
	viewWidth : null,
	viewHeight : null,
	
	FPS : 60 ,
	timer : null ,
	resList : null,

	uiPool : null ,
	
	state : null ,
	sceneIndex : 0 ,
	currentScene : null,

	loader : null ,

	beforeLoad : scope.noop ,	


	load : function(force){
		
		if (this.beforeLoad(force)===false){
			return false;
		}	
		var resList=this.resList?[].concat(this.resList):[];
		
		this.loader=new scope.ResLoader();

		if (this.loader!=null){
			var Me=this;
			var resCache=this.loader.load(resList, 
				function(){
					return Me._onLoad.apply(Me,arguments);
				}, 
				function(){
					return Me._onLoading.apply(Me,arguments);
				}
				);
			for (var id in resCache){

				scope.ResPool.add(id, resCache[id]);
			}
		}
	},
	_onLoading : function(loadedCount,totalCount,res){
		return this.onLoading(loadedCount,totalCount,res);
	},
	_onLoad : function(loadedCount,totalCount){

		this.onLoad=this.onLoad||this.ready;
		return this.onLoad(loadedCount,totalCount);
	},
	onLoading : scope.noop,
	onLoad : null,

	initBaseUI : function(){

		this.initContainer();
		this.initMask();

		this.viewWidth=this.viewWidth||this.width;
		this.viewHeight=this.viewHeight||this.height;
	
		this.uiPool=scope.$id(this.uiPool)||document.body;
		if ( this.uiPool!=document.body ){
			this.uiPool.style.display="none";
		}

	},

	initContainer : function(){
		this.container=scope.$id(this.container)||this.container;
		if (!this.container){
			this.container=document.createElement("div");
			document.body.appendChild(this.container);
		}		
		var domStyle=this.container.style;
		scope.merger(domStyle,{
			position : "relative" ,
			overflow : "hidden" ,		
			padding : "0px" ,
			width : this.width+"px" ,
			height : this.height+"px"
		});	


	},
	initMask : function(){
		
		this.mask=document.createElement("div");
		this.container.appendChild(this.mask);
		scope.merger(this.mask.style,{
			position : "absolute" ,
			overflow : "hidden" ,	
			zIndex : 30000 ,
			padding : "0px" ,
			top : "0px",
			left : "0px",
			display : "none",
			//backgroundColor : "rgba(100,100,100,0.5)",
			width : this.width+"px" ,
			height : this.height+"px"
		});	
		try {
			this.mask.style.backgroundColor="rgba(100,100,100,0.5)";
		}catch(e){
			this.mask.style.backgroundColor="#999999";
		}
	},

	initViewport : function(){
		
		if (!this.viewport){
			this.viewport=document.createElement("div");
			this.container.appendChild(this.viewport);		
		}
		var domStyle=this.viewport.style;
		scope.merger(domStyle,{
			position : "absolute" ,
			left : "0px",
			top : "0px",
			overflow : "hidden" ,	
			padding : "0px" ,
			width : this.viewWidth+"px" ,
			height : this.viewHeight+"px" ,
			//backgroundColor : "#fff",
			visibility : "hidden" 
		});

		this.viewport.style.visibility="visible";			
	
	},

	initCanvas : function(){
	
		this.canvas=document.createElement("canvas");

		var domStyle=this.canvas.style;
		scope.merger(domStyle,{
			position : "absolute" ,
			left : "0px",
			top : "0px",
			zIndex : 11
		});

		this.canvas.width=this.viewWidth;
		this.canvas.height=this.viewHeight;
		this.context=this.canvas.getContext('2d');
		this.viewport.appendChild(this.canvas);

		this.context.webkitImageSmoothingEnabled=true;

	},
	
	initUI : function(){
		
	},

	bindUIEvent : function(){
		
	},
	
	showUI : function(id){
		var ui=scope.$id(id);
		this.container.appendChild(ui);
	},
	hideUI : function(id){
		var ui=scope.$id(id);
		this.uiPool.appendChild(ui);
	},


	beforeInit : scope.noop ,	


	init : function(){
		
		this.initBaseUI();
		this.initUI();
		this.bindUIEvent();

		if (this.beforeInit()===false){
			return false;
		}
					
		if (this.FPS){
			this._sleep=Math.floor(1000/this.FPS);
		}	

		this.scenes=[];

		var Me=this;
		this.callRun = function(){
			Me.run();
		}

		this.onInit();
	},

	ready : function(){
		
		this.pos=this.container.getBoundingClientRect();

		this.initViewport();
		this.initCanvas();	
		this.initEvent();

		this.timer=new scope.Timer(this.timer);

		this.onReady();
	},
	onReady : scope.noop,

	onInit : scope.noop ,
	initEvent : scope.noop ,

	start : function(){
		this.sceneIndex=0;
		this.restart();		
	},
	restart : function(){	
		this.stop();
		this.sceneIndex=this.sceneIndex||0;
		this.createScene(this.sceneIndex);
		this.activeScene(this.sceneIndex);
		this.play();		
	},	
	activeScene : function(idx){
		this.sceneIndex=idx;
		this.currentScene=this.scenes[idx];
		this.currentScene.init(this);
	
	},	
	createScene : function(idx){
		var scene=this.getSceneInstance(idx);
		scene.index=idx;
		this.scenes[idx]=scene;
		return scene;
	},
	getSceneInstance : scope.noop ,	

	
	play : function(){
		if (!this.currentScene){
			return false;
		}
		if (this.currentScene.beforeRun){
			this.currentScene.beforeRun(this);
		}	
		this._playing=true;		
		this.timer.start();
		this.run();
	},
	pause : function(){
		this.paused=1;
		this.onPause();
	},
	onPause : scope.noop,

	resume : function(){
		this.paused=0;
		this.onResume();
	},
	onResume : scope.noop,
	
	exit : scope._TODO_,
	gameover : scope._TODO_,
	finished : scope._TODO_,

	
	
	run : function(){
		if (this._playing) {
			this.frameCount++;

			this.mainLoop=setTimeout( this.callRun, this._sleep );
			this.timer.tick();
			var deltaTime=this.timer.deltaTime;
			if (this.paused){
				this.onPausing(deltaTime);
			}else if ( deltaTime>1 ){
				this.timer.runTasks();
				this.update(deltaTime);
				this.clear(deltaTime);
				this.render(deltaTime);
			}
			this.handleInput(deltaTime);

			this.timer.last=this.timer.now;

		}else{
			this.stop();
		}

	},
	onPausing : scope.noop,
	
	
	beforeUpdate : scope.noop ,
	update : function(deltaTime){
		this.currentScene.update(deltaTime);
		if (this.currentScene.handleInput){
			this.currentScene.handleInput(deltaTime);
		}
		this.onUpdate(deltaTime);
	},
	onUpdate : scope.noop ,	
	
	clear : scope.noop ,

	render : function(deltaTime){
		this.currentScene.render(this.context,deltaTime);
	},

	handleInput :  scope.noop ,
	
	stop : function(){
		this._playing=false;
		this.paused=0;
		if (this.mainLoop){
			clearTimeout(this.mainLoop);
		}
		if (this.currentScene){
			if (this.currentScene.destroy){
				this.currentScene.destroy(this);
			}
			this.scenes[this.sceneIndex]=null;
			this.currentScene=null;
		}		
		this.onStop();
	},
	onStop : scope.noop ,
	
	destroy : scope.noop
	
};


})(this);
