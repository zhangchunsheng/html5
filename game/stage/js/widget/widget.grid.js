// JavaScript Document

(function(){
	var _this=this;
	this.debug="off";
	WSUI.Classes.Grid=this;
	
	this.W=10;
	this.H=6;
	this.cw=80;// 单个单元格的宽度
	this.ch=80;// 单个单元格的高度
	
	this.cellArray=[];
	this.bindList={}; //绑定的物体名单

	
	
	//static func
	this.bind=function(o){//与网格建立关联，（一般为有需要做碰撞测试的物体）
		this.bindList[o.id]=o;
		o.gridMap=[];
	};
	this.unbind=function(o){
		var _this=this;
		$.each(this.bindList,function(){
			if(this.id==o.id){
				delete _this.bindList[this.id];
			}
		})
		
	};
	this.pushItem=function(X,Y,o){//新物体移入单元格方法
		this.cellArray[X][Y].push(o);
	};
	this.gridUsed=function(o){//根据对象的长宽 XY 求出所占的单元格
		var gridMap=[];
		var itemXY_1=this.itemLoc(o.x,o.y);//求左上角XY
		var itemXY_2=this.itemLoc(o.x+o.w,o.y+o.h);			//求右下角XY
		if(itemXY_1[0]<0)itemXY_2[0]=0;
		if(itemXY_1[1]<0)itemXY_2[1]=0;
		if(itemXY_2[0]>9)itemXY_2[0]=9;
		if(itemXY_2[1]>5)itemXY_2[1]=5;
		for(var i=itemXY_1[0];i<=itemXY_2[0];i++){
			for(var j=itemXY_1[1];j<=itemXY_2[1];j++){
				gridMap.push([i,j]);
			}
		};
		o.gridMap=gridMap;//为对象 增加gridMap属性，用于做碰撞测试
		return gridMap;
	};
	this.itemLoc=function(x,y){ //根据对象的xy求出XY
		var X,Y;
		X=parseInt(x / this.cw);
		Y=parseInt(y / this.ch);
		return [X,Y];
	};

	//辅助功能
	this.showCell=function(X,Y){ //显示指定的单元格
		$("#g_"+X+"_"+Y).show();
	};

	this.hideCell=function(X,Y){ //隐藏指定的单元格
		$("#g_"+X+"_"+Y).hide();
	};




	for(var X=0;X<this.W;X++){ //创造一个二位数组， 记录所有的单元格，每个单元格为一个数组对象，用于存放ITEM 注:要把整个对象丢进去 光1个ID反找起来麻烦
		this.cellArray[X]=[];
		for(var Y=0;Y<this.H;Y++){
			this.cellArray[X][Y]=[];
			
			if(this.debug=="on"){ //开发模式，在HTML里画出所有的CELL
				var id="g_"+X+"_"+Y;
				var left=X*this.cw;
				var top=Y*this.ch;
				var width=this.cw;
				var height=this.ch;
				var dom=$("<div id="+id+" class=\"grid_cell\" style=\"left:"+left+"px;top:"+top+"px;width:"+(width-1)+"px;height:"+(height-1)+"px;display:none\"></div>");
				$("#warp").append(dom);
				
				this.showCell(X,Y);
			}
			
		}
	};
	
	
	//此计时器用于检查所有的表格里的对象坐标 是否已经离开表格
	setInterval(function(){
		//清除已经移除网格的物体
		$.each(_this.cellArray,function(i){
			$.each(this,function(j){
				if(this.length>0)this.length=0;
			});
		});
	
		$.each(_this.bindList,function(){//检查绑定物体的列表，获得网格坐标 并在 各个网格坐标里 注册物体
			var _i=this; //bindList里的item
			var objLocMap=_this.gridUsed(this);//获得物体所占的全部坐标
			$.each(objLocMap,function(){ //在物体所占的坐标里 把对象加进去
					_this.pushItem(this[0],this[1],_i);				
			})
		});
	},20);
	
	if(this.debug=="on"){ //开发者模式 帮助显示所有cell项所持有的ITEMID
		this.bakHtmlTxt={};//备份CELL的单元格HTML 避免重复渲染
		setInterval(function(){//定时 直接跟踪cellArray
			$.each(_this.cellArray,function(i){
				$.each(this,function(j){
					if(this.toString()!=_this.bakHtmlTxt["#g_"+i+"_"+j]){
						var itemList="";
						$.each(this,function(){
							itemList+=this.id+"<br />";
						});
						$("#g_"+i+"_"+j).html(itemList);
					};
					_this.bakHtmlTxt["#g_"+i+"_"+j]=this.toString();//备份CELL的单元格HTML 避免重复渲染
				});
			});
		},200)
	};

})();