
function Block(cfg){
	merger(this , cfg);

}

Block.prototype={

	constructor : Block ,

	id : 1 ,
	x : 1,
	y : 1 ,

	width : 20,
	height : 20,
	init : function(scene){
		this.img=ResPool.get("tileset");
		this.scene=scene;
		this.aabb=[
			this.x,
			this.y,
			this.x+this.width,
			this.y+this.height
		]
	},

	update : function(deltaTime){
		this.inView= this.aabb[0]<this.scene.x+this.scene.viewWidth
				&& this.aabb[1]<this.scene.y+this.scene.viewHeight
				&& this.aabb[2]>this.scene.x
				&& this.aabb[3]>this.scene.y;

	},

	collide : function(player){

		if (checkAABBCollide(this.aabb,player.aabb)){

			if (player.lastY+player.radius<=this.y){
				player.y=this.y-player.radius;
				player.land();
			}
	
			// if (player.lastY<=this.y && player.y>=this.y && player.vy>0 ){
				
			// }else{
				// console.log(123)
			// }

			return true;
		}
		return false;

	},

	render : function(context, deltaTime){

		if (!this.inView){
			return;
		}
		var w=this.width/64;
		for (var i=0;i<w;i++){
		context.drawImage(this.img,128,0,64,64, this.x+i*64,this.y,64,64)
			
		}

	}

}



