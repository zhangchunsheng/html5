if (typeof(Chart) == "undefined") {
    Chart = {};
};
if (typeof(Chart.Component) == "undefined") {

    Chart.Component = {};
    
};
Chart.Component.Coordinate = function(target){
	var target = $(target);
	var _w=target.width(),_h=target.height();
	this._HOLDER=$("<div></div>").css({
				position:"relative",
				top:0,
				left:0,
				width: _w,
				height: _h
				});
	var w, h;
	this._canvasPlaceHolder = $("<div></div>").css({
		position: "absolute",
		width: _w,
		height: _h,
		left: 0,
		top: 0
	}).appendTo(this._HOLDER);	
	this._labelPlaceHolder = $("<div></div>").css({
		position: "absolute",
		width: _w,
		height: _h,
		left: 0,
		top: 0
	}).appendTo(this._HOLDER);
	this._placeHolder = $("<div></div>").css({
		position: "relative",
		width: _w,
		height: _h,
		left: 0,
		top: 0
	}).appendTo(this._labelPlaceHolder);
	this._HOLDER.appendTo(target);	
	this._canvas = $.Canvas.create(this._canvasPlaceHolder, "absolute", 0, 0, _w, _h, "");
	this._ctx = this._canvas.getContext("2d");
	this._graph= new $.Graphics(this._ctx);
	this._initial = function(){
		var me = this;
		$.each(this._options.xaxis, function(i, v){
			var id = v.id ? v.id : (v.title ? v.title : "");
			me[[id, "_label"].join("")] = null;
		});
		$.each(this._options.yaxis, function(i, v){
			var id = v.id ? v.id : (v.title ? v.title : "");
			me[[id, "_label"].join("")] = null;
		});				
		this._placeHolder.find("div").unbind().end().html("");
		w = this._placeHolder.width(), h = this._placeHolder.height();
		this._ctx.clearRect(0,0,w,h);
		this._gridY = [];
		this._gridX = [];
		this._readyHaveLines=[];
		me=null;
	}
	this._options = {//._options.axis
		grid: {
			gridX: true,
			gridY: true,
			gridLineWidth: 1,
			gridLineColor: "#000000"
		}
	}	
	this._calculatePosition = function(){
		var xtop = 0, xbottom = 0, yleft = 0, yright = 0;
		var w;
		$.each(this._options.xaxis, function(i, v){
			if (v.position == 1) {
			
				if (typeof(v.width) == "number") {
					w = v.width < 0 ? 25 : v.width
				}
				else {
					w = 25;
				}
				xtop += w;
			}
			else {
				if (typeof(v.width) == "number") {
					w = v.width < 0 ? 25 : v.width
				}
				else {
					w = 25;
				}
				xbottom += w;
			}
		});
		$.each(this._options.yaxis, function(i, v){
			if (v.position == 1) {
				if (typeof(v.width) == "number") {
					w = v.width < 0 ? 25 : v.width
				}
				else {
					w = 25;
				}
				yleft += w;
			}
			else {
				if (typeof(v.width) == "number") {
					w = v.width < 0 ? 25 : v.width
				}
				else {
					w = 25;
				}
				yright += w;
				
			}
		});
		return {
			xtop: xtop,
			xbottom: xbottom,
			yleft: yleft,
			yright: yright
		};
		
	}
	this._createMarks = function(html, left, top, position, css){
		var font = null;
		if (typeof(css) == "undefined" || css == null) {
			font = {
				font: "normal normal normal 10px Arial, Helvetica, sans-serif",
				color: "#000000",
				overflow: "hidden"
			}
		}
		if (position == "yleft") {
			var div = $("<div></div>").html(html).css({
				"position": "absolute",
				right: w - left,
				top: top
			}).appendTo(this._placeHolder);
		}
		if (position == "yright") {
			var div = $("<div></div>").html(html).css({
				"position": "absolute",
				left: left,
				top: top
			}).appendTo(this._placeHolder);
			
		}
		if (position == "xtop") {
			var div = $("<div></div>").html(html).css({
				"position": "absolute",
				left: left,
				bottom: h - top
			}).appendTo(this._placeHolder);
			
		}
		if (position == "xbottom") {
			var div = $("<div></div>").html(html).css({
				"position": "absolute",
				left: left,
				top: top
			}).appendTo(this._placeHolder);
			
		}
		if (font != null) {
			div.css(font);
		}
		else 
			if (typeof(css) == "string") {
				div.addClass(css);
			}
			else 
				if (typeof(css) == "object") {
					css = $.extend({
						font: "normal normal normal 10px Arial, Helvetica, sans-serif",
						color: "#000000",
						overflow: "hidden"
					}, css);
					div.css(css);
				}
		return div; 
	}
	this._grapOption = function(graph, lineWidth, lineColor){
		if (typeof(lineWidth) == "undefined" || lineWidth == null) {
			lineWidth = 1;
		}
		if (typeof(lineColor) == "undefined" || lineColor == null) {
			lineColor = "#000000";
		}
		graph.setLineStyle(lineWidth, lineColor);
		graph.begin();
		
	}
	this._calculateMargin = function(i, p, aim){
		if (aim == "x") {
			aim = this._options.xaxis;
		}
		else {
			aim = this._options.yaxis;
		}
		var w, total = 0;
		for (j = 0; j <= i; j++) {
			if (aim[j].position == p) {
				if (typeof(aim[j].width) == "number") {
					w = aim[j].width < 0 ? 25 : aim[j].width;
				}
				else {
					w = 25;
				}
				total += w;
			}
		}
		return total;
	}
	this._readyHaveLines=[];
	this._plot = function(){		
		this._initial();		
		var graph =this._graph;
		var lines = [];
		var p = this._calculatePosition();
		var me = this;
		var checkXLabelOverLap = function(label){
			if (label instanceof Array) {
				var len = label.length, pointer = 0;
				var removeIndex = [];
				for (var i = 0; i < len; i++) {
					if (i == 0) {
						pointer = parseFloat(label[i].css("left").replace("px", "")) + label[i].width();
					}
					else {
						var left = parseFloat(label[i].css("left").replace("px", ""));
						if (left < pointer) {
							label[i].hide();
							removeIndex.push(i);
						}
						else {
							pointer = left + label[i].width();
						}
					}
				}
				$.each(removeIndex, function(i, value){
					label.splice(value, 1);
				});
			}
		};
		var checkYLabelOverLap = function(label){
			if (label instanceof Array) {
				var len = label.length, pointer = 0;
				var removeIndex = [];
				for (var i = 0; i < len; i++) {
					if (i == 0) {
						pointer = parseFloat(label[i].css("top").replace("px", ""));
					}
					else {
						var top = parseFloat(label[i].css("top").replace("px", "")) + label[i].height();
						if (top > pointer) {
							label[i].hide();
							removeIndex.push(i);
						}
						else {
							pointer = top - label[i].height();
						}
					}
				}
				$.each(removeIndex, function(i, value){
					label.splice(value, 1);
				});
			}
		};
		$.each(this._options.yaxis, function(i, v){
			var mapping = v.mapping;
			var padding = {
				left: 5,
				top: 5,
				lastIndentation: false
			};
			if (v.labelPadding) {
				$.extend(padding, v.labelPadding);
				if (typeof(padding.left) != "number") {
					padding.left = 5;
				}
				if (typeof(padding.top) != "number") {
					padding.top = 5;
				}
				if (typeof(padding.lastIndentation) != "boolean") {
					padding.lastIndentation = false;
				}
			}
			var removedTicks = function(){
				return false;
			};
			if (typeof(v.removedTicks) == "function") {
				removedTicks = v.removedTicks;
			}
			var shortLineWidth;//color = v.color;
			if (typeof(v.shortLineWidth) == "number") {
				shortLineWidth = v.shortLineWidth;
			}
			else {
				shortLineWidth = 5;
			}
			var labelFormat = v.labelFormat;
			v.calibration.sort(function(a, b){
				if (a instanceof Array) {
					a = a[0];
				}
				if (b instanceof Array) {
					b = b[0];
				}
				return a - b
			});
			var first = v.calibration[0], second = v.calibration[v.calibration.length - 1];
			if (first instanceof Array) {
				first = first[0];
			}
			if (second instanceof Array) {
				second = second[0];
			}
			var vmax = v.value.first > v.value.second ? v.value.first : v.value.second;
			var vmin = v.value.first < v.value.second ? v.value.first : v.value.second;
			vmax = vmax < second ? second : vmax;
			vmin = vmin > first ? first : vmin;
			mapping.setValueRange({
				first: vmax,
				second: vmin
			});
			mapping.setCoordinateRange({
				first: p.xtop,
				second: h - p.xbottom
			});
			var yid = v.id ? v.id : (v.title ? v.title : "");
			var copyCalibration = $.extend(true, [], v.calibration);
			
			if (v.position == 1) {
				var x = me._calculateMargin(i, v.position, "y");				
				me._grapOption(graph, v.lineWidth, v.lineColor);
				lines.push([x, p.xtop, x, h - p.xbottom]);
				me._readyHaveLines.push([x, p.xtop, x, h - p.xbottom].join("")); 
				$.each(v.calibration, function(j, d){
					var top;
					if (!removedTicks(j, copyCalibration)) {
						if (d instanceof Array) {
							html = d[1];
							top = mapping.getCoordinate(d[0]);
							top = top >= h ? h - 0.5 : top;
							lines.push([x - shortLineWidth, top, x, top]);
						}
						else 
							if (typeof(d) == "number") {
								html = d.toString();
								top = mapping.getCoordinate(d);
								top = top >= h ? h - 0.5 : top;
								lines.push([x - shortLineWidth, top, x, top]);
							}
						//var yid=v.id?v.id:(v.title?v.title:"");	
						if (html != "") {
							if (typeof(labelFormat) == "function") {
								html = labelFormat(html,v.decimalNum);
							}
							var t = top + padding.top;
							var l = x - padding.left;
							if ((j == v.calibration.length - 1) && padding.lastIndentation && t <= 0) {
								t = top;
							}
							if (!me[[yid, "_label"].join("")]) {
								me[[yid, "_label"].join("")] = [];
							}
							//me._createMarks(html, l, t, "yleft", v.fontCSS,"YAXIS_LABEL_"+yid);
							me[[yid, "_label"].join("")].push(me._createMarks(html, l, t, "yleft", v.fontCSS));
						}
						if (yid == me._options.grid.gridReference.y) {
							me._gridY.push(top);
						}
					}
				});
				 

				graph.drawLines(lines);

				graph.end();
				lines = [];
				
			}
			else {
				 
				var x0 = me._calculateMargin(i, v.position, "y");
				var x = w - x0 == w ? w - 0.5 : w - x0;				 
				me._grapOption(graph, v.lineWidth, v.lineColor);
				lines.push([x, p.xtop, x, h - p.xbottom]);
				me._readyHaveLines.push([x, p.xtop, x, h - p.xbottom].join("")); 
				$.each(v.calibration, function(j, d){
					var top;
					if (!removedTicks(j, copyCalibration)) {
						if (d instanceof Array) {
							html = d[1];
							top = mapping.getCoordinate(d[0]);
							top = top >= h ? h - 0.5 : top;
							lines.push([x, top, x + shortLineWidth, top]);
						}
						else 
							if (typeof(d) == "number") {
								html = d.toString();
								top = mapping.getCoordinate(d);
								top = top >= h ? h - 0.5 : top;
								lines.push([x, top, x + shortLineWidth, top]);
							}
						
						if (html != "") {
							if (typeof(labelFormat) == "function") {
								html = labelFormat(html,v.decimalNum);
							}
							var t = top + padding.top;
							var l = x + padding.left;
							if ((j == v.calibration.length - 1) && padding.lastIndentation && t <= 0) {
								t = top;
							}
							if (!me[[yid, "_label"].join("")]) {
								me[[yid, "_label"].join("")] = [];
							}
							me[[yid, "_label"].join("")].push(me._createMarks(html, l, t, "yright", v.fontCSS));
							//me._createMarks(html, l, t, "yright", v.fontCSS,"YAXIS_LABEL_"+yid);
							
						}
						
						if (yid == me._options.grid.gridReference.y) {
							me._gridY.push(top);
						}
					}
				});

				graph.drawLines(lines);

				graph.end();
				lines = [];
			}
			checkYLabelOverLap(me[[yid, "_label"].join("")]);
			
		});	
	
		$.each(this._options.xaxis, function(i, v){
			var mapping = v.mapping;
			var padding = {
				left: 5,
				top: 5,
				lastIndentation: false
			};
			if (v.labelPadding) {
				if (typeof(v.labelPadding.left) == "number") {
					padding.left = v.labelPadding.left;
				}
				if (typeof(v.labelPadding.top) == "number") {
					padding.top = v.labelPadding.top;
				}
				if (typeof(v.labelPadding.lastIndentation) == "boolean") {
					padding.lastIndentation = v.labelPadding.lastIndentation;
				}
			}
			var shortLineWidth;
			if (typeof(v.shortLineWidth) == "number") {
				shortLineWidth = v.shortLineWidth;
			}
			else {
				shortLineWidth = 5;
			}
			var removedTicks = function(){
				return false;
			};
			if (typeof(v.removedTicks) == "function") {
				removedTicks = v.removedTicks;
			}
			var labelFormat = v.labelFormat;
			v.calibration.sort(function(a, b){
				if (a instanceof Array) {
					a = a[0];
				}
				if (b instanceof Array) {
					b = b[0];
				}
				return a - b
			});
			var first = v.calibration[0], second = v.calibration[v.calibration.length - 1];
			if (first instanceof Array) {
				first = first[0];
			}
			if (second instanceof Array) {
				second = second[0];
			}
			var vmax = v.value.first > v.value.second ? v.value.first : v.value.second;
			var vmin = v.value.first < v.value.second ? v.value.first : v.value.second;
			vmax = vmax < second ? second : vmax;
			vmin = vmin > first ? first : vmin;
			mapping.setValueRange({
				first: vmin,
				second: vmax
			});
			mapping.setCoordinateRange({
				first: p.yleft,
				second: w - p.yright
			});
			var xid = v.id ? v.id : (v.title ? v.title : "");
			var copyCalibration = $.extend(true, [], v.calibration);
			if (v.position == 1) { //var y=xt*width;
				var y = me._calculateMargin(i, v.position, "x");
				 
				me._grapOption(graph, v.lineWidth, v.lineColor);
				

				lines.push([p.yleft, y, w - p.yright, y]);
				me._readyHaveLines.push([p.yleft, y, w - p.yright, y].join("")); 
				
				
				$.each(v.calibration, function(j, d){
					var left;
					if (!removedTicks(j, copyCalibration)) {
						if (d instanceof Array) {
							html = d[1];
							left = mapping.getCoordinate(d[0]);
							left = left >= w ? w - 0.5 : left;
							lines.push([left, y - shortLineWidth / 2, left, y + shortLineWidth / 2]);
						}
						else 
							if (typeof(d) == "number") {
								html = d.toString();
								left = mapping.getCoordinate(d);
								left = left >= w ? w - 0.5 : left;
								lines.push([left, y - shortLineWidth / 2, left, y + shortLineWidth / 2]);
							}
						 
						if (html != "") {
							if (typeof(labelFormat) == "function") {
								html = labelFormat(html,v.decimalNum);
							}
							var t = y - padding.top;
							var l = left + padding.left;
							if ((j == v.calibration.length - 1) && padding.lastIndentation) {
								var testDiv = $("<div></div>").html(html).css({
									position: "absolute",
									font: "normal normal normal 10px Arial, Helvetica, sans-serif",
									overflow: "hidden"
								}).appendTo(me._placeHolder);
								var selfWidth = testDiv.width();
								testDiv.remove();
								if (l + selfWidth > w - p.yright) {
									l = w - p.yright - selfWidth;
								}
							}
							if (!me[[xid, "_label"].join("")]) {
								me[[xid, "_label"].join("")] = [];
							}
							me[[xid, "_label"].join("")].push(me._createMarks(html, l, t, "xtop", v.fontCSS));
						//	me._createMarks(html, l, t, "xtop", v.fontCSS,"XAXIS_LABEL_"+xid);
						}
						if (xid == me._options.grid.gridReference.x) {
							me._gridX.push(left);
						}
					}
				});
				// x;

				graph.drawLines(lines);

				graph.end();
				lines = [];
				//var label=me[[xid,"_label"].join("")];
			
			}
			else {
				//var y=h-xb*width;
				var y = h - me._calculateMargin(i, v.position, "x");
				//  lines.push([p.yleft*width,y,w-p.yright*width,y]);
				me._grapOption(graph, v.lineWidth, v.lineColor);
				lines.push([p.yleft, y, w - p.yright, y]);				 
				me._readyHaveLines.push([p.yleft, y, w - p.yright, y].join(""));				
				$.each(v.calibration, function(j, d){
					var left;
					if (!removedTicks(j, copyCalibration)) {
						if (d instanceof Array) {
							html = d[1];
							left = mapping.getCoordinate(d[0]);
							left = left >= w ? w - 0.5 : left;
							lines.push([left, y, left, y + shortLineWidth]);
						}
						else 
							if (typeof(d) == "number") {
								html = d.toString();
								left = mapping.getCoordinate(d);
								left = left >= w ? w - 0.5 : left;
								lines.push([left, y, left, y + shortLineWidth]);
							}
						
						if (html != "") {
							if (typeof(labelFormat) == "function") {
								html = labelFormat(html,v.decimalNum);
							}
							var t = y + padding.top;
							var l = left + padding.left;
							if ((j == v.calibration.length - 1) && padding.lastIndentation) {
								var testDiv = $("<div></div>").html(html).css({
									position: "absolute",
									font: "normal normal normal 10px Arial, Helvetica, sans-serif",
									overflow: "hidden"
								}).appendTo(me._placeHolder);
								var selfWidth = testDiv.width();
								testDiv.remove();
								if (l + selfWidth > w - p.yright) {
									l = w - p.yright - selfWidth;
								}
							}
							if (!me[[xid, "_label"].join("")]) {
								me[[xid, "_label"].join("")] = [];
							}
							me[[xid, "_label"].join("")].push(me._createMarks(html, l, t, "xbottom", v.fontCSS));
						//	me._createMarks(html, l, t, "xbottom", v.fontCSS,"XAXIS_LABEL_"+xid);
						}
						if (xid == me._options.grid.gridReference.x) {
							me._gridX.push(left);
						}
					}
				});
				// xb++;	

				graph.drawLines(lines);

				graph.end();
				lines = [];
				
			}
			checkXLabelOverLap(me[[xid, "_label"].join("")]);
			
		});
		var grid = [];
		
		if (this._options.grid.gridX) {
			$.each(this._gridX, function(index, data){
				data = data == w ? w - 0.5 : data;
				var lines=[data, p.xtop, data, h - p.xbottom];
				 
				if($.inArray(lines.join(""),me._readyHaveLines)==-1){
				grid.push(lines);
				}
				
			});
		}
		if (this._options.grid.gridY) {
			$.each(this._gridY, function(index, data){
				var lines=[p.yleft, data, w - p.yright, data];
				 
				if($.inArray(lines.join(""),me._readyHaveLines)==-1){
				grid.push(lines);
				}			
			});
		}		
		graph.setLineStyle(this._options.grid.gridLineWidth, this._options.grid.gridLineColor);
		graph.begin();
		graph.drawLines(grid);
		graph.end();
		me._readyHaveLines=[];
		p = me = grid = graph =null;
		
	}
	this._checkOptions = function(options){
		var er = {
			correct: false,
			error: null
		};
		if (!options.id) {
			er.error = "options need attribute 'id'";
			return er;
		}
		if (!options.position) {
			er.error = "options need attribute 'position'";
			return er;
		}
		if (options.position != 1 && options.position != 2) {
			er.error = "attribute 'position' set to a wrong number";
			return er;
		}
		if (typeof(options.value.first) != "number" || typeof(options.value.second) != "number") {
			er.error = "attribute 'value' set to wrong";
			return er;
		}
		if (!(options.calibration instanceof Array)) {
			er.error = "attribute 'calibration' set to wrong,must be an array";
			return er;
		}
		if (typeof(options.mapping) != "object") {
			er.error = "attribute 'mapping' set to wrong,must be an object";
			return er;
		}
		er.correct = true;
		return er;
	}
	this._refresh = function(){
		this._plot();
	}
	this._reset = function(width, height){
		var css = {
			width: width,
			height: height
		};
		this._HOLDER.css(css);
		this._labelPlaceHolder.css(css);
		this._canvasPlaceHolder.css(css);
		this._canvas.width = width;
		this._canvas.height = height;
		$(this._canvas).css(css);
		this._placeHolder.css(css);
		
	}
	this._highLight = function(json){
		var ptc = [];
		var sp = [];
		$.each(json.pt, function(i, v){
			if (v instanceof Array) {
				$.each(v, function(j, d){
					sp.push({
						x: json.xmapping.getCoordinate(d.x),
						y: json.ymapping.getCoordinate(d.y)
					});
					
				});
				ptc.push(sp);
			}
			else {
				sp.push({
					x: json.xmapping.getCoordinate(v.x),
					y: json.ymapping.getCoordinate(v.y)
				});
				ptc.push(sp);
			}
		});
		
		var graph = new $.Graphics(this._ctx);
		graph.setLineStyle(0, "");
		graph.setNormalFill(json.fillColor, json.alpha ? json.alpha : 0.5);
		graph.begin();
		$.each(ptc, function(i, data){
		
			graph.drawPolygon(data);
		})
		
		graph.end();
		
	}
}
Chart.Component.Coordinate.prototype = {
    setOptions: function(json){
        if (typeof(json) == "object") {
            this._options = $.extend(this._options, json);
        }
    },    
    draw: function(){
        this._plot();
		
    },
    resize: function(w, h){
        if (w > 0 && h > 0) {
            this._reset(w, h);
            this._plot();
        }
    },
	addAxis:function(axis,options){
		axis=axis.toLowerCase();
		var ax=null;
		if(axis=="x"){
			ax=this._options.xaxis;
		}
		else if(axis=="y"){
			ax=this._options.yaxis;
		}
		else{
			alert("invalid arguments:"+axis);
			return false;
		}
		var er=this._checkOptions(options);
		if (er.correct) {
				ax.splice(0, 0, options);
				this._plot();
				return true;
		}
		else{
			alert("invalid arguments:options,"+er.error);
			return false;				
		}		
	},
	removeAxis:function(axis,id){
		axis=axis.toLowerCase();
		var ax=null;
		if(axis=="x"){
			ax=this._options.xaxis;
		}
		else if(axis=="y"){
			ax=this._options.yaxis;
		}
		else{
			alert("invalid arguments:"+axis);
			return false;
		}
		var num=null;
		for(var i=0;i<ax.length;i++){
			if(ax[i].id==id){
			num=i;break;	
			}
		}
		if(num!=null){
		 ax.splice(num, 1);
		 this._plot();
		 return true;			
		}
		else{
			alert("invalid arguments:axis '"+id+"' not found");
			return false;
		}		
	},
	changeAxisStyle:function(axis,axisId,cssName,lineColor){
		axis=axis.toLowerCase();
		var ax=null;
		if(axis=="x"){
			ax=this._options.xaxis;
		}
		else if(axis=="y"){
			ax=this._options.yaxis;
		}
		else{
			alert("invalid arguments:"+axis);
			return false;
		}
		var num=null;
		for(var i=0;i<ax.length;i++){
			if(ax[i].id==axisId){
			num=i;break;	
			}
		}
		if(num!=null){
			if(typeof(lineColor)!="undefined"){
				ax[num].lineColor=lineColor;
			}
			if(typeof(cssName)!="undefined"){
				ax[num].fontCSS=cssName;
			}			
		 	this._plot();
			return true;			
		}
		else{
			alert("invalid arguments:axis '"+axisId+"' not found");
			return false;
		}		
	},
	getOptions:function(){
		return this._options;
	},
    getCanvas: function(){
        return this._canvas;
    },
	getGraphArea:function(){
		return $.extend(this._calculatePosition(),{
			w:this._placeHolder.width(),
			h:this._placeHolder.height()});
	},
	getLabel:function(id){
		return this[[id,"_label"].join("")];
		},
    highLight: function(json){
        this._highLight(json);
    },
	refresh:function(){this._refresh();}
}
Chart.Component.Coordinate.prototype.constructor =Chart.Component.Coordinate;