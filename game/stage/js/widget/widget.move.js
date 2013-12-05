// JavaScript Document
// @author				mitchell
// @description			move
// @lastmodified		$2010-12 - 19$
//

//tgt为一个APP对象，必须含有x,y,spd用于存放坐标及速度
WSUI.Widget.Move=function(tgt,step){
	this.tgt =tgt;
	this.spd=tgt.spd; //get speed by para
	this.time=20;//set move timer
	this.status=true; //设置移动的状态，true 停止 false 正在移动
	this.step=step;//每次移动时 执行的函数
	this.angle=0;
}

$.extend(WSUI.Widget.Move.prototype,{
	start:function(angle){//根据角度开始移动
		var _this=this;
		_this.angle=angle;
		//增加判断是否已经处于移动状态 避免重复执行startMove 
		if(this.status){
			this.status=false;

			this.tF=function(){
				_this.t=setTimeout(function(){
					_this.tF();
					_this.stepMove(_this.angle);
				},_this.time*WSUI.Classes.Global["spd"]);
			}
			this.tF();
		}
	},
	stepMove:function(a){//开始移动 a=方向 90度 往上
		var _this=this;
		switch (a){
			case 0:
				this.offset=[this.spd,0];
				break;
			case 90:
				this.offset=[0,-this.spd];
				break;
			case 180:
				this.offset=[-this.spd,0];
				break;
			case 270:
				this.offset=[0,this.spd];
				break;
			default:
				var mathAngle=a*Math.PI/360*2;
				this.offset=[Math.cos(mathAngle)*this.spd,-Math.sin(mathAngle)*this.spd];
		}
		
		//备份旧坐标
		this.backupLoc=[this.tgt.x,this.tgt.y];
		this.tgt.x+=this.offset[0]; //将偏移值计算上去
		this.tgt.y+=this.offset[1];//将偏移值计算上去
		
		if(_this.step){
			_this.step(this);//执行step 并且讲相关参数提交过去
		}
		
	},
	stop:function(){
		clearTimeout(this.t);
		this.status=true;//设置为可移动状态
		return this;	//方便链式调用
	},
	newAngle:function(angle){
		this.angle=angle;
	},
	newSpeed:function(spd){//变更移动速度
		this.spd=spd;
	},
	
	//向指定坐标移动
	//暂时不用
	moveToPoint:function(point){
		/*
			根据路径移动原理:
			首先获得当前MAP坐标与目标MAP坐标，
			算出方向（目前只有4个）
			确认方向后，决定移动角度，开始移动 一旦目标的xy大于MAP Cell的xy 并且 x+w,y+h小于map cell 的x+w,y+h 则确认已经完成次此移动 返回移动完成
		*/
		
	}
});