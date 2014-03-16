//include excanvas.min.js
//include jquery-1.4.2.min.js
//include jquery.colorhelpers.js
//include jquery.json.js
//include extendmethod.js
//include graphics.js
//include mstarchartcommon.js
//include mapping.js
//include coordinate.js
//include divisionCoordinate.js
//include icon.js
//include seriesGraph.js
Chart.AAGraph = function(target){
	this._pointer = new Chart.seriesGraph(target);
	this._data = null;
	this._styleData = null;
	this._title = null;
	this._legend = null;
	this._slider = null;
	this._adapter = function(){
		this._pData = [];
		var me = this;
		$.each(this._styleData, function(i, v){
			var s = $.extend(true, {}, v);
			for (var i = 0; i < v.type.length; i++) {				
					var obj=$.extend(true,{},v.style);					
					s[v.type[i]] = obj;				
			}
			s.type = undefined;
			s.style = undefined;
			me._pData.push(s);
		});
		$.each(this._data, function(i, v){
			for (var i = 0; i < me._pData.length; i++) {
				if (v.id == me._pData[i].id) {
					me._pData[i].data = v.data;
					break;
				}
			}
		});		
		this._pointer.setData(this._pData);
	}
} 
Chart.AAGraph.prototype = {
	setOptions: function(options){
		this._pointer.setOptions(options);
		return this;
	},	
	setStyle: function(style){
		if (style instanceof Array) {
			this._styleData = style;
		}
		return this;
	},
	setData: function(data){
		if (data instanceof Array) {
			this._data = data;
		}
		return this;
	},
	draw: function(){
		this._adapter();
		this._pointer.draw();
		return this;
	},
	setRangeColor: function(data, color){
		this._pointer.setRangeColor(data, color);
		return this;
	},
	setAxisSegment: function(type, fn){
		this._pointer.setAxisSegment(type, fn);
		return this;
	},
	reorder: function(data){
		this._pointer.reorder(data);
		return this;
	},
	fireClick:function(e,fn){
		this._pointer.fireClick(e,fn);
		return this;		
	},
	fireEvent:function(e,type){
		this._pointer.fireEvent(e,type);
		return this;			
	},
	reMapping:function(l,r){
		this._pointer.reMapping(l,r);
		return this;		
	},
	bind: function(type, fn){
		this._pointer.bind(type, fn);
		return this;
	},
	unbind: function(type){
		this._pointer.unbind(type);
		return this;
	},
	changeAxisStyle: function(axis, axisTitle, cssName, lineColor){
		this._pointer.changeAxisStyle(axis, axisTitle, cssName, lineColor);
		return this;
	},
	removeAxis: function(axisID){
		this._pointer.removeAxis(axisID);
		return this;
	},
	addAxis: function(axisOptions, dataOptions){
		this._pointer.addAxis(axisOptions, dataOptions);
		return this;
	},
	resize: function(width, height){
		this._pointer.resize(width, height);
		return this;
	},
	getObj: function(id, type, op, data){
		return this._pointer.getObj(id, type, op, data);
	},
	getCalibration: function(){
		return this._pointer.getCalibration();
	},
	getGraphArea: function(){
		return this._pointer.getGraphArea();
	},
	getGraphHolder: function(){
		return this._pointer.getGraphHolder();
	},
	getLabel:function(id){
		return this._pointer.getLabel(id);
		},
	getSupportType:function(){
		return this._pointer.getSupportType();
		},
	setBackground: function(str){
		this._pointer.setBackground(str);
		return this;
		},
	removeBackground: function(str){
		this._pointer.removeBackground(str);
		return this;
	},
	setSearchMethod:function(str){
		this._pointer.setSearchMethod(str);
		return this;
	}	
}	

