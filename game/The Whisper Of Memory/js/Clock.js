
function Clock(cfg){
	merger(this , cfg);

}

Clock.prototype={

	constructor : Clock ,

	radius : 120 ,
	x : 200,
	y : 200 ,

	img : null,
	hour : null ,
	minute : null ,

	minuteSpeedR : 0,
	hourSpeedR : 0 ,
	minuteRotation : 0,
	hourRotation : 0 ,

	text : null ,


	init : function(scene){

		this.img=ResPool.get(this.img)||this.img;
		this.width=this.img.width;
		this.height=this.img.height;

		this.scene=scene;

		this.originX=this.x;
		this.originY=this.y;

		this.radiusSq=this.radius*this.radius;

		this.minute=new ClockHand({
			img : this.minuteImg,
			rotation : this.minuteRotation || -90 ,
			radius : this.radius*0.9 ,
			speedR : this.minuteSpeedR || 0.03,
			parent : this
		});

		this.endRad=null;
		this.disabled=false;

		this.hour=new ClockHand({
			img : this.hourImg,
			rotation : this.hourRotation || this.minuteRotation+90 ,
			radius : this.radius*0.75 ,
			speedR : this.hourSpeedR || this.minute.speedR/3,
			parent : this ,
			color : "#cc33ff"
		});
		this.aabb=[];
		this.setPos(this.x,this.y);

	},
	setHandsInfo : function(){
		// TODO
	},

	setPos : function(x,y){
		this.x=x;
		this.y=y;
		this.hour.x=x;
		this.hour.y=y;
		this.minute.x=x;
		this.minute.y=y;

		this.aabb[0]=this.x-this.radius-5;
		this.aabb[1]=this.y-this.radius-5;
		this.aabb[2]=this.x+this.radius+5;
		this.aabb[3]=this.y+this.radius+5;

	},


	update : function(deltaTime){

		this.timeout=this.scene.timeout;

		this.inView= this.aabb[0]<this.scene.x+this.scene.viewWidth
					&& this.aabb[1]<this.scene.y+this.scene.viewHeight
					&& this.aabb[2]>this.scene.x
					&& this.aabb[3]>this.scene.y;

		// if (!this.inView ){
		// 	var left=this.scene.x%this.scene.width ;
		// 	var leftCount=Math.floor(this.scene.x/this.scene.width);

		// 	var right=(this.scene.x+this.scene.viewWidth)%this.scene.width ;
		// 	var rightCount=Math.floor((this.scene.x+this.scene.viewWidth)/this.scene.width);
		// 	if (left<0 ){
		// 		this.setPos( this.originX+leftCount*this.scene.width , this.y)
		// 	}else if (right>0 ){ 
		// 		this.setPos( this.originX+rightCount*this.scene.width , this.y)
		// 	}

		// }

		this.hour.update(deltaTime);
		this.minute.update(deltaTime);
		if (this.text && this.text.actived){
			this.text.update(deltaTime);
		}

		if (!this.disabled && this.endRad!==null && this.eating){
			if (this.eatRad>=Math.PI*2-Math.PI/180){
				this.disabled=true;
			}else{
				this.eatRad-=this.hour.rotationRad-this.hour.lastRotationRad;
			}
		}
	},

	collide : function(player){

		var dx=player.x-this.x,
			dy=player.y-this.y;

		this.eating=false;
		if ( !this.disabled && dx*dx + dy*dy < this.radiusSq){

			if (!(player.jumping && player.lastClockHand==this.minute)
				&& this.minute.collide(player)){

				this.eat();
				this.eating=true;
				if (this.text){
					if (!this.text.actived){
						player.keys++;
						this.text.actived=true;
					}
				}
				return true;
			}
		}else if (player.lastClock==this){
			player.lastClock=null;
			player.lastClockHand=null;
		}

		if (this.disabled && player.clock==this){
			player.hanging=false;
		}

		return false;

	},

	eatRad : 0,
	eat : function(){
		if (this.endRad===null){
			// this.endRad=  -Math.PI/2;
			this.endRad=  ((this.hour.rotation)%360)*DEG_TO_RAD;
			this.eatRad=Math.PI/180/1000;
		}
	},

	render : function(context , deltaTime){


		if (this.text){
			this.text.render(context,deltaTime);
		}

		if (!this.inView){
			return;
		}
		context.save();
		context.translate(this.x, this.y);

		// drawCircle(context, [0,0], this.radius, "#dddddd", true );
		// 


		if (!this.disabled){
			context.fillStyle="#ccaa99";
			context.strokeStyle="red";




			if (this.endRad===null){
				// context.arc( 0,0, this.radius, 0, Math.PI*2, true);
			}else{
				context.beginPath();
				context.moveTo(0,0);
				context.arc( 0,0, this.radius+100, this.endRad-this.eatRad, this.endRad, true);
				context.lineTo(0,0);
				context.closePath();
				context.clip()
			}
			if (this.scene.beating>0 && this.scene.player.clock==this){
				context.save()
				var s=1+ Math.min(this.scene.beating/1200,0.2);
				context.scale(s,s);
				context.globalAlpha=0.32;
				context.drawImage(this.img, -this.width/2 ,-this.height/2);
				context.restore();
			}
			context.drawImage(this.img, -this.width/2 ,-this.height/2);

			// context.fill();
			// context.stroke();
		} 
	
		context.restore();
		// drawCircle(context, [0,0], this.radius, "#dd0000", false );


		context.save();
		context.translate(this.x, this.y);

		context.globalAlpha=0.3;
		this.hour.render(context,deltaTime);
		context.globalAlpha=1;
		this.minute.render(context,deltaTime);



		context.restore();


	}


}

function ClockHand(cfg){
	merger(this , cfg);
	this.pointor=[];
	this.img=ResPool.get(this.img)||this.img;
	this.width=this.img.width;
	this.height=this.img.height;
}

ClockHand.prototype={

	constructor : ClockHand ,

	img : null ,
	rotation : 0 ,
	radius : 0,
	speedR : 0,
	x : 0,
	y : 0,

	collide : function(player){
		var x=player.x-this.x;
		var y=player.y-this.y;

		var NdotP= x*this.pointor[0] +y*this.pointor[1] ;

		if (NdotP>0 && NdotP<this.radius){
			this.tx= NdotP*Math.cos(this.rotationRad);
			this.ty=NdotP*Math.sin(this.rotationRad);
			var dis= Math.pow(this.tx-x,2)+Math.pow(this.ty-y,2);
			// console.log(player.radiusSq,dis)
			if (dis<player.radiusSq-30){
				player.hang( this.x+this.tx, this.y+this.ty, this);
				return true;
			}
		}else{
			this.tx=undefined;
		}
		return false;

	},

	update : function(deltaTime){

		this.lastRotationRad=this.rotationRad;

		if (this.parent.timeout<=0){

		this.rotation=this.rotation-this.speedR*deltaTime;
		}

		this.rotationRad=this.rotation* DEG_TO_RAD;

		if (!this.parent.inView){
			return;
		}
		var cos=Math.cos(this.rotationRad),
			sin=Math.sin(this.rotationRad);
		this.pointor[0]=cos;
		this.pointor[1]=sin;


	},

	render : function(context , deltaTime){

		context.save();
		context.rotate(this.rotationRad);
		context.drawImage(this.img,0,-this.height/2);

		// context.lineWidth=3;
		// context.strokeStyle=this.color||"red";
		// // context.strokeRect( -1 , -1 , this.radius, 2);
		// context.beginPath();
		// context.moveTo(0,0);
		// context.lineTo(this.pointor[0]*this.radius, this.pointor[1]*this.radius);
		// context.stroke();
		// context.closePath();

		// if (this.tx!==undefined){
		// drawCircle(context,[this.tx,this.ty],10,"red")
		// drawLine(context,[this.tx,this.ty], 
		// 	[this.parent.scene.player.x-this.x, this.parent.scene.player.y-this.y] )
			
		// }
		context.restore();


	} 

}








 