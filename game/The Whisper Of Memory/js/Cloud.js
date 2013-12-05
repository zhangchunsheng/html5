

function Cloud(cfg) {

	merger(this,cfg);

}

Cloud.prototype = {

	constructor: Cloud,

	x : 0,
	vx : -0.1,
	y : 0,
	width : 0,
	height : 0,
	img : null ,
	alpha : 1 ,

	init : function(scene){
		this.scene=scene;
		this.img=ResPool.get( ["top-cloud1","top-cloud2"][getRandom(0,1)]);//||this.img;
		this.width=this.img.width;
		this.height=this.img.height;
		this.aabb=[];
	},

	update : function(deltaTime){

		this.x=this.x+this.vx*deltaTime;
		this.aabb[0]=this.x;
		this.aabb[1]=this.y;
		this.aabb[2]=this.x+this.width;
		this.aabb[3]=this.y+this.height;

		this.inView= this.aabb[0]<this.scene.x+this.scene.viewWidth
					&& this.aabb[1]<this.scene.y+this.scene.viewHeight
					&& this.aabb[2]>this.scene.x
					&& this.aabb[3]>this.scene.y;
		if (this.aabb[2]<0){
			this.resetPos();
		}
	},

	resetPos : function(){
		this.img=ResPool.get( ["top-cloud1","top-cloud2"][getRandom(0,1)]);//||this.img;
		this.width=this.img.width;
		this.height=this.img.height;
		this.x=getRandom( this.scene.width,  this.scene.width+60 );
		this.y=getRandom( 100 , this.scene.height-200 );
		this.vx = - getRandom(1,2)/20 ;
		this.alpha = getRandom(8,10)/10;
	},
	render : function(context, deltaTime){
		if (!this.inView){
			return
		}
		context.globalAlpha=this.alpha;		
		context.drawImage(this.img, this.x, this.y);
		context.globalAlpha=1;		
	}


}
