// JavaScript Document
/*
	//target	需要寻路的目标(只从目标里获得当前坐标 计算startPoint)
	map		地图信息
	startPoint起点
	endPoint终点
	author	mitchell
	version	0.2
*/
WSUI.Widget.Findway=function(map,startCell,endCell){
	var _this=this;
	this.map=map.cellArray;//地图
	this.startCell=startCell;//起点
	this.endCell=endCell;//终点
	
	this.way=[];//最终返回的路径
	
	this.debug="off";
	
	this.openList={}; //开放列表，存放节点
	this.openIndex=0; //节点加入开放列表时分配的唯一ID(从0开始)
	
	this.closeList={}; //关闭列表，存放节点
	this.closeIndex=0; //节点加入开放列表时分配的唯一ID(从0开始)


	
	
	//检查周围格子的函数
	this.checkCell=function(d){ //direction为数组 [x,y] 1为右下 -1为左上 
		var createCheck;
		var checkLoc={};
		checkLoc={
			X:_this.currentCell.X+d[0],
			Y:_this.currentCell.Y+d[1],//求出新开启点的Y
			parentCell:_this.currentCell.id
		};
		
		
		
		if(_this.map[checkLoc.X][checkLoc.Y].type==4){//首先计算 该格子是否为障碍物，如果为障碍物，则不放入openlist
			createCheck="false";
		};
		//再如果 该格子已经为开启坐标，则放弃
		$.each(_this.openList,function(){
			if((this.X==checkLoc.X)&&(this.Y==checkLoc.Y)){
				createCheck="false";
			}
		});
		//再如果 该格子已经为关闭坐标，则放弃
		$.each(_this.closeList,function(){
			if((this.X==checkLoc.X)&&(this.Y==checkLoc.Y)){
				createCheck="false";
			}
		});
		
		if(createCheck=="false")return false;
		
		//通过检测，则将此点加入openlist
		
		_this.openIndex++;//增加OPENID
		
		checkLoc.id=_this.openIndex;//对被检查的点设置ID
		
		//设置FGH
		checkLoc.H=Math.sqrt(Math.pow((_this.endCell[1]-checkLoc.Y),2)+Math.pow((_this.endCell[0]-checkLoc.X),2));
		checkLoc.G=Math.sqrt(Math.pow((_this.startCell[1]-checkLoc.Y),2)+Math.pow((_this.startCell[0]-checkLoc.X),2));
		checkLoc.F=checkLoc.G+checkLoc.H;
		
		_this.openList[_this.openIndex]=checkLoc;
		
		
		if(this.debug=="on")_this.astarDebug(checkLoc);
	}
	
	//探路
	this.find=function(){
		_this.checkCell([0,1]);
		_this.checkCell([0,-1]);
		_this.checkCell([1,0]);
		_this.checkCell([-1,0]);
		
		//对openlist里的数据进行排序 ，找出H最小项
		var minH=999;
		var newParentCell;
		$.each(_this.openList,function(){ //???此处需要确认是否要对所有openList进行遍历???
			if(this.H<minH){
				minH=this.H;
				newParentCellId=this.id;
			}
		});
		
		
		var checkLoc=_this.openList[newParentCellId];
		_this.closeIndex++;//增加OPENID
		//将其直接丢至关闭列表
		_this.closeList[_this.closeIndex]=checkLoc;//将父节点 返回给关闭列表
		delete _this.openList[newParentCellId];
		
		if(this.debug=="on"){
			//debug 检查目前openList所占用的cell
			$.each(_this.openList,function(){
				_this.map[checkLoc.X][checkLoc.Y].dom.css("background-color","#0F0");
		
			});
			//debug 检查目前closeList所占用的cell
			$.each(_this.closeList,function(){
				_this.map[checkLoc.X][checkLoc.Y].dom.css("background-color","#F0F");
			});
		}
		//判断当前格子是否为最终目标格，如果是 则开始找parent square
		//console.log(_this.closeList[_this.closeId].Y,_this.endSquare[1]);
		if((checkLoc.X==_this.endCell[0])&&(checkLoc.Y==_this.endCell[1])){
			//开始反推父ID，找出路径
			_this.way.push([checkLoc.X,checkLoc.Y]);
			var nextParentId=checkLoc.parentCell;
			var fillWay=function(obj){
				$.each(obj,function(){
					if(this.id==nextParentId){//遍历所有的closeList,如果ID等于当前nextParentId则把该坐标 丢进WAY里
						_this.way.push([this.X,this.Y]);
						nextParentId=this.parentCell;
						if(nextParentId==0){
						}else{
							fillWay(obj);
						}
					}
				})
			};
			
			fillWay(_this.closeList);
			
			//console.log(way);
			if(this.debug=="on"){
	
				//debug 填充路径
				for(i=0;i<_this.way.length;i++){
					_this.map[_this.way[i][0]][_this.way[i][1]].dom.css("background-color","#FFF");
				};
			}
		};
		
		//更新当前检查的最后关闭单元格
		this.currentCell=checkLoc;
		

		
		
	}
	
	//DEBUG
	this.astarDebug=function(checkLoc){
		//debug 在单元格里标识FGH ID 
		//开启此ID 需要开启MAP组件的DEBUG
		_this.map[checkLoc.X][checkLoc.Y].dom.html("ID:<span style='color:#0F0;font-weight:bold'>"+checkLoc.id+"</span><br>H:"+checkLoc.H+"<br>G:"+checkLoc.G+"<br>F:"+checkLoc.F+"<br>parent:"+checkLoc.parentCell);
	}
	
	
	

	this.currentCell={
		id:this.openIndex,
		X:this.startCell[0],
		Y:this.startCell[1],
		parentCell:this.openIndex
	};// 最后的closeCell
	
	//开始第一步寻路
	//首先 将开始格 放入开启列表，并且，设置ID为0;
	this.openList[this.openIndex]=this.currentCell;
	
	//将其直接丢至关闭列表
	this.closeList[this.closeIndex]=this.openList[this.openIndex];
	if(this.debug=="on")this.astarDebug(this.currentCell);

	do{
		this.find();
	}while ((this.currentCell.X!=this.endCell[0])||(this.currentCell.Y!=this.endCell[1]));
	
	return this.way;
};

