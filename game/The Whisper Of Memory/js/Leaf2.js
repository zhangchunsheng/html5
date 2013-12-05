
function Leaf2(cfg){
	merger(this, cfg);
}

Leaf2.prototype={
	
	constructor : Leaf2 ,

	count : 15 ,
	x : 0,
	y : 0 ,
	width : 0 ,
	height : 0 ,
	color : "#887766",
	maxSize : 8,
	init : function(){

		this.leaves=[];

		for (var i=0;i<this.count;i++){
			var leaf={
				ax : 0 ,
				ay : 0 //0.001*([-1,1])[getRandom(0,1)]
			}
			this.resetLeafPos(leaf);
			this.leaves.push(leaf);
		}
	},
	resetLeafPos : function(leaf){
		leaf.x=getRandom( this.x+this.width, (this.x+this.width)*2 );
		leaf.y=getRandom( this.y , this.y+this.height );
		leaf.vx = -0.5 * getRandom(5,10)/10 ;
		leaf.vy = 0.1* getRandom(5,10)/10*([-1,1])[getRandom(0,1)] ;			
		leaf.size=getRandom(this.maxSize/2,this.maxSize);	
	},
	update : function(deltaTime){
		var Me=this;
		this.leaves.forEach(function(leaf){
			leaf.lastVX = leaf.vx;
			leaf.lastVY = leaf.vy;

			leaf.vx = leaf.vx + leaf.ax * deltaTime;

			leaf.vy = leaf.vy + leaf.ay * deltaTime;

			leaf.dx = (leaf.lastVX + leaf.vx) * deltaTime / 2;
			leaf.dy = (leaf.lastVY + leaf.vy) * deltaTime / 2;

			leaf.x = leaf.x + leaf.dx;
			leaf.y = leaf.y + leaf.dy;
			if (leaf.x<Me.x){
				Me.resetLeafPos(leaf);
			}

			if (leaf.y>Me.height){
				leaf.vy=-leaf.vy;
			}else if (leaf.y<Me.y){
				leaf.vy=-leaf.vy;
			}

		})
	},

	render : function(context){
		context.fillStyle=this.color;
		this.leaves.forEach(function(leaf){
			context.fillRect( leaf.x, leaf.y ,leaf.size*50,leaf.size);
		});
	}
}

