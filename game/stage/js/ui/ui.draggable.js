//拖动

WSUI.Ui.Draggable=function(tgt){
		var _this=this;
		this.tgt=tgt;
		this.eventStatus={
			dragItem:0
		}
		this.dragDom=null;
		this.selectItem();
	};
$.extend(WSUI.Ui.Draggable.prototype,{
	selectItem:function(){
		var _this=this;
		this.tgt.bind("click",function(){
			_this.dragDom=$(this).clone();//拖动物体
			_this.putDom=$(this).clone();//安放预览
			_this.dragDom.css({position:"absolute",cursor:"pointer",left:$(this).offset().left,top:$(this).offset().top,opacity:0.7}).appendTo($("#ui"));//完整复制一个DOM对象
			_this.putDom.css({position:"absolute",cursor:"pointer",left:$(this).offset().left,top:$(this).offset().top,opacity:0.7}).appendTo($("#ui"));//完整复制一个DOM对象
			
			_this.dragItem();
			_this.eventStatus.dragItem=1;
		})
	},
	dragItem:function(e){//开始拖动
		var _this=this;
		$(document).bind("mousemove",function(e){
			_this.dragDom.css("left",e.pageX-_this.dragDom.width()/2);
			_this.dragDom.css("top",e.pageY-_this.dragDom.height()/2);
			//求出网格的坐标，让安放物吸附在网格上
			var useCell=WSUI.Classes["WSUI.App.Map"]["map_1"].mapLoc(e.pageX,e.pageY);
			var cellInfo=WSUI.Classes["WSUI.App.Map"]["map_1"].getCellInfo(useCell);
			var putX=WSUI.Classes["WSUI.App.Map"]["map_1"].getCellCenter(useCell).x;
			var putY=WSUI.Classes["WSUI.App.Map"]["map_1"].getCellCenter(useCell).y;

			if(cellInfo.type==0){
				_this.putDom.hide();
			}else if(cellInfo.type==4){
				_this.putDom.show();
			}
			_this.putDom.css("left",putX-_this.dragDom.width()/2);
			_this.putDom.css("top",putY-_this.dragDom.height()/2);
			
		});
		$(document).bind("mousedown",function(){
			_this.dropItem();
		});
	},
	dropItem:function(){//停止拖动
		$(document).unbind("mousemove");
		if(this.eventStatus.dragItem==1){
			new WSUI.App.Tower(this.tgt.attr("type"),(this.dragDom.offset().left+this.dragDom.width()/2-3),(this.dragDom.offset().top+this.dragDom.height()/2-2));
			this.dragDom.remove();
			this.putDom.remove();
			this.eventStatus.dragItem=0;
		}
	}
});
