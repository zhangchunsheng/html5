WSUI.App.Enemy=function(enemyType,enemyLevel,x,y,options){
		this.name="WSUI.App.Enemy";
		this.type="enemy";
		//怪物的技能组对象
		this.skill={};
		//所有怪物都拥有的技能——向终点移动
		
		this.id="e_"+Math.random().toString().replace(".","_");
		this.dom=$("<div id="+this.id+"><div class='enemy_hp'><div style='width:100%'></div></div></div>");
		this.dom.addClass("enemy");
		this.w=this.h=24;
		this.data=WSUI.Classes["WSUI.Data.Enemy"].getData(enemyType,enemyLevel);//此怪物的数据
		this.status={//怪物状态 目前有 持续伤害 | 减速 ,0 未中状态，1 中状态
			poison:0,//持续伤害
			spdDown:0
		};
		this.maxHp=this.hp=this.data.hp;
		this.spd=this.data.spd;
		this.dom.addClass(this.data.cls);
		this.dom.addClass("enemy_right");//默认方向为右
		this.dom.css({
			width:this.w+"px",
			height:this.h+"px"
		});
		this.initialize({//执行base类的初始化工作
			x:x,
			y:y
		});
		this.bindMover().bindRender();//绑定移动及渲染器
		this.bindBaseSkill();//绑定基本技能
		
		this.effectTimer={};//效果计时器，方便死亡后清理
};



WSUI.App.Enemy.prototype=new WSUI.App.BaseObject();
$.extend(WSUI.App.Enemy.prototype,{//定义属于怪物的公共方法，如移动
	bindMover:function(){
		this.mover=new WSUI.Widget.Move(this);
		//this.mover.start(0);
		return this;
	},
	bindRender:function(){
		//绑定渲染器
		var _this=this;
		$(this).bind("render",function(){ //绑定渲染事件
			_this.dom.css({	"left":_this.x,"top":_this.y});
		});
		WSUI.Classes.Render.List[this.id]=this;
		return this;
	},
	bindBaseSkill:function(){
		this.skill["MoveToLoc"]=new WSUI.App.Skill.MoveToLoc(this,this.spd,WSUI.Classes["WSUI.App.Map"]["map_1"]);
	},
	
	onHit:function(pow){
		var _this=this;
		this.hp=this.hp-pow/this.data.def;
		this.showHp();
		if(this.hp<=0){
			this.hp==0;
			this.updateGameInfo();
			this.remove();
		};
	},
	showHp:function(){
		var _this=this;
		this.hpPercent=this.hp/this.maxHp*100;
		this.dom.children().children().css("width",_this.hpPercent+"%");
	},
	lookDirection:function(d){
		var d_css = {0:'right',90:'up',180:'left',270:'down'}[d];
		this.dom.attr("class","enemy "+this.data.cls+" enemy_"+d_css);
		return this;
	},
	//效果
	spdDown:function(){
		var _this=this;
		if(this.status.spdDown==0){
			//变速
			this.mover.newSpeed(this.data.spd*0.5);
			this.status.spdDown=1;
			this.effectTimer["spdDown"]=setTimeout(function(){//回复原来速度
				_this.mover.newSpeed(_this.data.spd);
				_this.status.spdDown=0;
			},3000)
		}
	},
	poison:function(p){//p 每200毫秒持续伤害的值
		var _this=this;
		if(this.status.poison==0){
			//持续伤害
			this.status.poison=1;
			this.effectTimer["poison"]=setInterval(function(){
				_this.onHit(p);
			},400)
			this.effectTimer["poison_sub"]=setTimeout(function(){//持续伤害5秒
				clearInterval(_this.effectTimer["poison"]);
				_this.status.poison=0;
			},5000)
		}
	},
	updateGameInfo:function(){
		WSUI.Classes["WSUI.Data.Game"].scoresUp(this.data.scores).goldUpdate(this.data.gold);
	},
	remove:function(){
		var _this=this;
		delete this.skill;
		this.dom.remove();
		//清理效果
//		console.log(this.effectTimer);
		$.each(this.effectTimer,function(i,n){
			clearTimeout(_this.effectTimer[i]);
		})
		delete this.effectTimer;
		if(this.mover){
			this.mover.stop();
			delete this.mover;
		}
		//解除Grid绑定
		WSUI.Classes.Grid.unbind(this);
		delete WSUI.Classes.Render.List[this.id];
		delete WSUI.Classes["WSUI.App.Enemy"][this.id];

	}
});
