// JavaScript Document

//子弹类型 目前为3种
//BA 普通子弹
//BB  减速弹
WSUI.App.Bullet=function(bulletType,x,y,angle,options){
	var _this=this;
	
	this.id="b_"+Math.random().toString().replace(".","_");
	//注册classes
	if(!WSUI.Classes["WSUI.App.Bullet"])WSUI.Classes["WSUI.App.Bullet"]=[];
	WSUI.Classes["WSUI.App.Bullet"][this.id]=this;
	this.bulletType=bulletType;
	this.type="bullet";
	this.x=x;
	this.y=y;
	this.data=WSUI.Classes["WSUI.Data.Bullet"].getData(this.bulletType);//此怪物的数据
	this.w=16;
	this.h=16;
	this.spd=this.data.spd;
	this.power=this.data.power;
	this.dom=$("<img src=\"images/bullet_"+this.bulletType+".gif\" id=\""+this.id+"\" class=\"bullet\" style=\"left:"+this.x+"px;top:"+this.y+"px;\" />");
	//this.dom.addCLass(this.data.cls);
	WSUI.Classes.Grid.bind(this);
	this.fly=WSUI.App.BulletSkill.Fly;
	this.fly(angle);
	this.options={};
	$("#warp").append(this.dom);
	
	
	WSUI.Classes.Render.List[this.id]=this;
	
	$(this).bind("render",function(){ //绑定渲染事件
		_this.dom.css({	"left":_this.x,"top":_this.y});
	});
	this.bulletTimer=setTimeout(function(){_this.remove()},400)//子弹生命周期，1秒后自动死亡

}
$.extend(WSUI.App.Bullet.prototype,{
	remove:function(){
		
		
		//解除Grid绑定
		WSUI.Classes.Grid.unbind(this);
		clearTimeout(this.bulletTimer);
		//清理DOM
		this.mover.stop();
		this.dom.remove();
		delete this.mover;
		delete WSUI.Classes.Render.List[this.id];
		delete WSUI.Classes["WSUI.App.Bullet"][this.id];
	}
});



//子弹技能库
WSUI.App.BulletSkill={};
WSUI.App.BulletSkill.Fly=function(angle){
	var _this=this;
	this.angle=angle;

	this.hit=function(moverP){
		var c=0; //一组类型检测完成后，如果发生碰撞，改为1，则不再进行下一组碰撞测试

		//由于已经将此物体加入到网格中 所以存在gridMap属性 首先遍历网格比对
		$.each(_this.gridMap,function(){
			var _curGrid=this;
			//$.each(WSUI.Classes.Model, function(){ //全部遍历测试

			$.each(WSUI.Classes.Grid.cellArray[_curGrid[0]][_curGrid[1]], function(){ //遍历此单元格的物体 开始做碰撞测试
				if((this.type=="enemy")&&(WSUI.Util.Hit(_this,this))){
					//根据子弹的特增，最佳
					if(_this.bulletType=="normal"){
						//播放爆炸动画
						WSUI.Classes.Effect.bulletHit(_this.x,_this.y);
					}else if(_this.bulletType=="ice"){
						this.spdDown();
						WSUI.Classes.Effect.iceBulletHit(_this.x,_this.y);
					}else if(_this.bulletType=="poison"){
						this.poison(0.3);
						WSUI.Classes.Effect.poisonBulletHit(_this.x,_this.y);
					}
					//					
					this.onHit(_this.power);

					_this.remove();
					c=1;
					return false;
				}
			});
			//此处仍然需要做此c的判断
			if(c==1)return false;
		});
		
		if(c==1)return false;
	}
	this.mover=new WSUI.Widget.Move(this,_this.hit);
	this.mover.start(this.angle);
	
};

