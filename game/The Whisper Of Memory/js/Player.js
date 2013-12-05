function Player(cfg) {
	merger(this, cfg);

}

Player.prototype = {

	constructor: Player,

	x : 400 ,
	y :3000 ,
	vx : 0,
	vy : 0,
	ax : 0,
	ay : 0.0007,

	maxSpeed : 0.8 ,
	jumpSpeed : 0,
	jumpRotation : 0,

	defaultVX : 0.3,
	defaultVY : -0.7,

	radius : 24 ,

	debug : false ,

	minX : 0 ,
	maxX : Infinity ,
	maxVX : 0.5 ,
	maxY : Infinity ,

	baseX : 32,
	baseY : 63 ,

	keys : 0 ,

	init: function(scene) {
		this.scene = scene;
		this.radiusSq=this.radius*this.radius;
		this.jumping=true;


		this.aabb=[];


		this.anims ={
			"stand-left" : new Animation({
					img : ResPool.get("sprite") ,
					frames : [
						{x : 0, y : 64, w : 64, h : 64, duration : 100}
					]
				} ),
				
			"stand-right" : new Animation({
					img :  ResPool.get("sprite") ,
					frames : [
						{x : 0, y : 0, w : 64, h : 64, duration : 100}
					]
				} )	,
			"walk-left" : new Animation({
					img :  ResPool.get("sprite") ,
					frames : [
						{x : 0, y : 64, w : 64, h : 64, duration : 100},
						{x : 64, y : 64, w : 64, h : 64, duration : 100},
						{x : 128, y : 64, w : 64, h : 64, duration : 100}
					]
				} ),
				
			"walk-right" : new Animation({
					img :  ResPool.get("sprite") ,
					frames : [
						{x : 0, y : 0, w : 64, h : 64, duration : 100},
						{x : 64, y : 0, w : 64, h : 64, duration : 100},
						{x : 128, y : 0, w : 64, h : 64, duration : 100}
					]
				} )	
		}

		this.currentAnim=this.anims["stand-right"];
		
	},




	jumpByKey : function(){
		this.lastClockHand=this.clockHand;
		this.lastClock=this.clockHand?this.clockHand.parent:null;
		this.jumping=true;
		this.hanging=false;
	},

	jump : function(toX, toY , power){

		if (this.debug){
			this.x=toX;
			this.y=toY;
			return;
		}

		if (this.jumping){
			return;
		}

		this.jumping=true;
		this.hanging=false;
		this.lastClockHand=this.clockHand;
		this.lastClock=this.clockHand?this.clockHand.parent:null;

		if (arguments.length<3){
			return;
		}
	
		this.speed=this.maxSpeed* this.scene.power/this.scene.maxPower;

		this.speed=Math.min(this.speed , this.maxSpeed);

		var dx=toX-this.x,
			dy=toY-this.y;

		var rotation=Math.atan2(-dy,-dx);
		this.vx=this.speed*Math.cos(rotation);
		this.vy=this.speed*Math.sin(rotation);


	},

	updateAABB : function(){

		this.aabb[0]=this.x-this.radius;
		this.aabb[1]=this.y-this.radius;
		this.aabb[2]=this.x+this.radius;
		this.aabb[3]=this.y+this.radius+5;
	},

	update: function(deltaTime) {

		if (this.vx>0){
			this.currentAnim=this.anims["walk-right"];
		}else if (this.vx<0){
			this.currentAnim=this.anims["walk-left"];
		}else if (this.vx!=this.lastVX){
			this.currentAnim=this.anims[this.lastVX<0?"stand-left":"stand-right"];
		}

		this.currentAnim.update(deltaTime);

		if (this.scene.game.cheat){
			this.updateAABB();
			return
		}


		if (this.debug){
			return;
		}

		this.lastHanging=this.hanging;

		if (this.hanging){

		}else{

			this.lastX=this.x;
			this.lastY=this.y;

			this.lastVX = this.vx;
			this.lastVY = this.vy;

			this.vx = this.vx + this.ax * deltaTime;
			this.vy = this.vy + this.ay * deltaTime;

			if (this.vx>this.maxVX){
				this.vx=this.maxVX;
			}else if(this.vx<-this.maxVX){
				this.vx=-this.maxVX;
			}

			this.dx = (this.lastVX + this.vx) * deltaTime / 2 ;
			this.dy = (this.lastVY + this.vy) * deltaTime / 2 ;

			var nx = this.x + this.dx;
			var ny = this.y + this.dy;

			this.x=nx;
			this.y=ny;

			this.y=Math.min(this.y, this.maxY);
			if (this.y>=this.maxY){
				this.dead();
			}			
		}

		this.x=Math.min( this.maxX ,Math.max( this.minX ,this.x ) );

		this.updateAABB();
	},
	dead : function(){
		this.scene.game.gameover();

	},

	land : function(){
		this.vx=0;
		this.vy=0;
		this.jumping=false;
		this.hanging=false;
	},


	
	hang : function(x,y, clockHand){
		this.x=x;
		this.y=y;
		this.vx=0;
		this.vy=0;
		this.jumping=false;
		this.hanging=true;
		this.clockHand=clockHand;
		this.clock=clockHand.parent;
		if (this.scene.beating>0 && !this.lastHanging){
			console.log("beat");
		}
	},

	render: function(context, deltaTime) {

		context.save();
		// context.strokeRect(this.aabb[0],this.aabb[1],this.aabb[2]-this.aabb[0],
		// 		this.aabb[3]-this.aabb[1])
		context.translate(this.x, this.y);
		// drawCircle(context, [0,0], this.radius, "blue");

		var f=this.currentAnim.currentFrame;
		context.drawImage(this.currentAnim.img,f.x,f.y,f.w,f.h, -this.baseX,-this.baseY+this.radius,f.w,f.h);

		context.restore();
		
	}

};