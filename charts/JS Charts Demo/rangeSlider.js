// JavaScript Document
if(typeof(Chart)=="undefined"){
	Chart={};	
	};
if(typeof(Chart.Component)=="undefined"){	
	Chart.Component={};	
	};
Chart.Component.slider = function(target) {	
target=$(target);
this._interactive=false;
this._callBack=null;
this._onDragCallBack =null;
this._dataSource =null;
this._sliderThemeSettings={
	calibration: {
		lineColor: "#666666",
		lineWidth: 1
	},
	triangle:{
		fillColor:"#000000",
		lineColor:"#666666",
		lineWidth:0,
		side:5,
		show:true,
		border:1,
		borderColor:"#666666"
			 },
	slider:{
		height:4,
		fillColor:"#666666",
		lineColor:"#666666",
		lineWidth:1,
		show:true
		 },
	gradientColor:{
		show:true,
		startColor:"#999999",
		stopColor:"#999999"
		},		
	lineColor:"#666666",
    lineWidth:1, 
	thumbnailFillColor:"#728fb2",
	opacity:0.3,
	sliderLable:{
		"font-family":"Arial, Helvetica, sans-serif",
		"font-size":"10px",
		"color":"#666666",
		"overflow":"hidden",
		position:"absolute",
		left:5,
		top:2
		}
	};  
this._mapping=new Chart.Common.Util.Double2DoubleLinearMapping(); 
this._placeHolder = $("<div></div>").appendTo(target).css({
	width:target.width(),
	height:target.height(),
	position:"relative",
	"-moz-user-select":"none"	
});
this._placeHolder.get(0).onselectstart=function(){return false;};
this._reset=function(){
	this._placeHolder.html(""); 
	}
this._createElement=function(){	
	var setting=this._sliderThemeSettings;
	var h=this._placeHolder.height();
	var holder=$("<div></div>").appendTo(this._placeHolder).css({
		width:this._placeHolder.width()-setting.triangle.side*2,
		height:h,
		position:"absolute",
		top:0,
		left:setting.triangle.side 
	});
	this._bgHolder=$("<div></div>").appendTo(holder).css({
		width:holder.width(),
		height:holder.height(),
		position:"relative"  
	});	
	
	this._bgCanvas = $.Canvas.create(this._bgHolder, "absolute", 0, 0, this._bgHolder.width(), h);
	this._labelHolder=$("<div></div>").appendTo(this._bgHolder).css({
		width:this._bgHolder.width(),
		height:this._bgHolder.height(),
		position:"relative"  
	});	
	if (setting.slider.show) {
		this._borderCanvas = $.Canvas.create(this._bgHolder, "absolute", 0, 0, this._bgHolder.width(), h);		 
		this._sliderCanvas = $.Canvas.create(this._bgHolder, 
										"absolute", 0, h-setting.slider.height,
	 									this._bgHolder.width(),setting.slider.height);
			
	} 
	if(setting.triangle.show){ 
		this._leftDiv=$("<div></div>").css({
			width:0,
			height:h-1,
			position:"absolute",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=25)",
			"filter": "alpha(opacity = 25)",
			"opacity":0.25,
			"background-color":"#ffffff",			
			overflow:"hidden",		
			top:1,
			left:0 
		}).appendTo(this._labelHolder);
		this._leftDrager=$("<div></div>").appendTo(this._bgHolder).css({
			width:setting.triangle.side,
			height:h,
			position:"absolute",
			overflow:"hidden",			
			top:0,
			right:this._bgHolder.width() 
		});
		this._rightDiv=$("<div></div>").css({
			width:0,
			height:h-1,
			position:"absolute",
			"-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=25)",
			"filter": "alpha(opacity = 25)",
			"opacity":0.25,
			"background-color":"#ffffff",			
			overflow:"hidden",			
			top:1,
			right:0 
		}).appendTo(this._labelHolder); 		
		this._rightDrager=$("<div></div>").appendTo(this._bgHolder).css({
			width:setting.triangle.side,
			height:h,
			position:"absolute",
			overflow:"hidden",			
			top:0,
			left:this._bgHolder.width() 
		}); 
		this._midDrager=$("<div></div>").appendTo(this._bgHolder).css({
			width: setting.triangle.side,
			height: h - 1,
			position: "absolute",
			"border-top": "solid 1px #cccccc",
			"overflow":"hidden",
			top: 0,
			left: 0
		}); 	
		var le=$.Canvas.create(this._leftDrager, "", 0, 0,setting.triangle.side,h);
		var ri=$.Canvas.create(this._rightDrager, "", 0, 0,setting.triangle.side,h);	
		graphics= new $.Graphics(le.getContext("2d"));
		graphics.begin();
		graphics.setLineStyle(setting.triangle.lineWidth,setting.triangle.lineColor);
		graphics.setNormalFill(setting.triangle.fillColor);
		graphics.drawPolygon([{x:0,y:h*0.3333},{x:setting.triangle.side,y:h*0.5},{x:0,y:h*0.6666}]);		 
		graphics.setNoneFill();
		graphics.end();

		graphics.begin();
		graphics.setLineStyle(setting.triangle.border,setting.triangle.borderColor);
		graphics.setNoneFill();
		graphics.drawLine(setting.triangle.side-1,0,setting.triangle.side-1,h);		
		graphics.end();
					
		graphics= new $.Graphics(ri.getContext("2d"));
		graphics.begin();
		graphics.setLineStyle(setting.triangle.lineWidth,setting.triangle.lineColor);
		graphics.setNormalFill(setting.triangle.fillColor);
		graphics.drawPolygon([{x:0,y:h*0.5},{x:setting.triangle.side,y:h*0.3333},{x:setting.triangle.side,y:h*0.6666}]);	
		graphics.setNoneFill();
		graphics.end();	
		
		graphics.begin();
		graphics.setLineStyle(setting.triangle.border,setting.triangle.borderColor);
		graphics.setNoneFill();
		graphics.drawLine(0,0,0,h);		
		graphics.end();				
	}
}
this._setPosition=function(first,second){
    if(!this._sliderThemeSettings.triangle.show){return;}
 	var s=this._mapping.getCoordinate(first);
	var b=this._mapping.getCoordinate(second);
	s=Math.round(s)+0.5;
	b=Math.round(b);
    this._leftDrager.css({right: this._bgHolder.width()-s });
	this._rightDrager.css({left: b });
	this._midDrager.css({
		width:b-s,
		left:s
		 });
	this._drawSlider(s,b);
 	 		 
}
this._drawSlider=function(start,end){
	 
	if(this._borderCanvas){
		var ctx=this._borderCanvas.getContext("2d");
		var h=$(this._borderCanvas).height();
		var w=$(this._borderCanvas).width();
		ctx.clearRect(0,0,w,h);
		var graphics= new $.Graphics(ctx);		 
		graphics.begin();
		graphics.setLineStyle(this._sliderThemeSettings.lineWidth,this._sliderThemeSettings.lineColor);
		graphics.setNoneFill();
		graphics.drawLine(0,0,start,0);	
		graphics.drawLine(end,0,w,0);

		graphics.drawLine(0,0,0,h-0.5);
		graphics.drawLine(w-0.5,0,w-0.5,h-0.5);
		graphics.drawLine(0,h-0.5,w,h-0.5);
		graphics.end();
		graphics=ctx=null;			
	}
	if (this._sliderCanvas) {
		var ctx=this._sliderCanvas.getContext("2d");
		var h=$(this._sliderCanvas).height();
		var w=$(this._sliderCanvas).width();
		ctx.clearRect(0,0,w,h);
		var graphics= new $.Graphics(ctx);		 
		graphics.begin();
		graphics.setLineStyle(this._sliderThemeSettings.slider.lineWidth,this._sliderThemeSettings.slider.lineColor);
		graphics.setNormalFill(this._sliderThemeSettings.slider.fillColor);
		graphics.drawPolygon([{x:start,y:0},{x:end,y:0},{x:end,y:h},{x:start,y:h}]);	
		graphics.setNoneFill();
		graphics.end();
		graphics=ctx=null;				
		}		
}
this._onDragEnd=function(){
	 if(this._callBack!=null){
	 	 var l=this._bgHolder.width()-parseFloat(this._leftDrager.css("right").replace("px",""));
		 var r=parseFloat(this._rightDrager.css("left").replace("px","")); 
		 var data={left:null,right:null};
		 data.left=this._mapping.getValue(l);
		 data.right=this._mapping.getValue(r);
		 this._callBack.call(this,data.left,data.right);
			  
	 }
}
this._onDrag=function(){
	 if(this._onDragCallBack!=null){
	 	 var l=this._bgHolder.width()-parseFloat(this._leftDrager.css("right").replace("px",""));
		 var r=parseFloat(this._rightDrager.css("left").replace("px","")); 
		 var data={left:null,right:null};
		 data.left=this._mapping.getValue(l);
		 data.right=this._mapping.getValue(r);
		 this._onDragCallBack.call(this,data.left,data.right);
			  
	 }
}
this._bindEvent=function(){
	if(!this._sliderThemeSettings.triangle.show){return;}
	if(!this._interactive){
	var midDown=false;
	var leftDown=false;
	var rightDown=false; 
	var me=this;
	var leftPtstart=leftPositionStart=null;
	var mw=null;
	var rightPtstart=rightPositionStart=null;
	var midPtstart=midPositionStart=null;
	var midPL=midPR=null;
	var contanier=this._bgHolder;
	this._leftDrager.unbind("mousedown").css({"cursor":"w-resize"}).bind("mousedown",function(e){
		leftDown=true;
		leftPtstart=$.getPosition(contanier,e).x;
		leftPositionStart=parseFloat($(this).css("right").replace("px","")); 
		//leftPositionStart=Math.round(leftPositionStart);
		mw=me._midDrager.width();		 
		$(document).one("mouseup",function(){																		
 	    	//ptstart=ptend=null;
	    	leftPtstart=leftPositionStart=mw=null;
			leftDown=rightDown=midDown=false;
			midPL=midPR=null;			
 			me._onDragEnd();
			});		 
		});
	this._rightDrager.unbind("mousedown").css({"cursor":"w-resize"}).bind("mousedown",function(e){
		rightDown=true;
		rightPtstart=$.getPosition(contanier,e).x;
		rightPositionStart=parseFloat($(this).css("left").replace("px",""));
		//rightPositionStart=Math.round(rightPositionStart);
		mw=me._midDrager.width();		 
		$(document).one("mouseup",function(){ 
	    	rightPtstart=rightPositionStart=mw=null;
			leftDown=rightDown=midDown=false;
			midPL=midPR=null; 
			me._onDragEnd();
			});		 
		});	
	this._midDrager.unbind("mousedown").css({"cursor":"move"}).bind("mousedown",function(e){
		midDown=true;
		midPtstart=$.getPosition(contanier,e).x;
		midPositionStart=parseFloat($(this).css("left").replace("px",""));
		midPL=parseFloat($(me._rightDrager).css("left").replace("px",""));
		midPR=parseFloat($(me._leftDrager).css("right").replace("px",""));
		//rightPositionStart=Math.round(rightPositionStart);		 	 
		$(document).one("mouseup",function(){ 
	    	rightPtstart=rightPositionStart=mw=null;
			leftDown=rightDown=midDown=false;
			midPL=midPR=null;
            me._onDragEnd();
				 });		 
		});				
	contanier.unbind("mousemove").bind("mousemove",function(e){
	 	if(leftDown){
			var x=$.getPosition(contanier,e).x;
			var w=$(this).width();
	        var d=x-leftPtstart;
			var l=w-parseFloat(me._rightDrager.css("left").replace("px",""));			
			if ((leftPositionStart - d) >l && (leftPositionStart - d) <= w) {
					me._leftDrager.css({right:leftPositionStart-d});
					me._leftDiv.css({width:w-leftPositionStart+d});
					me._midDrager.css({
						width:mw-d,
						left:w-leftPositionStart+d 
			 		 });
				 	me._drawSlider(w-leftPositionStart+d,w-leftPositionStart+mw);
					me._onDrag();			
				}
			else if((leftPositionStart - d) <=l){
					leftDown=false;
					rightDown=true;
					mw=me._midDrager.width();
					rightPtstart=x;
					rightPositionStart=parseFloat($(me._rightDrager).css("left").replace("px",""));
					me._onDrag();
				}		
		}
		else if(rightDown){
			var x=$.getPosition(contanier,e).x;
			var w=$(this).width();
	        var d=x-rightPtstart;
			var l=w-parseFloat(me._leftDrager.css("right").replace("px",""));			
			if ((rightPositionStart+d) >l && (rightPositionStart +d) <= w) {
					me._rightDrager.css({left:rightPositionStart+d});
					me._rightDiv.css({width:w-(rightPositionStart+d)});
					me._midDrager.css({
						width:mw+d 
			 		 });
				 	me._drawSlider(l,l+mw+d);
					me._onDrag();			
				}
			else if((leftPositionStart+ d) <=l){
					leftDown=true;
					rightDown=false;
					mw=me._midDrager.width();
					leftPtstart=x;
		            leftPositionStart=parseFloat($(me._leftDrager).css("right").replace("px",""));
					me._onDrag(); 
				}				
		}
		else if(midDown){
			var x=$.getPosition(contanier,e).x;
			var w=$(this).width();
	        var d=x-midPtstart;
			var left=w-midPR+d;
			if(left>=0&&left<=w-$(me._midDrager).width()){
				$(me._midDrager).css({left:w-midPR+d});
					
				me._rightDiv.css({width:w-(midPL+d)});
				
				me._leftDiv.css({width:w-midPR+d});
							
				me._drawSlider(w-midPR+d,w-midPR+d+$(me._midDrager).width());
				$(me._leftDrager).css({right:midPR-d});	
				$(me._rightDrager).css({left:midPL+d});	
				me._onDrag();				
			}
		
		}
	 });
 		
	}
	else{
		this._bgHolder.unbind("mousemove").css({cursor:"default"});
		this._midDrager.unbind("mousedown").css({cursor:"default"});
		this._rightDrager.unbind("mousedown").css({cursor:"default"});
		this._leftDrager.unbind("mousedown").css({cursor:"default"});
	} 
			
}
this._createMapping=function(){
	var datasource=this._dataSource;
 	if (datasource.xRange instanceof Array) {
		this._mapping.setValueRange({first:datasource[0][0],second:datasource[datasource.length-1][0]});
 	}
	else{
		this._mapping.setValueRange({first:datasource.xRange.first,second:datasource.xRange.second});
	}	 
	this._mapping.setCoordinateRange({first:0,second:$(this._bgCanvas).width()});
		
}
this._createBgColor=function(){
	var data=this._dataSource.xRange.data;
	if((data instanceof Array)&&data.length>=2&&data[0].length==2){		 
		var ctx = this._bgCanvas.getContext("2d");
		var h=$(this._bgCanvas).height();
		var w=$(this._bgCanvas).width();
		var lineargradient = ctx.createLinearGradient(0,h * 0.5, w, h*0.5);
		var me=this; 
		$.each(data,function(i,v){
			var s=me._mapping.getCoordinate(v[0])/w;			 	
			lineargradient.addColorStop(s, v[1]);					
		}); 
		ctx.fillStyle = lineargradient;
		ctx.fillRect(0, 0, w, h);
		ctx=null;		 
	}
}
this._createThumbnail=function(){
	var data=this._dataSource.xRange.data,
		setting=this._sliderThemeSettings,
		ctx = this._bgCanvas.getContext("2d"),
		h=$(this._bgCanvas).height(),
		w=$(this._bgCanvas).width();
	var bgh = h - setting.slider.height;	
	if($.isArray(data)&&data[0].length==3){
		var copyData=$.extend(true,[],data);
		var mappingY=new Chart.Common.Util.Double2DoubleLinearMapping();		
		copyData.sort(function(a,b){return a[2]-b[2]});
		var maxY=copyData[copyData.length-1][2],minY=copyData[0][2];
 		mappingY.setValueRange({first:minY,second:maxY});
		mappingY.setCoordinateRange({first:bgh,second:0});		
		var pt=[{x:0,y:h}],me=this;
		$.each(data,function(i,v){
			pt.push({x:me._mapping.getCoordinate(v[0]),y:mappingY.getCoordinate(v[2])});
		});
		pt.push({x:w,y:h});
		ctx.clearRect(0,0,w,h);
		var graphics= new $.Graphics(ctx);		 
		graphics.begin();
		graphics.setLineStyle(0,"#000");
		graphics.setNormalFill(setting.thumbnailFillColor);
		graphics.drawPolygon(pt);	
		graphics.setNoneFill();
		graphics.end();
		graphics=mappingY=copyData=null;			
	}
	if (setting.gradientColor.show&&setting.slider.show) {			
		var lineargradient = ctx.createLinearGradient(this._bgHolder.width() * 0.5, bgh, this._bgHolder.width() * 0.5, h);
		lineargradient.addColorStop(0, setting.gradientColor.startColor);
		lineargradient.addColorStop(1, setting.gradientColor.stopColor);
		ctx.fillStyle = lineargradient;
		ctx.fillRect(0, bgh, this._bgHolder.width(), setting.slider.height);
	}
	ctx=null;	
};
this._createLabel=function(){
	var ticks=this._dataSource.howToDrawSliderAxis;
/*
	var c=$("<div></div>").css({
		position: "absolute",
		top: 0,
		left: 0,
		width: this._bgHolder.width(),
		height: this._bgHolder.height()
	});	
*/
	var c=this._labelHolder;
	var m=this._mapping,setting=this._sliderThemeSettings;
	var css=setting.sliderLable;
	var bottom=css.top;
	var sliderH=this._sliderThemeSettings.slider.show?setting.slider.height:0;
	bottom+=sliderH;
	var h=c.height()-sliderH;
	var pt=[];
	var me=this;
	if(ticks instanceof Array){
		$.each(ticks,function(i,v){
			var n=null;
			var html=null;
			if(v instanceof Array){
				html=v[1];
				n=m.getCoordinate(v[0]);
				
			}
			else{
				n=m.getCoordinate(v);
				
				html=StrFormatter.getFormattedNumString(v,"",2,true).toString();
				
			}
			pt.push([n,h-4,n,h]);
			n=n+css.left;
			if (n <= c.width()) {
/*
				if (me._colorSlider) {
					$("<div></div>").html(html).prependTo(c).css(css).css({
						top: "",
						left: n,
						bottom: bottom
					});
				}
				else {
				}
*/
					$("<div></div>").html(html).appendTo(c).css(css).css({
						top: "",
						left: n,
						bottom: bottom
					});					
				
				
			}
			else {
/*
				if (me._colorSlider) {
					$("<div></div>").html(html).prependTo(c).css(css).css({
						top: "",
						left: "",
						bottom: bottom,
						right: 0
					});
				}
				else {
				}
*/
					$("<div></div>").html(html).appendTo(c).css(css).css({
						top: "",
						left: "",
						bottom: bottom,
						right: 0
					});					
				
			}
		});
	}	 
	if(pt.length>0){ 
		var ctx = this._bgCanvas.getContext("2d");		 
		var graphics= new $.Graphics(ctx);		 
		graphics.begin();
		graphics.setLineStyle(setting.calibration.lineWidth,setting.calibration.lineColor);
		graphics.setNoneFill(); 
		graphics.drawLines(pt);			
		graphics.end();	
		graphics=null;	
	}
	//c.appendTo(this._bgHolder);
}	
this._draw=function(){
	if(this._dataSource==null){
		return;
	}	 
	this._reset();	
	this._createElement();
	this._createMapping();
	this._createBgColor();//used for color slider	
	var c=this._dataSource.currentSelection;	
	this._setPosition(c.first,c.second);	
	this._createThumbnail();//used for background Thumbnail
	this._createLabel();
	this._bindEvent();
}   
this._resize=function(w,h){	 
	this._placeHolder.css({width:w,height:h});
	this._draw();	
}
};
Chart.Component.slider.prototype = {
	setData:function(da){
		this._data=da;
	},
	setDataSource: function(datasource){
		if (datasource.xRange instanceof Array) {
			datasource.xRange.sort(function(a, b){
				if (a instanceof Array) {
					a = a[0];
				}
				if (b instanceof Array) {
					b = b[0];
				}
				return a - b
			});
			var data=datasource.xRange;	 	
			datasource.xRange={data:data,first:data[0][0],second:data[data.length-1][0]}
		}
		else {
			var s = {
				first: null,
				second: null
			};
			if (typeof(datasource.xRange.x_min) != "undefined") {
				s.first = datasource.xRange.x_min;
			}
			if (typeof(datasource.xRange.x_max) != "undefined") {
				s.second = datasource.xRange.x_max;
			}
			if (typeof(datasource.xRange.xMin) != "undefined") {
				s.first = datasource.xRange.xMin;
			}
			if (typeof(datasource.xRange.xMax) != "undefined") {
				s.second = datasource.xRange.xMax;
			}
			$.extend(datasource.xRange, s);
		}
			var sc = {
				first: null,
				second: null
			};
			if (typeof(datasource.currentSelection.x_min) != "undefined") {
				sc.first = datasource.currentSelection.x_min;
			}
			if (typeof(datasource.currentSelection.x_max) != "undefined") {
				sc.second = datasource.currentSelection.x_max;
			}
			if (typeof(datasource.currentSelection.xMin) != "undefined") {
				sc.first = datasource.currentSelection.xMin;
			}
			if (typeof(datasource.currentSelection.xMax) != "undefined") {
				sc.second = datasource.currentSelection.xMax;
			}
			$.extend(datasource.currentSelection, sc);			
			this._dataSource = datasource;		
	},
	setTheme: function(jsonStr){
		$.extend(true, this._sliderThemeSettings, jsonStr);
	},
	resize: function(width, height){
		this._resize(width, height);
	},
	draw: function(){	
		this._draw();
	},
	setCallBack: function(callBack){
		if (typeof(callBack) == "function") {
			this._callBack = callBack;			 
		}
	},
	onDrag:function(fn){
		if (typeof(fn) == "function") {
			this._onDragCallBack =fn;			 
		}
	},
	onDragEnd:function(fn){
		this.setCallBack(fn);
	},
	disableEvent:function(booleanStr){
		this._interactive=booleanStr;
		this._bindEvent();
	},
	setPosition:function(left,right){
		if(typeof(left)=="number"&&typeof(right)=="number"){
		left=left<=right?left:right;
		right=right>=left?right:left;
		this._setPosition(left,right);			
		}
	} 
}