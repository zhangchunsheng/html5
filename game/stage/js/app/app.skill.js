// JavaScript Document
//技能库——由怪物TYPE来选择性加载
WSUI.App.Skill={};


//按照地图路径走动
WSUI.App.Skill.MoveToLoc=function(o,spd,map){
	this.o=o;
	this.map=map;
	this.spd=spd;
	this.on(this.spd);
	this.status=1;//技能的状态1:on 0:off
}
$.extend(WSUI.App.Skill.MoveToLoc.prototype,{
	on:function(){
		var _this=this;
		this.status=1;
		//根据自己当前的坐标寻路
		
		var enemy_way=WSUI.Widget.Findway(this.map,[1,2],[17,10]);
		var currentMapLoc=this.map.mapLoc(this.o.x,this.o.y); //根据地图 求出当前物体所在地图的坐标
		//this.o.mover.moveToPoint([2,2]);
		
		/*
			根据路径移动原理:
			首先获得当前MAP坐标与目标MAP坐标，
			算出方向（目前只有4个）
			确认方向后，决定移动角度，开始移动 一旦目标的xy大于MAP Cell的xy 并且 x+w,y+h小于map cell 的x+w,y+h 则确认已经完成次此移动 开始寻找下个目标坐标
		*/
		var i=enemy_way.length-1;
		var d=Math.round(WSUI.Util.GetAngle(currentMapLoc,enemy_way[i]));
		
		this.o.mover.start(d);
/*		do{
		} while(i==0)
*/		//时时对坐标怪物坐标与MAP坐标进行检测,如果符合条件 修改 i  使怪物往下一个目标移动
		this.wayCheck=setInterval(function(_o){
			return function(){
				currentMapLoc=_this.map.mapLoc(_o.x,_o.y);//获得 当前怪物所在的地图信息
				var nextSetpInfo=_this.map.getCellInfo(enemy_way[i]);
				if((_o.x>=nextSetpInfo.x)&&(_o.y>=nextSetpInfo.y)&&((_o.x+_o.w)<=(nextSetpInfo.x+nextSetpInfo.w))&&((_o.y+_o.h)<=(nextSetpInfo.y+nextSetpInfo.h))){
					i--;
					if(i<0){
						//走完后 执行移除操作
						WSUI.Classes["WSUI.Data.Game"].lifeDown();
						_this.off();
						return false;
					};
					_this.o.mover.stop();
					var d=Math.round(WSUI.Util.GetAngle(currentMapLoc,enemy_way[i]));
					currentMapLoc=enemy_way[i];
					_this.o.lookDirection(d);
					_this.o.mover.start(d);
				};
			}
		}(_this.o),30);
		
	},
	off:function(){
		var _this=this;
		this.status=0;

		clearInterval(_this.wayCheck);
		this.o.mover.stop();
		this.o.remove();
	}
});


WSUI.App.Skill.normal=function(o,tgt,offset){
		this.o=o;
		this.tgt=tgt;
		this.offset=offset ? offset : [0,0];
		this.on();
}
$.extend(WSUI.App.Skill.normal.prototype,{
	on:function(){
		var _this=this;
		var angle=WSUI.Util.GetAngle([_this.o.x+_this.offset[0],_this.o.y+_this.offset[1]],[_this.tgt.x+_this.tgt.w/2,_this.tgt.y+_this.tgt.h/2]);
		new WSUI.App.Bullet("normal",_this.o.x+_this.offset[0],_this.o.y+_this.offset[1],angle+Math.random()*10-5);
	},
	off:function(){
		var _this=this;
		clearTimeout(this.stepTimer);
	}
});

//冷冻弹
WSUI.App.Skill.ice=function(o,tgt,offset){
		this.o=o;
		this.tgt=tgt;
		this.offset=offset ? offset : [0,0];
		this.on();
}
$.extend(WSUI.App.Skill.ice.prototype,{
	on:function(){
		var _this=this;
		var angle=WSUI.Util.GetAngle([_this.o.x+_this.offset[0],_this.o.y+_this.offset[1]],[_this.tgt.x+_this.tgt.w/2,_this.tgt.y+_this.tgt.h/2]);
		new WSUI.App.Bullet("ice",_this.o.x+_this.offset[0],_this.o.y+_this.offset[1],angle+Math.random()*10-5);
	},
	off:function(){
		var _this=this;
		clearTimeout(this.stepTimer);
	}
});

//毒气弹
WSUI.App.Skill.poison=function(o,tgt,offset){
		this.o=o;
		this.tgt=tgt;
		this.offset=offset ? offset : [0,0];
		this.on();
}
$.extend(WSUI.App.Skill.poison.prototype,{
	on:function(){
		var _this=this;
		var angle=WSUI.Util.GetAngle([_this.o.x+_this.offset[0],_this.o.y+_this.offset[1]],[_this.tgt.x+_this.tgt.w/2,_this.tgt.y+_this.tgt.h/2]);
		new WSUI.App.Bullet("poison",_this.o.x+_this.offset[0],_this.o.y+_this.offset[1],angle+Math.random()*10-5);
	},
	off:function(){
		var _this=this;
		clearTimeout(this.stepTimer);
	}
});
