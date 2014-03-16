
function TextBar(cfg){
	merger(this , cfg);

}

TextBar.prototype={

	constructor : TextBar ,

	id : 1 ,
	x : 1,
	y : 1 ,

	width : 20,
	height : 20,

	id : null,
	actived : false ,

	init : function(scene){
		this.scene=scene;
		this.dom=this.dom||$id(this.id);
		this.aabb=[]
	},

	update : function(deltaTime){
		
		this.x=this.parent.x-this.dom.offsetWidth/2,
		this.y=this.parent.y-this.parent.radius-this.dom.offsetHeight;

		var offset=4;
		this.aabb[0]=this.x-offset;
		this.aabb[1]=this.y-offset;
		this.aabb[2]=this.x+offset*2;
		this.aabb[3]=this.y+offset*2;

		this.inView = this.aabb[0]<this.scene.x+this.scene.viewWidth
				&& this.aabb[1]<this.scene.y+this.scene.viewHeight
				&& this.aabb[2]>this.scene.x
				&& this.aabb[3]>this.scene.y;

	},


	render : function(context, deltaTime){

		if (!this.actived){
			this.dom.style.visibility="hidden"
			return;
		}
		this.dom.style.visibility="visible";
		this.dom.style.opacity=1;
		translateDom(this.dom, this.x-this.scene.x, this.y-this.scene.y );

	}
}