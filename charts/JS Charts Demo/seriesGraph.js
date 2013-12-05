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
Chart.seriesGraph = function(target){
	var _w=target.width()||800,_h=target.height()||300;
	this._placeHolder = $($.Canvas.createDiv(target, "relative", 0, 0, _w, _h)).css({
		"position": "relative", 
		"cursor": "default"
	});	 
	this._bgCanvas = $.Canvas.create(this._placeHolder, "absolute", 0, 0, _w, _h);
	this._coordinate = new Chart.Component.Coordinate(this._placeHolder); 
	this._graphCanvas = $.Canvas.create(this._placeHolder, "absolute", 0, 0,_w, _h);
	this._moveHolder=$("<div></div>").css({
							position:"absolute",
							width:_w,
							height:_h,							
							left:0,top:0}).appendTo(this._placeHolder);	
	this._w=_w;this._h=_h;						 
	this.ctx=this._graphCanvas.getContext("2d");		
	this._resetAxisOption = function(){
		this._yaxisOptions = {
			id: null,
			position:null,
			value: {
				first: null,
				second: null
			},
			decimalNum:0,
			firstLabel:true,
			lastLabel:true,
			calibration: null,
			mapping: null,
			labelPadding: {
				left: 5,
				top: 5
			},
			labelFormat:null,
			shortLineWidth: 4,
			width: 25,			
			lineColor: "#000000"
		};
		this._xaxisOptions = {
			id: null,
			position: null,
			calibration: null,
			value: {
				first: null,
				second: null
			},
			mapping: null,
			labelFormat:null,			
			shortLineWidth: 4,
			width: 25,
			decimalNum:0,
			type:"number"
		};
		this._gridOptions = {
			gridReference: {
				x: null,
				y: null
			},
			gridX: false,
			gridY: true
		}; 
		this._op=null;
		this._isCustomCalibrationX=[];
		this._isCustomCalibrationY=[];					
	};
	this._coordinateOption={xaxis:null,yaxis:null,grid:null};
	this._data=[];	 
	this._op=null;
	this._xSegmentMethod=null;
	this._ySegmentMethod=null;
	this._SearchMethod=null;
	var main=this;
	this.statckedYmaxvalue=[];
	this._fixedOptions=function(){ 
		  $.each(this._coordinateOption.xaxis,function(i,v){
		  	if(v.position==null){v.position=2;}
			if(v.id==null){v.id="xaxis_"+i;}
		  });
		  $.each(this._coordinateOption.yaxis,function(i,v){
		  	if(v.position==null){v.position=1;}
			if(v.id==null){v.id="yaxis_"+i;}
		  }); 
	};	
		/*
		 * this._setOptions method
 		 * @param op {object} fromat like below.
 		 * @return undefined.
		xaxis: [{
			id:"x1",//axis id required			
			calibration: [[0, 'Jan'], [1, 'Feb'], [2, 'Mar'], [3, 'Apr'], [4, 'May'], [5, 'Jun'], [6, 'Jul'], [7, 'Aug'], [8, 'Sep'], [9, 'Oct'], [10, 'Nov'], [11, 'Dec']],
			width: 25,
			labelPadding: {
				left: -15
			}
		}],
		yaxis:[{
			id:"y1",//axis id required	
			width: 50,
			shortLineWidth: 50,
			labelPadding: {
				left: 25
			}
		},{
			id:"y2", //axis id required	 
			position:2,
			width:30,
			fontCSS:"STYLE1",//axis label css name
			lineColor:"#FF0000"
		}],
		grid: {
			gridX: true,
			gridY: true,
			gridReference: {
				x: "x1",//xaxis id  
				y: "y1"//yaxis id
			}
			 
		}	
	
		*/    
	this._setOptions=function(op){
		this._resetAxisOption();
		this._op=$.extend(true,{},op);
		var op=this._op;
		if(op.xaxis instanceof Array){
			for(var i=0;i<op.xaxis.length;i++){
				op.xaxis[i].mapping=new Chart.Common.Util.Double2DoubleLinearMapping();
				op.xaxis[i]=$.extend(true,{},this._xaxisOptions,op.xaxis[i]);
				if(op.xaxis[i].calibration!=null){
					this._isCustomCalibrationX.push(op.xaxis[i].id);
				}
			}
			this._coordinateOption.xaxis=op.xaxis;
		}
		if(op.yaxis instanceof Array){			
			for(var i=0;i<op.yaxis.length;i++){
				if(op.yaxis[i].mode==0){
					op.yaxis[i].mapping=new Chart.Common.Util.Double2DoubleLogMapping();					
				}
				else{
					op.yaxis[i].mapping=new Chart.Common.Util.Double2DoubleLinearMapping();
				}
				op.yaxis[i]=$.extend(true,{},this._yaxisOptions,op.yaxis[i]);
				if(op.yaxis[i].calibration!=null){
					this._isCustomCalibrationY.push(op.yaxis[i].id);
				}				
			} 
			this._coordinateOption.yaxis=op.yaxis;
		}
		if(op.grid){
		   this._coordinateOption.grid=$.extend(true,{},this._gridOptions,op.grid);	
		} 
		this._fixedOptions();
		i=null; 
	};
	this._resetData=function(){
		 this._data=this.statckedYmaxvalue=null;
		 this._data=[];		 
		 this.statckedYmaxvalue=[];
		 var ft=this._firstSubIndex,
			sd=this._secondSubIndex,
			isReMapping=false;
		if(typeof(ft)=="number"&&typeof(sd)=="number"){
			isReMapping=true;
		};
		var me=this;
		//console.log(me._isCustomCalibrationX);
		//console.log(me._isCustomCalibrationY);
		 $.each(this._coordinateOption.xaxis,function(i,v){
			if ($.inArray(v.id, me._isCustomCalibrationX) == -1) {
				v.calibration = null;
			}			
			if(!isReMapping){
				v.value.first=null;
				v.value.second=null;				
			}
		 });		 
		 $.each(this._coordinateOption.yaxis,function(i,v){			
			if ($.inArray(v.id, me._isCustomCalibrationY) == -1) {
				v.calibration = null;
			}	
			v.value.first=null;
			v.value.second=null;			 		 	
		 });
	};
	this._child=[];
	this._supportType=[];
    this._extendMethod=function(s){
			$.extend(s,{
				getData:function(){return this.data;},
				/*
 				 * @param data {Array} fromat like below.
 				 * data=[[0,"",12],[1,"C",12]...]
 				 * @return undefined.
 		        * */
				changeData:function(data){
					if(data instanceof Array){
						this.data=data;
						if(this.customerData&&this.customerData.data){							
							this.customerData.data=data;
						}
						main._setOptions(main._op);
						main._setData(main._data);
						main._draw();
					}					
				},
				/*
 				 * @param type {string} options {object}.
 				 * eg addShape("dot",{show:true,...});
 				 * @return undefined.
 		        * */				
				addShape: function(type,options){
				type=type.toLowerCase();
				this[type]=options;
				if (this.customerData&&this.customerData.op) {
					this.customerData.op.type.push(type);
					$.extend(this.customerData.op.style, options);
				}
				main._extendOptions(this);
				main.refresh();				
/*
				switch(type){
					case "dot":
					$.extend(this,{dot:options});
					if(this.customerData.op){
						this.customerData.op.type.push("dot");
						$.extend(this.customerData.op.style,options);
					}					
					main._extendOptions(this);
					main.refresh();
					break;
					case "line":
					$.extend(this,{line:options});
					if(this.customerData.op){
						this.customerData.op.type.push("line");
						$.extend(this.customerData.op.style,options);
					}						
					main._extendOptions(this);
					main.refresh();
					break;
					case "bar":
					$.extend(this,{bar:options});
					if(this.customerData.op){
						this.customerData.op.type.push("bar");
						$.extend(this.customerData.op.style,options);
					}					
					main._extendOptions(this);
					main.refresh();
					break;
					default:alert("invalid arguments:"+type);										
				} 
*/
				},
				removeShape: function(type){
					type=type.toLowerCase();
					this[type]=undefined;
					if (this.customerData&&this.customerData.op) {
						var t = this.customerData.op.type;
						for (var i = 0; i < t.length; i++) {
							if (t[i] == type) {
								t.splice(i, 1);
								break;
							}
						}
						
					}							
					main.refresh();					
/*
					switch(type){
						case "dot":
						this.dot=undefined;
						if(this.customerData.op){
							var t=this.customerData.op.type;
							for(var i=0;i<t.length;i++){
								if(t[i]=="dot"){
									t.splice(i,1);
									break;
								}
							}
						 
						}							
						main.refresh();
						break;
						case "line":
						this.line=undefined;
						if(this.customerData.op){
							var t=this.customerData.op.type;
							for(var i=0;i<t.length;i++){
								if(t[i]=="line"){
									t.splice(i,1);
									break;
								}
							}
						 
						}							
						main.refresh();
						break;
						case "bar":
						this.bar=undefined;
						if(this.customerData.op){
							var t=this.customerData.op.type;
							for(var i=0;i<t.length;i++){
								if(t[i]=="bar"){
									t.splice(i,1);
									break;
								}
							}
						 
						}							
						main.refresh();
						break;
						default:alert("invalid arguments:"+type);										
					}
*/				
				},
				changeShape: function(type,newType,newOption){
					type=type.toLowerCase();
 			        this.removeShape(type);
					this.addShape(newType,newOption);
				},
				attr:function(option){
					if(this.type!="undefined"){
						if(option=="style"){
							var s=$.extend(true,{},this[this.type]);
							s.show=undefined;
							return s;
						}
						else if(typeof(option)=="string"&&this[this.type]){
							return this[this.type][option];
						}
						else if(typeof(option)=="undefined"&&this[this.type]){
							return this[this.type];
						}
						else if(typeof(option)=="object"&&this[this.type]){
							$.extend(true,this[this.type],option);
							if(this.customerData&&this.customerData.op){
								$.extend(this.customerData.op.style,option);	
							}							
							main.refresh();
						}						
					}
				}
				
			});			
	};
	this._mathchMapping=function(s){
		if (s.axis.x && s.axis.y) {
		  $.each(this._coordinateOption.xaxis,function(i,v){		  	 
			if(v.id==s.axis.x){
				$.extend(s,{xmapping:v.mapping}); 
				return false;
				}
		  });
		  $.each(this._coordinateOption.yaxis,function(i,v){
		  	if(v.id==s.axis.y){
				$.extend(s,{ymapping:v.mapping});
				return false;
				}
		  }); 			
		}
	};
	this._findMaxData=function(datum){
			if (datum == null || datum.data == null || datum.data.length < 1) {
				datum.minX = 0;
				datum.maxX = 0;
				datum.minY = 0;
				datum.maxY = 0;
				return;
			}
			datum.maxX = datum.maxY = -Number.MAX_VALUE;
			datum.minX = datum.minY = Number.MAX_VALUE;
			var datumItem = null;
			var isnum=false,len=datum.data.length;
			for (var i = 0; i < len; i++) {
				datumItem = datum.data[i];
				if (datumItem instanceof Array) {
					if (isNaN(datumItem[2])) 
						continue;					
					datum.maxY = datumItem[2] > datum.maxY ? datumItem[2] : datum.maxY;
					datum.minY = datumItem[2] < datum.minY ? datumItem[2] : datum.minY;					
					datum.minX = datumItem[0] < datum.minX ? datumItem[0] : datum.minX;
					datum.maxX = datumItem[0] > datum.maxX ? datumItem[0] : datum.maxX;
				}
				else 
					if (typeof(datumItem) == "number") {
					    isnum=true;
						datum.maxY = datumItem > datum.maxY ? datumItem : datum.maxY;
						datum.minY = datumItem < datum.minY ? datumItem : datum.minY;
						
					}
			}
			if (isnum) {
				datum.minX = 0;
				datum.maxX = len - 1;
			}
			i=null;					
	};
	this._initPlugins=function(){
		this._child=[];	
		var checkPlugins=function(obj){
			if(!obj){return false;}			
			if(typeof(obj)!="object"){
				return false;
			}
			if(typeof(obj.extendOptions)!="function"){
				return false;
			}
			if(typeof(obj.plot)!="function"){
				return false;
			}
			if(typeof(obj.mousemove)!="function"){
				return false;
			}
			if(typeof(obj.click)!="function"){
				return false;
			}
			if(typeof(obj.mousedown)!="function"){
				return false;
			}
			return true;													
		};	
		var plugins=Chart.seriesGraph.plugins;
		for(var obj in plugins){			
			var result=checkPlugins(plugins[obj]);
			if (result) {
				this._supportType.push(obj);
				this._child.push(plugins[obj]);
			}			
		}
		plugins=obj=result=null;		
	};
	this._extendOptions=function(s){
		var l=this._child.length;
		for(var i=0;i<l;i++){
			this._child[i].extendOptions(s);
		}
		l=null;		
	}; 
	this._findStatckedYmaxvalue = function(s){
		var me = this;
		if ((s.stackedArea && s.stackedArea.show) || (s.percentageArea && s.percentageArea.show)) {
			if (this.statckedYmaxvalue.length == 0) {
				this.statckedYmaxvalue = $.extend(true, [], s.data);
				return;
			}
			$.each(s.data, function(i, v){
				me.statckedYmaxvalue[i][2] += v[2];
			});
		}
		me=null;
	}; 
	this._sortData=function(){
		this._data.sort(function(a,b){
			return a.index-b.index;
		});	
	};
	/*
 	* @param data {object} fromat like below.
 	* @return undefined.
     [{
	 id:"data1",
	 name:"USA",
	 data: [[0, "Jan", 7.0], [1, "Feb", 6.9], [2, "Mar", 9.5], [3, "Apr", 14.5],
	  [4, "May", 18.2], [5, "Jun", 21.5], [6, "Jul", 25.2], [7, "Aug", 26.5], 
	  [8, "Sep", 23.3], [9, "Oct", 18.3], [10, "Nov", 13.9], [11, "Dec", 9.6]],
	  axis:{
			x: "x1",//xaxis id 
			y: "y1"//yaxis id 
		} ,
	 line:{show:true,lineWidth:1,lineColor:"#FF0000"},
	 dot:{show:true,...}
	 bar:{show:false,....}	
	}]
	*/	
	this._setData=function(data){
		var checkData = function(data){			 
			if (!($.isArray(data)) || data.length == 0) {			
				return false;
			}
			var re=true;
			$.each(data,function(i,s){
				var t=true;
				if(s.data.length==0){
						return;
					}				
				$.each(s.data,function(j,da){
					if(da.length!=3){
						re=false;
						t=false;
						return false;						
					}
					if(typeof(da[0])!="number"){
						re=false;
						t=false;
						return false;
					}
					if(typeof(da[2])!="number"&&da[2]!=="NaN"){
						re=false;
						t=false;
						return false;
					}					
				});
				if(!t){
					return false;
				}
			});
			
			return re;			 
		};
		if(!checkData(data)){						
			return; 
		}
		else{
			this._resetData(); 
			var me=this;
			var l=data.length;
			for(var i=0;i<l;i++){
				var s=data[i];
				if (s.axis.x&&s.axis.y&&s.data.length>0) {
					me._extendMethod(s);
					me._mathchMapping(s);
					me._findMaxData(s);
					me._extendOptions(s);
					me._findStatckedYmaxvalue(s);
					$.extend(s,{index:i});
					me._data.push(s);
				}				
			}
			i=l=me=null; 
		}
 	this._recalculateMaxValue();
	this._sortData();   	
    };
	this._recalculateMaxValue=function(){
     var stacked=this.statckedYmaxvalue;
	 if(stacked.length>0){
	 	var ymax=null;
		$.each(stacked, function(i, v){
	 		        if(ymax==null){ymax=v[2];return;}
					ymax = v[2] >= ymax ? v[2] : ymax;
				});
	 	$.each(this._data,function(i,s){s.maxY=ymax;});
	 }
	};	
	this._getCalibration=function(value,axis){
		var reca=null;
		if(axis=="y"){ 
			reca=(new adjustValueRange()).getRange(value,value.count);			
		}
		else if(axis=="x"){
			if(typeof(value.count)=="undefined"){
				value.count=Math.floor(this._placeHolder.width() / 60);
			}
			var c =(new adjustValueRange()).getRange(value,value.count);
			var step = c[1] - c[0];
			var ca = [Math.floor(value.first)];// some issue here,In most cases no problem
			for (i = 0; i < c.length; i++) {
							if (c[i] > value.first && c[i] < value.second) {
								ca.push(c[i]);
							}
						}
			ca.push(Math.ceil(value.second));// some issue here,In most cases no problem
/*
			 if (ca[1] - ca[0] < 0.5 * step) {
							ca.splice(1, 1);
						}
			 if (ca[ca.length - 1] - ca[ca.length - 2] < 0.5 * step) {
							ca.splice(ca.length - 2, 1);
						}
*/
			reca=ca;			
		}
/*
	 for (var i = 0; i < reca.length; i++) {
		 if (typeof(reca[i]) == "number") {
			 reca[i] = [reca[i], StrFormatter.getFormattedNumString(reca[i], "", decimalNum, true)];
		  }
		}
*/
	 return reca;					
	};
	this._findaxisValue=function(id,axis,value){
		var re={first:null,second:null,data:[]};
		if (axis == "y") {
			$.each(this._data,function(i,s){
				if (s.axis.y == id) {				
					  if(re.first==null){
					  	re.first=s.minY;
					    re.second=s.maxY;
					   }
					   else{
					  	re.first=re.first>s.minY?s.minY:re.first;
					    re.second=re.second<s.maxY?s.maxY:re.second;					   	
					   }
					
				}
			});
		}
		else if(axis=="x"){
			var findMaxLengthIndex=function(a,b){
				$.each(b,function(){
					a.push(this[0]);
				});
			};
			$.each(this._data,function(i,s){
				if (s.axis.x == id) { 
					  if(re.first==null){
					  	re.first=s.minX;
					    re.second=s.maxX;						 
					   }
					   else{
					  	re.first=re.first>s.minX?s.minX:re.first;
					    re.second=re.second<s.maxX?s.maxX:re.second;						 				   	
					   }
					  findMaxLengthIndex(re.data,s.data);					  					 
				}				
			});
			re.data.sort(function(a,b){return a-b;});
			var delRepeat = function(data){
				var newArray = [];
				var provisionalTable = {};
				for (var i = 0, item; (item = data[i]) != null; i++) {
					if (!provisionalTable[item]) {
						newArray.push(item);
						provisionalTable[item] = true;
					}
				}
				provisionalTable=null;
				return newArray;
			};
			re.data= delRepeat(re.data);
			if(typeof(value)!="undefined"){
				var newData=[];
				$.each(re.data,function(i,s){
							if(s>=value.first&&s<=value.second){
								newData.push(s);
								}			
							});
				re.data=newData;
			}			
		}
		return re;
	};
	this._checkCoordinateOption=function(){
		  var me=this;
		  var result=true;
		  $.each(this._coordinateOption.xaxis,function(i,v){
		  	var firstSecond=null;
			 if(v.value.first==null){
			 	firstSecond=me._findaxisValue(v.id,"x");
			 	v.value.first=firstSecond.first;
			 }
			 if(v.value.second==null){
			 	if(firstSecond==null){
					firstSecond=me._findaxisValue(v.id,"x");
				}
			 	v.value.second=firstSecond.second;
			 }
			 if(v.calibration==null&&v.value.first!=null&&v.value.second!=null){
				 if (me._xSegmentMethod != null) {
					var count=Math.floor(me._placeHolder.width() / 60);
					if(firstSecond==null){
						firstSecond=me._findaxisValue(v.id,"x",v.value);
					}					
					v.calibration =me._xSegmentMethod(firstSecond.data,count,v.type,me._placeHolder.width());
				}
				else {
					if(v.type=="dateTime"){
					 alert("can't find a SegmentMethod,program will process xaxis as number!");	
					}					
					v.calibration = me._getCalibration(v.value, "x");
				}
			 }
			 if(v.value.first==null||v.value.second==null||v.calibration==null){
			 	result=false;
			 	return false;
				}
		  });
		  $.each(this._coordinateOption.yaxis,function(i,v){
			   var yValueFisrtSecond=null;										 
			 if(v.value.first==null){
				 yValueFisrtSecond=me._findaxisValue(v.id,"y");
			 	v.value.first=yValueFisrtSecond.first;
			 }
			 if(v.value.second==null){
				 if(yValueFisrtSecond!=null){
					v.value.second=yValueFisrtSecond.second; 
				 }else{
					v.value.second=me._findaxisValue(v.id,"y").second;	 
				  }			 	
			 }
			 if(v.calibration==null&&v.value.first!=null&&v.value.second!=null){
				 
			 	if (me._ySegmentMethod != null) {
					var count = Math.floor(me._placeHolder.height() /50);
					v.calibration = me._ySegmentMethod(v.value, count);
				}
				else {
					v.calibration = me._getCalibration(v.value, "y");
					var len=v.calibration.length;
					if(v.calibration[len-1]==v.value.second){						
						v.calibration.push(v.value.second+(v.calibration[1]-v.calibration[0]));
						}
					if(v.mode==0){
						for(var i=0;i<len;i++){
							if(v.calibration[i]<=0){
								v.calibration[i]=1;
								}
							}
						}
					if(v.firstLabel===false){
						v.calibration[0]=[v.calibration[0],""];
						}
					if(v.lastLabel===false){
						var len=v.calibration.length-1;
						v.calibration[len]=[v.calibration[len],""];
						len=null;
						}	
				}			
			 }
			 if(v.value.first==null||v.value.second==null||v.calibration==null){
			 	result=false;
			 	return false;
				}			 			 		
		  }); 
		  return result;		
	};
	this._generatePt=function(){
		var result=true;
		$.each(this._data,function(i,s){
			s.pt=null;
			var pt=[];
			var xmapping=s.xmapping;
			var ymapping=s.ymapping;
			var xrange=xmapping.getValueRange(),yrange=ymapping.getValueRange();
			//console.log("xrange={first:"+xrange.first+" second:"+xrange.second);
			//console.log("valuerange={first:"+xmapping.getValueRange().first+" second:"+xmapping.getValueRange().second);
			$.each(s.data,function(j,v){
				if(v[0]<xrange.first||v[0]>xrange.second){
					return;
				}
				if(typeof(v[2])=="number"){
					
					var x0=xmapping.getCoordinate(v[0]),y0=ymapping.getCoordinate(v[2]);
					
					//if (x0 >= xrange.first && x0 <= xrange.second && y0 >= yrange.first && y0 <= yrange.second) {}
					pt.push({x:x0,y:y0});
					//console.log(x0+" y0 "+y0+" first:"+xrange.first+" f:"+xmapping.getValueRange().first);
											
				}
				else if(v[2]==="NaN"){
					var x0=xmapping.getCoordinate(v[0]);
					//if (x0 >= xrange.first && x0 <= xrange.second) {					}
						pt.push({x:x0,y:null});
										
				}				
			});
			if(pt.length==0){
				result=false;
				return false;
			}
			s.pt=pt;
			pt=null;
		});
		return result;
	};
	this._plot=function(){
		var res=this._generatePt();
		if(!res){
			return;
		}
		var w=$(this._graphCanvas).width();
		var h=$(this._graphCanvas).height();
		var me=this;		
		this.ctx.clearRect(0, 0,w,h);
		var graphics = new $.Graphics(this.ctx);
		$.each(this._child,function(j,ch){
				ch.plot(graphics,me._data,me._graphCanvas);
			});							
		graphics=me=w=h=null; 	
	};
	this._draw=function(){
		var result=this._checkCoordinateOption();
		if (result) {
			this._coordinate.setOptions(this._coordinateOption);
			this._coordinate.draw();					
			this._plot();
		}
	};
 
	this._findData=function(pt){
		var res=[];
		var findX=function(s){
			var re=null;
			var data = s.pt;
			var start = 0;
			var end = data.length - 1;
			var d = index = null;
			while (end - start >= 2) {
				var mid = start + Math.floor((end - start) / 2);
				if (data[mid].x < pt.x) {
					start = mid;
				}
				else {
					end = mid;
				}
			}
			if (end - start < 2) {
				var ds = (data[start].x - pt.x) * (data[start].x - pt.x) + (data[start].y - pt.y) * (data[start].y - pt.y);
				var de = (data[end].x - pt.x) * (data[end].x - pt.x) + (data[end].y - pt.y) * (data[end].y - pt.y);
				var xs=(data[start].x - pt.x) * (data[start].x - pt.x);
				var xe=(data[end].x - pt.x) * (data[end].x - pt.x);
				re={};
				re.ds=ds;re.de=de;re.xs=xs;re.xe=xe;re.start=start;re.end=end;
			}
			return re;				
		};
		$.each(this._data,function(i,s){
		 	var dis=findX(s);
 			res.push(dis);
		});
		return res;
	};
	this.click=function(event){
		var fn=event.data?event.data.fn:main.click_fn;
		var pt = $.getPosition(main._placeHolder,event);
		var correspondData=main._findData(pt),
			fired=false,
			ft=main._firstSubIndex,
			sd=main._secondSubIndex,
			isReMapping=false;
		if(typeof(ft)=="number"&&typeof(sd)=="number"){
			isReMapping=true;
		}
		var data=$.extend(true,[],main._data);
		if (isReMapping) {
			$.each(data,function(i,s){
				s.data = s.data.slice(ft, sd + 1);
			});			
		}			
		$.each(main._child,function(i,obj){ 	
			var t=obj.click(pt,data,correspondData);
			if(t!=null){
				fn(t);
				fired=true;
				return false;
			}
		});
		if(fired===false){
		 fn(null);	
		}
	};
	this.mousemove=function(event){
		var fn=event.data?event.data.fn:main.mousemove_fn;
		var pt = $.getPosition(main._placeHolder,event);
		var correspondData=main._findData(pt),
			re=[],
			searchMethod=main._SearchMethod,
			ft=main._firstSubIndex,
			sd=main._secondSubIndex,
			isReMapping=false;
		if(typeof(ft)=="number"&&typeof(sd)=="number"){
			isReMapping=true;
		}
		var data=$.extend(true,[],main._data);
		if (isReMapping) {
			$.each(data,function(i,s){
				s.data = s.data.slice(ft, sd + 1);
			});
		}			
		$.each(main._child,function(i,obj){				
			var t=obj.mousemove(pt,data,correspondData,searchMethod);
			if ($.isArray(t)&&t.length > 0) {
				re = re.concat(t);
			}
		});
		if(re.length>0){
			fn(re);
		}		
	};
	this.mousedown = function(event){	 
		main.click(event);
	};
	this._initPlugins();
}
Chart.seriesGraph.prototype = {
	setData: function(data){
		 this._setData(data);
	},
	setOptions: function(options){
		 this._setOptions(options);
	},
	resize: function(w, h){
		this._w=w;this._h=h;
		this._placeHolder.css({width:w,height:h});
		this._coordinate.resize(w,h);
		this._bgCanvas.width=w;
		this._bgCanvas.height=h;
		$(this._bgCanvas).css({width:w,height:h});
		this._moveHolder.css({width:w,height:h});
		this._graphCanvas.width=w;
		this._graphCanvas.height=h;
		$(this._graphCanvas).css({width:w,height:h});
		this._plot();
		if(this._gradientBG){
			this.setBackground(this._gradientBG);
		}		
	},
	draw: function(){
          this._draw(); 
	},
	getObj:function(id,type,op,data){
		var ret=null;
		if(type==""||typeof(type)=="undefined"){
			type="line";
		} 
		$.each(this._data,function(i,s){
			if(s.id==id&&s[type]!="undefined"){
				ret=s;
				s.type=type;
				s.customerData={op:op,data:data};
				return false;
			}
		});
		return ret;
		}, 
	addAxis:function(axisOptions,dataOptions){
		this._op.yaxis.splice(0,0,axisOptions);
		//var op=$.extend(true,{},this._op);
		this._data.push(dataOptions);
		//var da=$.extend(true,[],this._data);
		this._setOptions(this._op);
		this._setData(this._data);
		this._draw(); 
	},
	removeAxis:function(axisID){
		 for(var i=0;i<this._data.length;i++){
		  var s=this._data[i];
 			if(s.axis.y==axisID){
 				this._data.splice(i,1);
			 }			 	
		  }	
		 for(var i=0;i<this._op.yaxis.length;i++){
		  var s=this._op.yaxis[i];
 			if(s.id==axisID){
 				this._op.yaxis.splice(i,1);
			 }			 	
		  } 
		this._setOptions(this._op);
		this._setData(this._data);
		this._draw(); 		  		
 	},
	changeAxisStyle:function(axis,axisTitle,cssName,lineColor){
		return this._coordinate.changeAxisStyle(axis,axisTitle,cssName,lineColor);
	},	
	refresh:function(){
 		this._plot();
		},
	getCalibration:function(){
		return this._coordinateOption.xaxis[0].calibration;		 
	},
	getGraphArea:function(){
		return this._coordinate.getGraphArea();
	},	
	getGraphHolder:function(){
		return this._moveHolder;
	},
	getLabel:function(id){
		return this._coordinate.getLabel(id);
		},
	getSupportType:function(){
		return this._supportType;
	},
	fireClick:function(e,fn){
/*		if(typeof(fn)=="function"){
			$.extend(e,{data:{fn:fn}});
			this.click(e);
		}	*/	
	},
	fireEvent:function(e,type){		 
		if(typeof(this[type+"_fn"])=="function"&&this[type]){
		  	this[type](e);
		}
	},
	reMapping:function(l,r){
		if(typeof(l)!="number"||typeof(r)!="number"){
			return;
		}
		var l=Math.floor(l),
			r=Math.ceil(r),
			first=this._data[0].minX,
			second=this._data[0].maxX;		
		var interVal=this._data[0].data[1][0]-first;
		l=l<first?first:l;
		r=r>second?second:r;
		l-=first;
		var detal=second-r;
		r+=detal%interVal;
		l-=l%interVal;
		this._firstSubIndex=l/interVal;		
		l+=first; 
		l=l<first?first:l;
		r=r>second?second:r;
		this._secondSubIndex=(r-first)/interVal;
		//console.log("first:"+this._firstSubIndex+" second:"+this._secondSubIndex);				
		$.each(this._coordinateOption.xaxis,function(i,v){
				v.value.second=r;
				v.value.first=l;
				if(v.calibration.length!=0){
					v.calibration=null;
				}
		 });		 
	},
	bind:function(type,fn){
		type=type.toLowerCase();
		if(typeof(type)=="string"&&typeof(fn)=="function"){
			if(this[type]){
				this._placeHolder.bind(type,{fn:fn},this[type]); 
				this[type+"_fn"]=fn;
				return;
			}
			if (type == "mouseout") {			
			var me=this; 			 
			this["mouseout_fn"]=fn;
			this._placeHolder.unbind(type).bind(type, function(e){
				var p=$.getPosition(me._placeHolder,e);				
				if(p.x>0&&p.x<me._w&&p.y>0&&p.y<me._h){
					return;
				};
				fn();
			});	
		   } 
		}		
	},
	unbind:function(type){
		if(typeof(type)=="undefined"){
			this._placeHolder.unbind();
			this["mouseout_fn"]=null;
			this["mousemove_fn"]=null;
			this["click_fn"]=null;this["mousedown_fn"]=null;
		}
		else if(typeof(type)=="string"){
		type=type.toLowerCase();
		this._placeHolder.unbind(type);	
		this[type+"_fn"]=null;
		}
	},
	setRangeColor:function(data,color){
		var color=$.color.parse(color).toString();
		if ((data instanceof Array)&&data.length==2) {
			data.sort(function(a,b){return a-b;});
			var ctx=this._coordinate.getCanvas().getContext("2d");
			var mapping=this._coordinateOption.xaxis[0].mapping;
			var R=this._coordinateOption.yaxis[0].mapping.getCoordinateRange();
			var ptCollection=[];
			 ptCollection.push({x:mapping.getCoordinate(data[0]),y:R.first});
			 ptCollection.push({x:mapping.getCoordinate(data[0]),y:R.second});
			 ptCollection.push({x:mapping.getCoordinate(data[1]),y:R.second});
			 ptCollection.push({x:mapping.getCoordinate(data[1]),y:R.first});		 
			var graphics=new $.Graphics(ctx);
			graphics.begin(); 
			graphics.setLineStyle(0, "#cccccc");
			graphics.setNormalFill(color);
			graphics.drawPolygon(ptCollection); 
			graphics.end();	
			graphics=null;		
		}
	},
	setBackground:function(str){
		if(typeof(str)=="string"){
			this._placeHolder.addClass(str);
		}
		if(typeof(str)=="object"){
			this._gradientBG=$.extend({startColor:"#FFFFFF",stopColor:"#D7D7D7",opacity:1},str);
			var ob=this._gradientBG;
			var ctx=this._bgCanvas.getContext("2d"),w=this._bgCanvas.width,h=this._bgCanvas.height;
			var _createGradient = function(fromColor,toColor, form, to, ctx){
				var toColor = $.color.parse(toColor).toString();				 
				var fromColor = $.color.parse(fromColor).toString();				 
				var lingrad = ctx.createLinearGradient(form.x, form.y, to.x, to.y);
				lingrad.addColorStop(0, fromColor);
				lingrad.addColorStop(1, toColor);
				return lingrad;
			};			
			var R=this._coordinateOption.yaxis[0].mapping.getCoordinateRange();
			ctx.clearRect(0,0,w,h);
			ctx.fillStyle=_createGradient(ob.startColor,ob.stopColor,{x:0,y:R.first},{x:0,y:R.second},ctx);
			ctx.fillRect(0,R.first,w,R.second);
		} 
	},
	removeBackground:function(str){
		this._placeHolder.removeClass(str);
		this._gradientBG=null;
		var ctx=this._bgCanvas.getContext("2d"),w=this._bgCanvas.width,h=this._bgCanvas.height;
		ctx.clearRect(0,0,w,h);
	},
	setSearchMethod:function(string){
		if(typeof(string)=="undefined"){
			this._SearchMethod=null;
			return;
		}
		this._SearchMethod=string;
	},
	setAxisSegment:function(type,fn){
		if(typeof(type)=="undefined"){
			type="x";
		}
		if(type=="x"){
			this._xSegmentMethod=fn;
		}
		else if(type=="y"){
			this._ySegmentMethod=fn;
		}
	},
	reorder:function(data){
		if(data instanceof Array){
			if(data.length==this._data.length){
				for(var i=0;i<this._data.length;i++){
					var id=this._data[i].id;
					for(var j=0;j<data.length;j++){
						if(id==data[j]){
							this._data[i].index=j;
							break;
						}
					}
				}
			this._sortData();	
			this._plot();	
			}
			else{
				alert("invalid arguments:"+data);
			}
		}
	} 
};
Chart.seriesGraph.prototype.constructor =Chart.seriesGraph;
Chart.seriesGraph.plugins={};
/*
 * ===========================================================================
 * seriesGraph plugins,
 * any plugins must achieve the following interface,otherwise it will not work
 *  extendOptions:function(s){}
 	* @pargam s is an object
 	* graphics default options are set here 
 *  plot:function(graphic, data, canvas){}
 	* @pargam graphic is a  graphic object "new $.Graphics(ctx)"
 	* @pargam data is a data stream,contains all the data after parse
 	* @pargam canvas is the canvas dom object  
 *  click:function(mousePosition, data, correspondData){}
 	* @pargam mousePosition is an object ,defined mouse position ,like {x:1,y:4}
 *  mousemove:function(mousePosition, data, correspondData){}
 *  mousedown:function(mousePosition, data, correspondData){}
 * ===========================================================================
*/
Chart.seriesGraph.plugins.stackedArea = {
	extendOptions: function(s){
		var stackedAreaOption = {
			show: false,
			baseLine: null,
			fillColor: "#88FF00FF",
			marker: {
				show: false,
				shape: 4,
				width: 8,
				height: 8,
				color: "#FF00FF"
			},
			strokeWidth: 1,
			strokeColor: "#FFFFFF"
		};
		if (s.stackedArea) {
			s.stackedArea = $.extend(true, {}, stackedAreaOption, s.stackedArea);
		}
	},
	plot: function(graphic, data, canvas){
		var draw = function(i, obj, dataArray, graphic, canvas){
			var originalData = obj.data;
			var copyData = $.extend(true, [], originalData);
			var addData = [];
			var ptdraw = [];
			var rePt = [];
			for (var j = 0; j < i; j++) {
				if (obj.stackedArea && obj.stackedArea.show) {
					if (addData.length == 0) {
						addData = $.extend(true, [], dataArray[j].data);
					}
					else {
						for (var k = 0; k < addData.length; k++) {
							addData[k][2] += dataArray[j].data[k][2];
						}
					}
				}
			}
			if (addData.length > 0) {
				for (var k = 0; k < copyData.length; k++) {
					copyData[k][2] += addData[k][2];
				}
				addData.reverse();
				copyData = copyData.concat(addData);
				
			}
			else {
				copyData.push([originalData[originalData.length - 1][0], '', obj.ymapping.getValueRange().second]);
				copyData.push([originalData[0][0], '', obj.ymapping.getValueRange().second]);
			}
			
			for (var i = 0; i < originalData.length; i++) {
				rePt.push({
					x: obj.xmapping.getCoordinate(copyData[i][0]),
					y: obj.ymapping.getCoordinate(copyData[i][2])
				});
			};
			
			
			$.each(copyData, function(i, v){
				ptdraw.push({
					x: obj.xmapping.getCoordinate(v[0]),
					y: obj.ymapping.getCoordinate(v[2])
				});
			});
			obj.stackedPt = rePt;
			obj.stackedAreaPolygon = ptdraw;
			var option = obj.stackedArea;
			var temp = $.color.parse(option.fillColor);
			var color = temp.toString();
			graphic.begin();
			graphic.setLineStyle(0, option.strokeColor);
			graphic.setNormalFill(color);
			graphic.drawPolygon(ptdraw);
			graphic.setNoneFill();
			graphic.end();
			if (option.strokeWidth != 0) {
				graphic.begin();
				graphic.setLineStyle(option.strokeWidth, option.strokeColor);
				graphic.setNoneFill();
				graphic.drawPolyline(rePt);
				graphic.end();
			}
			//
			if (option.marker.show) {
				var icondrawer = new Icon.Drawer(canvas);
				var iconsetting = new Icon.Setting();
				iconsetting.align = 1;
				iconsetting.valign = 1;
				iconsetting.size.width = option.marker.width;
				iconsetting.size.height = option.marker.height;
				iconsetting.iconType = option.marker.shape;
				iconsetting.color = option.marker.color;
				for (var i = 0; i < originalData.length; i++) {
					if (typeof(ptdraw[i].y) == "number") {
						iconsetting.position.x = ptdraw[i].x;
						iconsetting.position.y = ptdraw[i].y;
						icondrawer.draw(iconsetting);
					}
				}
				icondrawer = iconsetting = null;
			}
			
		};
		$.each(data, function(i, obj){
			if (obj.stackedArea && obj.stackedArea.show) {
				draw(i, obj, data, graphic, canvas);
			}
		});
	},
	click: function(mousePosition, data, correspondData){
		var re = null;
		$.each(data, function(i, obj){
			if (obj.stackedArea && obj.stackedArea.show) {
				var p = null;
				if (Chart.Common.Graphic.GraphicUtil.inPolygon(obj.stackedAreaPolygon, obj.stackedAreaPolygon.length, mousePosition)) {
					p = correspondData[i].start;
					correspondData[i].ds >= correspondData[i].de ? p = correspondData[i].end : "";
				}
				if (p != null) {
					obj.type = "stackedArea";
					re = $.extend({
						arraySubIndex:p,
						mousePosition: mousePosition,
						xvalue: obj.data[p][1],
						yvalue: obj.data[p][2],
						firstValue: obj.data[p][0],
						x: obj.stackedPt[p].x,
						y: obj.stackedPt[p].y,
						distance: 0.01
					}, obj);
					return false;
				}
			}
		});
		return re;
	},
	mousemove: function(mousePosition, data, correspondData){
		var re = [];
		$.each(data, function(i, obj){
			if (obj.stackedArea && obj.stackedArea.show) {
				var p = null;
				if (Chart.Common.Graphic.GraphicUtil.inPolygon(obj.stackedAreaPolygon, obj.stackedAreaPolygon.length, mousePosition)) {
					p = correspondData[i].start;
					//correspondData[i].ds>=correspondData[i].de?p=correspondData[i].end:"";					
				}
				if (p != null) {
					obj.type = "stackedArea";
					re.push($.extend({
						arraySubIndex:p,
						mousePosition: mousePosition,
						xvalue: obj.data[p][1],
						yvalue: obj.data[p][2],
						firstValue: obj.data[p][0],
						x: obj.stackedPt[p].x,
						y: obj.stackedPt[p].y,
						distance: 0
					}, obj));
					return false;
				}
			}
		});
		return re;
	},
	mousedown: function(mousePosition, data, correspondData){	
	}
}
Chart.seriesGraph.plugins.bar = {
	extendOptions: function(s){
		var barOption = {
			show: false,
			barWidth: null,
			strokeColor: "#FFFFFF",
			fillColor: "#FF0000",
			strokeWidth: 0,
			splitSpace: null,
			baseLine: null,
			indentation: true
		};
		if (s.bar) {
			s.bar = $.extend(true, {}, barOption, s.bar);
		}
	},
	plot: function(graphic, data, canvas){
		$.each(data, function(i, obj){
			if (obj.bar && obj.bar.show) {
				var pt = obj.pt;
				var op = obj.bar;
				var yMapping = obj.ymapping;
				var autoSplit = false;
				var rx = {
					first: obj.xmapping.getCoordinateRange().first,
					second: obj.xmapping.getCoordinateRange().second
				};
				var splitSpace = 1.5;
				if (op.barWidth == -1) {
					if (typeof(op.splitSpace) == "number") {
						splitSpace = op.splitSpace;
					}
					var barWidth = (rx.second - rx.first - (pt.length - 1) * splitSpace) / (pt.length);
					autoSplit = true;
				}
				else {
					if (op.barWidth == null) {
						op.barWidth = (obj.data[1][0] - obj.data[0][0]) / 5;
					}
					var w0 = obj.xmapping.getCoordinate(obj.data[0][0]);
					var w1 = obj.xmapping.getCoordinate(obj.data[0][0] + op.barWidth);
					var barWidth = (w1 - w0) / 2;
				}
				var barPtCollection = null;
				if (op.baseLine != null) {
					var y0 = yMapping.getCoordinate(op.baseLine);
				}
				else {
					var y0 = yMapping.getCoordinateRange().second;
				}
				var barArea = [];
				$.each(pt, function(j, data){
					if (data.y == null) {
						return;
					}
					if (!autoSplit) {
						var xpointFirst = data.x - barWidth;
						var xpointLast = data.x + barWidth;
						if (op.indentation) {
							if (xpointFirst < rx.first) {
								xpointFirst = rx.first;
								xpointLast = data.x + 2 * barWidth;
							}
							if (xpointLast > rx.second) {
								xpointLast = rx.second;
								xpointFirst = data.x - 2 * barWidth;
							}
						}
					}
					else {
						var m = splitSpace;
						var xpointFirst = rx.first + j * (barWidth + m);
						var xpointLast = xpointFirst + barWidth;
					}
					barPtCollection = [{
						x: xpointFirst,
						y: y0
					}, {
						x: xpointFirst,
						y: data.y
					}, {
						x: xpointLast,
						y: data.y
					}, {
						x: xpointLast,
						y: y0
					}];
					graphic.begin();
					graphic.setLineStyle(op.strokeWidth, op.strokeColor);
					var color = $.color.parse(op.fillColor).toString();
					graphic.setNormalFill(color);
					graphic.drawPolygon(barPtCollection);
					graphic.setNoneFill();
					graphic.end();
					barArea.push(barPtCollection);
				});
				$.extend(obj, {
					barPt: barArea
				});
			}
		});//	
	},
	click: function(mousePosition, data, correspondData){
		var re = null;
		var me = this;
		$.each(data, function(i, s){
			if (s.barPt && s.bar.show) {
				var p = null;
				if (Chart.Common.Graphic.GraphicUtil.inPolygon(s.barPt[correspondData[i].start], 4, mousePosition)) {
					p = correspondData[i].start;
					
				}
				else 
					if (Chart.Common.Graphic.GraphicUtil.inPolygon(s.barPt[correspondData[i].end], 4, mousePosition)) {
						p = correspondData[i].end;
					}
				if (p != null) {
					s.type = "bar";
					re = $.extend({
						arraySubIndex:p,
						mousePosition: mousePosition,
						xvalue: s.data[p][1],
						yvalue: s.data[p][2],
						firstValue: s.data[p][0],
						x: s.pt[p].x,
						y: s.pt[p].y,
						distance: 0
					}, s);
					return false;
				}
			}
		});
		return re;
	},
	mousemove: function(mousePosition, data, correspondData){
		var re = [];
		var type=arguments[3]||"",type=type.toLowerCase();
		$.each(data, function(i, s){
			if (s.bar && s.bar.show) {
				var v = correspondData[i],d;
				if (v == null) {
					return false;
				}
				var index = null;
  				switch (type) {
					case "nearx":
						d = v.xs >= v.xe ? v.xe : v.xs;
						if (d == v.xs) {
							index = v.start;
						}
						else {
							index = v.end;
						};							
						break;
					default:
						//d = v.ds >= v.de ? v.de : v.ds;
						if (Chart.Common.Graphic.GraphicUtil.inPolygon(s.barPt[v.start], 4, mousePosition)) {
							d = 0;
							index = v.start;
						}
						else 
							if (Chart.Common.Graphic.GraphicUtil.inPolygon(s.barPt[v.end], 4, mousePosition)) {
								d = 0;
								index = v.end;
							}
				}				
				//var d = v.ds >= v.de ? v.de : v.ds;
				if (index != null) {
					var xvalue = s.data[index][1];
					var yvalue = s.data[index][2];
					var firstvalue = s.data[index][0];
					re.push($.extend({
						arraySubIndex:index,
						distance: d,
						firstValue: firstvalue,
						xvalue: xvalue,
						yvalue: yvalue,
						x: s.pt[index].x,
						y: s.pt[index].y,
						mousePosition: mousePosition
					}, s));
				}
			}
		})
		return re;
	},
	mousedown: function(mousePosition, data, correspondData){
	
	}
}
Chart.seriesGraph.plugins.line = {
	extendOptions: function(s){
		var lineOption = {
			show: true,
			areaLine: false,
			lineWidth: 1,
			lineColor: "#000000",
			fillColor: "#cccccc",//{startColor:"#CCCCCC",stopColor:"#FFFFFF"}
			gradient: true,
			marker: {
				show: false,
				shape: 2,
				width: 8,
				height: 8,
				color: "#000000"
			}
		};
		if (s.line) {
			s.line = $.extend(true, {}, lineOption, s.line);
		}
	},
	plot: function(graphic, data, canvas){
		var _createVerticalGradient = function(color, top, bottom, ctx){
			var bottomColor = $.color.parse(color.stopColor).toString();
			var topColor = $.color.parse(color.startColor).toString(); 			
			var lingrad = ctx.createLinearGradient(0, top, 0, bottom);
			lingrad.addColorStop(0, topColor);
			lingrad.addColorStop(1, bottomColor);
			return lingrad;
		};
		$.each(data, function(i, obj){
			if (obj.line && obj.line.show) {
				var op = obj.line;
				var pt = obj.pt;
				graphic.begin();
				graphic.setLineStyle(op.lineWidth, $.color.parse(op.lineColor).toString());
				graphic.drawPolyline(pt);
				graphic.end();
				if (op.areaLine) {
					var ptCollection = [];
					var color={startColor:"#cccccc",stopColor:"#ffffff"};
					if(typeof(op.fillColor)=="string"){
						color={startColor:op.fillColor,stopColor:"#ffffff"};	
					}else{
						if(op.fillColor.startColor&&op.fillColor.stopColor){
						  color=op.fillColor;	
						}						 		
					}					
					var topPos = obj.ymapping.getCoordinate(obj.maxY);
					if (typeof(op.baseLine) == "number") {
						var bottomPos = obj.ymapping.getCoordinate(op.baseLine);
					}
					else {
						var bottomPos = obj.ymapping.getCoordinateRange().second;
					}
					ptCollection.push({
						x: pt[pt.length - 1].x,
						y: bottomPos
					});
					ptCollection.push({
						x: pt[0].x,
						y: bottomPos
					});
					if (op.gradient) {
						color = _createVerticalGradient(color, topPos, bottomPos, canvas.getContext("2d"));
					}
					else {
						color = $.color.parse(color.startColor).toString();
					}
					var areaPt = pt.concat(ptCollection),len=areaPt.length,lw=op.lineWidth*0.75;
					$.each(areaPt,function(i,s){
						if(i>=len-2){return false;}
						s.y+=lw;
					});
					graphic.begin();
					graphic.setLineStyle(0);
 
					graphic.setGradientFill(color);
	 				
					graphic.drawPolygon(areaPt);
					graphic.setNoneFill();
					graphic.end();
					
				}
				if (op.marker.show) {
					var icondrawer = new Icon.Drawer(canvas);
					var iconsetting = new Icon.Setting();
					iconsetting.align = 1;
					iconsetting.valign = 1;
					iconsetting.size.width = op.marker.width;
					iconsetting.size.height = op.marker.height;
					iconsetting.iconType = op.marker.shape;
					iconsetting.color = op.marker.color;
					for (var i = 0; i < pt.length; i++) {
						if (typeof(pt[i].y) == "number") {
							iconsetting.position.x = pt[i].x;
							iconsetting.position.y = pt[i].y;
							icondrawer.draw(iconsetting);
						}
					}
					icondrawer = iconsetting = null;
				}				
			}
		});
	},
	click: function(mousePosition, data, correspondData){
		var re = null;
		var radius = 5;
		$.each(data, function(i, s){
			if (s.line && s.line.show) {
				var p = null;
				var ptArea = [{
					x: s.pt[correspondData[i].start].x,
					y: s.pt[correspondData[i].start].y - radius
				}, {
					x: s.pt[correspondData[i].end].x,
					y: s.pt[correspondData[i].end].y - radius
				}, {
					x: s.pt[correspondData[i].end].x,
					y: s.pt[correspondData[i].end].y + radius
				}, {
					x: s.pt[correspondData[i].start].x,
					y: s.pt[correspondData[i].start].y + radius
				}];
				if (Chart.Common.Graphic.GraphicUtil.inPolygon(ptArea, 4, mousePosition)) {
					p = correspondData[i].start;
					correspondData[i].ds >= correspondData[i].de ? p = correspondData[i].end : "";
				}
				if (p != null) {
					s.type = "line";
					re = $.extend({
						arraySubIndex:p,
						mousePosition: mousePosition,
						xvalue: s.data[p][1],
						yvalue: s.data[p][2],
						firstValue: s.data[p][0],
						x: s.pt[p].x,
						y: s.pt[p].y,
						distance: 0
					}, s);
					return false;
				}
			}
		});
		return re;
	},
	mousemove: function(mousePosition, data, correspondData){
		var re = [];
		var type=arguments[3]||"";
		$.each(data, function(i, s){
			if (s.line && s.line.show) {
				var v = correspondData[i],d,index,point;
				if (v == null) {
					return false;
				}
  				switch (type.toLowerCase()) {
					case "nearx":
						d = v.xs >= v.xe ? v.xe : v.xs;
						if (d == v.xs) {
							index = v.start;
						}
						else {
							index = v.end;
						};							
						break;
					case "farx":
						d = v.xs <= v.xe ? v.xe : v.xs;
						if (d == v.xs) {
							index = v.start;
						}
						else {
							index = v.end;
						};						
						break;
					default:
						d = v.ds >= v.de ? v.de : v.ds;						
						if (d == v.ds) {
							index = v.start;
						}
						else {
							index = v.end;
						}
						;
				}
				d = v.ds >= v.de ? v.de : v.ds;				
				var xvalue = s.data[index][1];
				var yvalue = s.data[index][2];
				var firstvalue = s.data[index][0];
				re.push($.extend({
					arraySubIndex:index,
					distance: d < 25 ? -1 : d,
					firstValue: firstvalue,
					xvalue: xvalue,
					yvalue: yvalue,
					x: s.pt[index].x,
					y: s.pt[index].y,
					mousePosition: mousePosition
				}, s));
			}
		})
		return re;
	},
	mousedown: function(mousePosition, data, correspondData){
	
	}
}
Chart.seriesGraph.plugins.dot = {
	extendOptions: function(s){
		var dotOption = {
			show: false,
			shape: 3,
			width: 8,
			height: 8,
			color: "#FF00FF"
		};
		if (s.dot) {
			s.dot = $.extend(true, {}, dotOption, s.dot);
		}
	},
	plot: function(graphic, data, canvas){
		$.each(data, function(i, obj){
			if (obj.dot && obj.dot.show) {
				var pt = obj.pt;
				var op = obj.dot;
				var dotPt = [];
				var icondrawer = new Icon.Drawer(canvas);
				var iconsetting = new Icon.Setting();
				iconsetting.align = 1;
				iconsetting.valign = 1;
				iconsetting.size.width = op.width;
				iconsetting.size.height = op.height;
				iconsetting.iconType = op.shape;
				iconsetting.color = op.color;
				for (var i = 0; i < pt.length; i++) {
					if (typeof(pt[i].y) == "number") {
						iconsetting.position.x = pt[i].x;
						iconsetting.position.y = pt[i].y;
						icondrawer.draw(iconsetting);
					}
				}
				icondrawer = iconsetting = null;
			}
		});
	},
	click: function(mousePosition, data, correspondData){
		var re = null;
		var radius = 5;
		$.each(data, function(i, s){
			if (s.dot && s.dot.show) {
				var dot = null;
				if (correspondData[i].ds <= radius * radius) {
					dot = correspondData[i].start;
				}
				else 
					if (correspondData[i].de <= radius * radius) {
						dot = correspondData[i].end;
					}
				if (dot != null) {
					s.type = "dot";
					re = $.extend({
						arraySubIndex:dot,
						mousePosition: mousePosition,
						xvalue: s.data[dot][1],
						yvalue: s.data[dot][2],
						firstValue: s.data[dot][0],
						x: s.pt[dot].x,
						y: s.pt[dot].y,
						distance: 0
					}, s);
					return false;
				}
			}
		});
		return re;
	},
	mousemove: function(mousePosition, data, correspondData){
		var re = [];
		var radius = 5;
		$.each(data, function(i, s){
			if (s.dot && s.dot.show) {
				var v = correspondData[i];
				if (v == null) {
					return false;
				}
				var d = v.ds >= v.de ? v.de : v.ds;
				var index, point;
				if (d == v.ds) {
					index = v.start;
				}
				else {
					index = v.end;
				}
				var xvalue = s.data[index][1];
				var yvalue = s.data[index][2];
				var firstvalue = s.data[index][0];
				re.push($.extend({
					arraySubIndex:index,
					distance: d < radius * radius ? -2 : d,
					firstValue: firstvalue,
					xvalue: xvalue,
					yvalue: yvalue,
					x: s.pt[index].x,
					y: s.pt[index].y,
					mousePosition: mousePosition
				}, s));
			}
		})
		return re;
		
	},
	mousedown: function(mousePosition, data, correspondData){
	
	}
}
