WSUI.App.Map=function(id,m){
	this.name="WSUI.App.Map";
	this.id=id;
	this.x=0;
	this.y=0;
	this.dom=$("<div id="+this.id+"></div>");
	this.dom.addClass("map");
	this.initialize({//执行base类的初始化工作
		x:this.x,
		y:this.y
	});

	var _this=this;
	this.debug="off";

	this.cw=40;// 单个单元格的宽度
	this.ch=40;// 单个单元格的高度
	this.cellArray=[];
	this.dom.css({
		width:this.cw*m.length,
		height:this.ch*m[0].length
	});
	//辅助功能
	this.showCell=function(X,Y){ //显示指定的单元格
		this.cellArray[X][Y].dom.show();
	};

	this.hideCell=function(X,Y){ //隐藏指定的单元格
		this.cellArray[X][Y].dom.hide();
	};
	
	$.each(m,function(X){
		_this.cellArray[X]=[];
		$.each(this,function(Y){
			var id="m_"+X+"_"+Y;
			var left=X*_this.cw;
			var top=Y*_this.ch;
			var width=_this.cw;
			var height=_this.ch;
			_this.cellArray[X][Y]={};
			_this.cellArray[X][Y].type=this;
			
			if(_this.debug=="on"){
				_this.cellArray[X][Y].dom=$("<div id="+id+" class=\"map_cell\" style=\"left:"+left+"px;top:"+top+"px;width:"+(width-1)+"px;height:"+(height-1)+"px;display:none\"></div>");
				if(_this.cellArray[X][Y].type==4){
					_this.cellArray[X][Y].dom.css("background-color","#00F");
				}
				$("#warp").append(_this.cellArray[X][Y].dom);
				_this.showCell(X,Y);
			}
		})
	})
};

WSUI.App.Map.prototype=new WSUI.App.BaseObject();

$.extend(WSUI.App.Map.prototype,{
	mapLoc:function(x,y){ //根据对象的xy求出XY
		var X,Y;
		X=parseInt(x / this.cw);
		Y=parseInt(y / this.ch);
		if(X>this.cellArray.length-1)X=this.cellArray.length-1;
		if(Y>this.cellArray[0].length-1)Y=this.cellArray[0].length-1;
		return [X,Y];
	},
	getCellCenter:function(cell){//根据xy求出单元格的中心
		var cellInfo={};
		cellInfo.x=cell[0]*this.cw+this.cw/2;
		cellInfo.y=cell[1]*this.ch+this.ch/2;
		return cellInfo;
	},
	getCellInfo:function(cell){//根据单元格的行列 求出 单元格的所有属性 包括坐标 宽高 类型
		var cellInfo={};
		cellInfo.x=cell[0]*this.cw;
		cellInfo.y=cell[1]*this.ch;
		cellInfo.w=this.cw;
		cellInfo.h=this.ch;
		$.each(this.cellArray[cell[0]][cell[1]],function(i,n){
			cellInfo[i]=n;
		});
		return cellInfo;
	},
	setLocProp:function(cell,key,val){//为指定单元格增加属性
		this.cellArray[cell[0]][cell[1]][key]=val;
	}
	
});
