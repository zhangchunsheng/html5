

;(function(scope, undefined){


var Timer = scope.Timer =function(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};

Timer.prototype= {

	constructor : Timer ,

	staticDeltaTime : 0 ,

	start : function(){
		this.reset();
		this.startTime=this.lastCurrent;
		if (this.staticDeltaTime){
			this.deltaTime=this.staticDeltaTime;
			this.tick=this._staticTick;
		}else{
			this.tick=this._tick;
		}
		return this;		
	},
	removeTask : function(idx){
		this.queue.splice(idx, 1);
	},
	addTask : function(fn,timeout){
		var now=Date.now();
		this.queue.push({
			time : now,
			runTime : now+timeout,
			fn : fn
		});
		return this.queue.length-1;
	},

	runTasks : function(){
		var now=Date.now();
		for (var i=0,len=this.queue.length;i<len;i++){
			var q=this.queue[i];
			if (now>=q.runTime){
				var fn=q.fn;
				fn();
				this.removeTask(i);
				i--;
				len--;
				//fn();
			}
		}
	},

	reset : function(){
		this.duration=0;
		this.queue=[];
		this.lastTime=this.currentTime = Date.now();	
	},

	getDeltaTime : function() {
		return this.deltaTime;
	},
	current : function(){
		return this.currentTime;
	},
	
	tick : null ,

	_staticTick : function(){
		this.currentTime=this.lastTime+this.staticDeltaTime;
		this.lastTime = this.currentTime;
		this.duration+=this.staticDeltaTime;
		return currentTick;
	},
	_tick : function() {
		this.lastTime = this.currentTime;
		this.currentTime=Date.now();
		this.deltaTime = this.currentTime - this.lastTime;
		this.duration+=this.deltaTime;
		return this.currentTime;
	}
};

}(this));

