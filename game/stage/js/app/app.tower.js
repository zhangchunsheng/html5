WSUI.App.Tower=function(towerType,x,y,options){
	var _this=this;
	this.name="WSUI.App.Tower";
	this.type="tower";
	this.towerType=towerType;
	//怪物的技能组对象
	this.skill={};
	if((x>800)||(y>480))return false;
	//先对坐标进行检测，如果在可造区域外 则return false 造塔失败
	var useCell=WSUI.Classes["WSUI.App.Map"]["map_1"].mapLoc(x,y);
	var cellInfo=WSUI.Classes["WSUI.App.Map"]["map_1"].getCellInfo(useCell);
	//如果type=0或者此区域已经有塔，则失败
	if((cellInfo.type==0)||(cellInfo["tower"]==1))return false;
	//否则标志此格已经有塔
	WSUI.Classes["WSUI.App.Map"]["map_1"].setLocProp(useCell,"tower",1);
	
	this.data=WSUI.Classes["WSUI.Data.Tower"].getData(this.towerType);//此怪物的数据
	//扣钱 如果钱不够则失败
	if(WSUI.Classes["WSUI.Data.Game"].getGold()>=this.data.gold){
		WSUI.Classes["WSUI.Data.Game"].goldUpdate(-this.data.gold);
	}else{
		return false;
	}

	//开始建塔
	this.id="t_"+Math.random().toString().replace(".","_");
	this.dom=$("<div id="+this.id+"></div>");
	this.dom.addClass("tower");
	this.range=this.data.range;//实际距离，当敌人的中心在这个距离内 ，进行射击
	this.w=this.h=this.range*2;//安放好的塔 得包含可视范围 而不仅仅是塔的样子
	this.x=WSUI.Classes["WSUI.App.Map"]["map_1"].getCellCenter(useCell).x-2;
	this.y=WSUI.Classes["WSUI.App.Map"]["map_1"].getCellCenter(useCell).y-1;
	this.dom.addClass("tower_"+this.towerType);
	this.dom.css({
		width:this.w+"px", 
		height:this.h+"px",
		opacity: 1
	});
	this.initialize({//执行base类的初始化工作
		x:this.x-this.w/2,
		y:this.y-this.h/2
	});
	this.bindBaseSkill();//绑定基本技能
	var checkTimer=setInterval(function(){
		_this.checkRangeEnemy();
	},this.data.interval);
	//开始检查周围的
	
		
};



WSUI.App.Tower.prototype=new WSUI.App.BaseObject();
$.extend(WSUI.App.Tower.prototype,{//定义属于塔的公共方法，如移动
	bindBaseSkill:function(){
	},
	checkRangeEnemy:function(){
		var _this=this;
		var c=0;//当击中第一个怪后，结束
		//由于已经将此物体加入到网格中 所以存在gridMap属性 首先遍历网格比对
		$.each(_this.gridMap,function(){
			var _curGrid=this;
			if(c==0){
				$.each(WSUI.Classes.Grid.cellArray[_curGrid[0]][_curGrid[1]], function(){ //遍历此单元格的物体 开始做碰撞测试
					if((this.type=="enemy")&&(WSUI.Util.Hit(_this,this))){
						this.skill[_this.data.bullet]=new WSUI.App.Skill[_this.data.bullet](_this,this,[_this.w/2,_this.h/2]);
						c=1;
						return false;
					}
			});
			}
		});

	}

});



/*//options: level | effect 等 
//安放塔的坐标为中心坐标
WSUI.App.Tower.TypeE=function(x,y,options){
};

WSUI.App.Tower.TypeE.prototype=new WSUI.App.Tower();

$.extend(WSUI.App.Tower.TypeE.prototype,{
});
*/
//options: level | effect 等 
//安放塔的坐标为中心坐标
/*WSUI.App.Tower.TypeD=function(x,y,options){
	var _this=this;
	if((x>800)||(y>480))return false;
	//先对坐标进行检测，如果在可造区域外 则return false 造塔失败
	var checkCell=WSUI.Classes["WSUI.App.Map"]["map_1"].mapLoc(x,y);
	var cellInfo=WSUI.Classes["WSUI.App.Map"]["map_1"].getCellInfo(checkCell);
	if(cellInfo.type==0)return false;
	
	this.data=WSUI.Classes["WSUI.Data.Tower"].getData("typeD");//此怪物的数据
	//扣钱 如果钱不够则失败
	if(WSUI.Classes["WSUI.Data.Game"].getGold()>=this.data.gold){
		WSUI.Classes["WSUI.Data.Game"].goldUpdate(-this.data.gold);
	}else{
		return false;
	}
	
	//开始建塔
	this.id="t_"+Math.random().toString().replace(".","_");
	this.dom=$("<div id="+this.id+"></div>");
	this.dom.addClass("tower");
	this.w=this.h=124;//安放好的塔 得包含可视范围 而不仅仅是塔的样子

	this.range=50;//实际距离，当敌人的中心在这个距离内 ，进行射击
	this.x=x;
	this.y=y;
	this.dom.addClass("tower_type_d range_b_50");//此处range_50不在这里加上 作为一个提示部分，只有当此塔被选中后，才会出现此range_50
	this.dom.css({
		width:this.w+"px", //这里不使用this.w 因为实际出现的DOM只需要24PX宽高
		height:this.h+"px",
		opacity: 1
	});
	this.initialize({//执行base类的初始化工作
		x:this.x-this.w/2,
		y:this.y-this.h/2
	});
	this.bindBaseSkill();//绑定基本技能
	var checkTimer=setInterval(function(){
		_this.checkRangeEnemy();
	},this.data.interval);
	//开始检查周围的
	
};

WSUI.App.Tower.TypeD.prototype=new WSUI.App.Tower();

$.extend(WSUI.App.Tower.TypeD.prototype,{
	checkRangeEnemy:function(){
		var _this=this;
		var c=0;//当击中第一个怪后，结束
		//由于已经将此物体加入到网格中 所以存在gridMap属性 首先遍历网格比对
		$.each(_this.gridMap,function(){
			var _curGrid=this;
			if(c==0){
				$.each(WSUI.Classes.Grid.cellArray[_curGrid[0]][_curGrid[1]], function(){ //遍历此单元格的物体 开始做碰撞测试
					if((this.type=="enemy")&&(WSUI.Util.Hit(_this,this))){
						this.skill["ShotB"]=new WSUI.App.Skill.ShotB(_this,this,[62,62]);
						c=1;
						return false;
					}
			});
			}
		});

	}
});

*/