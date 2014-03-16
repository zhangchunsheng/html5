
function Gate(cfg){
	merger(this , cfg);

}

Gate.prototype={

	constructor : Gate ,


	x : 1,
	y : 1 ,

	width : 20,
	height : 20,
	init : function(scene){
		this.img=ResPool.get("sprite");
		this.scene=scene;
		this.width=64;//this.img.width;
		this.height=64;//this.img.height;
		this.aabb=[
			this.x+15,
			this.y+15,
			this.x+this.width-15,
			this.y+this.height-15
		]
	},

	update : function(deltaTime){
		this.inView= this.aabb[0]-15<this.scene.x+this.scene.viewWidth
				&& this.aabb[1]-15<this.scene.y+this.scene.viewHeight
				&& this.aabb[2]+15>this.scene.x
				&& this.aabb[3]+15>this.scene.y;

	},

	collide : function(player){

		if (!this.scene.finished && checkAABBCollide(this.aabb,player.aabb)){
			this.scene.finish();
			return true;
		}
		return false;

	},

	render : function(context, deltaTime){

				// context.strokeRect(this.aabb[0],this.aabb[1],this.aabb[2]-this.aabb[0],
				// this.aabb[3]-this.aabb[1])
		if (!this.inView){
			return;
		}
		context.drawImage(this.img,64,128,64,64, this.x,this.y,64,64)

	}

}



