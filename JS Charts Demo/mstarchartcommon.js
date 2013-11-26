//========== Global Namespace begin ==========
if (!Chart) {
    var Chart = {
        version: 0.001001,
        build: 20100802
    };
}

Chart.load = function(domainUrl, packName, callback){
	var url = String.format("{0}/script/pack/{1}.pack.js", domainUrl, packName);
	$.getScript(url, callback);
};

Chart.Common = function(){
};
Chart.Component = function(){
};
Chart.Interface = function(){
};
//---------- Global Namespace end ----------

//========== Common Graphic Folder begin ==========
Chart.Common.Graphic = function(){
};

Chart.Common.Graphic.ShapeType = {
    Rect: 0,
    Area: 1,
    Square: 2,
    Circle: 3,
    Triangle: 4,
    Cross: 5,
    LineSmall: 6,
    LineMedium: 7,
    LineThick: 8,
    CharDividend: 9,
    CharCapitalGain: 10,
    CharSplits: 11,
    TipBox: 12,
    Ellipse: 13,
    DotSmall: 14,
    DotMedium: 15,
    DotLarge: 16,
    
    Diamond: 19,
    Pentagon: 20,
    TriangleDown: 21,
    TriangleLeft: 22,
    TriangleRight: 23,
    CircleFrame: 24,
    SquareFrame: 25,
    TriangleFrame: 26,
    TriangleDownFrame: 27,
    TriangleLeftFrame: 28,
    TriangleRightFrame: 29,
    DiamondFrame: 30,
    PentagonFrame: 31,
    
    None: 99
};

Chart.Common.Graphic.GraphElement = function(){
	var _canvasWidth = 0;
	var _canvasHeight = 0;
	
	this.canvas = null;
	
	this.applySetting = function(setting){
	};
	
	this.getSetting = function(setting){
	};
	
	this.getHeight = function(){
		if (this.canvas) {
			return this.canvas.height;
		}
		return 0;
	};
	
	this.getWidth = function(){
		if (this.canvas) {
			return this.canvas.width;
		}
		return 0;
	};
	
	this.getGlobaPosition = function(pt, globalCanvasDom){
		var offset = $(this.canvas).offset();
		var goffset = globalCanvasDom.offset();
		
		pt.x += offset.left - goffset.left;
		pt.y += offset.top - goffset.top;
		return pt;
	};
	
	this.refresh = function(){
	};
	
	this.resize = function(width, height){
		this.resizeComponents(width, height);
		if (this.canvas) {
			this.canvas.width = width;
			this.canvas.height = height;
			$(this.canvas).css({
				width: width,
				height: height
			});
			_canvasWidth = width;
			_canvasHeight = height;
		}
	};
	
	this.resizeComponents = function(width, height){
	};
	
	this.setPosition = function(x, y){
		if (this.canvas) {
			$(this.canvas).css({
				left: x,
				top: y
			});
		}
	};
};

Chart.Common.Graphic.GraphicUtil = function(){
};
Chart.Common.Graphic.GraphicUtil.inPolygon = function(pts, n, point){
	var _multiplyCross = function(pt1, pt2, pt0){
		return ((pt1.x - pt0.x) * (pt2.y - pt0.y) - (pt2.x - pt0.x) * (pt1.y - pt0.y));
	};
	var _isOnLine = function(pt, line){
		return ((Math.abs(_multiplyCross(line.pt1, line.pt2, pt)) < 0.00001) &&
		((pt.x - line.pt1.x) * (pt.x - line.pt2.x) <= 0) &&
		((pt.y - line.pt1.y) * (pt.y - line.pt2.y) <= 0));
	};
	var _intersect = function(line1, line2){
		return ((Math.max(line1.pt1.x, line1.pt2.x) >= Math.min(line2.pt1.x, line2.pt2.x)) &&
		(Math.max(line2.pt1.x, line2.pt2.x) >= Math.min(line1.pt1.x, line1.pt2.x)) &&
		(Math.max(line1.pt1.y, line1.pt2.y) >= Math.min(line2.pt1.y, line2.pt2.y)) &&
		(Math.max(line2.pt1.y, line2.pt2.y) >= Math.min(line1.pt1.y, line1.pt2.y)) &&
		(_multiplyCross(line2.pt1, line1.pt2, line1.pt1) * _multiplyCross(line1.pt2, line2.pt2, line1.pt1) >= 0) &&
		(_multiplyCross(line1.pt1, line2.pt2, line2.pt1) * _multiplyCross(line2.pt2, line1.pt2, line2.pt1) >= 0));
	};
	
	if (n == 1) {
		return ((Math.abs(pts[0].x - point.x) < 0.00001) && (fabs(pts[0].y - point.y) < 0.00001));
	}
	else 
		if (n == 2) {
			var side = {
				pt1: pts[0],
				pt2: pts[1]
			};
			return _isOnLine(point, side);
		}
	
	var count = 0;
	var line = {
		pt1: point,
		pt2: {
			x: -10000000000,
			y: point.y
		}
	};
	
	for (var i = 0; i < n; i++) {
		var side = {
			pt1: pts[i],
			pt2: pts[(i + 1) % n]
		};
		
		if (_isOnLine(point, side)) {
			return true;
		}
		
		if (Math.abs(side.pt1.y - side.pt2.y) < 0.00001) {
			continue;
		}
		
		if (_isOnLine(side.pt1, line)) {
			if (side.pt1.y > side.pt2.y) {
				count++;
			}
		}
		else 
			if (_isOnLine(side.pt2, line)) {
				if (side.pt2.y > side.pt1.y) {
					count++;
				}
			}
			else 
				if (_intersect(line, side)) {
					count++;
				}
	}
	return (count % 2 == 1);
};
//---------- Common Graphic Folder end ----------

//========== Common Util Folder start =========
Chart.Common.Util = function(){
};

Chart.Common.Util.PeriodType = {
	Day: "d",
	Month: "m",
	Year: "y",
	Custom: "custom",
	MTD: "mtd",
	QTD: "qtd",
	YTD: "ytd",
	MAX: "max"
};

Chart.Common.Util.TimePeriod = function(){
	this.periodCount = 0;
	this.periodType = Chart.Common.Util.PeriodType.MAX;
};
Chart.Common.Util.TimePeriod.prototype = {
	create: function(periodString){
		if(!periodString) return false;
		
		var arr = periodString.split(';');
		if(!arr || arr.length < 2) return false;
		
 		var count = parseInt(arr[0]);
		if(isNaN(count)) return false;
		
		this.periodCount = count;
		switch(arr[1].toLowerCase()){
			case Chart.Common.Util.PeriodType.Day:
			case Chart.Common.Util.PeriodType.Month:
			case Chart.Common.Util.PeriodType.Year:
			case Chart.Common.Util.PeriodType.Custom:
			case Chart.Common.Util.PeriodType.MTD:
			case Chart.Common.Util.PeriodType.QTD:
			case Chart.Common.Util.PeriodType.YTD:
			case Chart.Common.Util.PeriodType.MAX:
				this.periodType = arr[1].toLowerCase();
				break;
			default:
				break;
		}
		return true;
	},
	getStartDate: function(endDate){
		switch (this.periodType) {
			case Chart.Common.Util.PeriodType.Day:
				return endDate.dateAdd(Chart.Common.Util.DataFrequency.Daily, 0 - this.periodCount + 1);
			case Chart.Common.Util.PeriodType.Month:
				return endDate.dateAdd(Chart.Common.Util.DataFrequency.Daily, 1).dateAdd(Chart.Common.Util.DataFrequency.Monthly, 0 - this.periodCount);
			case Chart.Common.Util.PeriodType.Year:
				return endDate.dateAdd(Chart.Common.Util.DataFrequency.Daily, 1).dateAdd(Chart.Common.Util.DataFrequency.Annually, 0 - this.periodCount);
			case Chart.Common.Util.PeriodType.MTD:
				return new Date(endDate.getFullYear(), endDate.getMonth(), 1);
			case Chart.Common.Util.PeriodType.QTD:
				var month = endDate.getMonth() + 1;
				month = month - (month - 1) % 3 - 1;
				return new Date(endDate.getFullYear(), month, 1);
			case Chart.Common.Util.PeriodType.YTD:
				return new Date(endDate.getFullYear(), 0, 1);
			case Chart.Common.Util.PeriodType.MAX:
			default:
				return Chart.Common.Util.DateUtil.BASE_DATE();
		}
	},
	isSpecific: function(){
		switch (this.periodType) {
			case Chart.Common.Util.PeriodType.Custom:
			case Chart.Common.Util.PeriodType.MAX:
				return false
			default:
				return true;
		}
	},
	toString: function(){
		return this.periodCount.toString() + ";" + this.periodType;
	}
};

Chart.Common.Util.DataFrequency = {
    None: "",
    Daily: "d",
    Weekly: "w",
    Monthly: "m",
    Quarterly: "q",
    Semiannually: "s",
    Annually: "a",
    Irregular: "i",
    AnnuallyIncludingYearToDate: "ytd"
};

Chart.Common.Util.DataFrequencyEx = function(frequency, count){
    this.frequency = frequency;
    this.count = count;
};
Chart.Common.Util.DataFrequencyEx.prototype.toString = function(){
	return String.format("({0};{1})", this.count, this.frequency);
};

Chart.Common.Util.DateUtil = function(){
};
Chart.Common.Util.DateUtil.BASE_DATE = function(){
    return new Date(1900, 0, 1);
};
Chart.Common.Util.DateUtil.arrayOfDayInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Chart.Common.Util.DateUtil.arrayOfDayInMonths2 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Chart.Common.Util.DateUtil.getDateIndex = function(date){
    return Chart.Common.Util.DateUtil.BASE_DATE().dateDiff("d", date);
};
Chart.Common.Util.DateUtil.getDateFromIndex = function(dateIndex){
    return new Date(1900, 0, 1 + dateIndex);
};
Chart.Common.Util.DateUtil.adjustOLEDateIndex = function(dateIndex){
    return dateIndex - 2;
};
Chart.Common.Util.DateUtil.dayInMonth = function(year, month){
    var isLeapYear = (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    var monthdays = isLeapYear ? Chart.Common.Util.DateUtil.arrayOfDayInMonths2 : Chart.Common.Util.DateUtil.arrayOfDayInMonths;
    return monthdays[month];
};
Chart.Common.Util.DateUtil.getWeekEndDate = function(date){
	return date.dateAdd(Chart.Common.Util.DataFrequency.Daily, date.getDay() == 6 ? 6 : (5 - date.getDay()));
};
Chart.Common.Util.DateUtil.getMonthEndDate = function(date){
    return new Date(date.getFullYear(), date.getMonth(), Chart.Common.Util.DateUtil.dayInMonth(date.getFullYear(), date.getMonth()));
};
Chart.Common.Util.DateUtil.getMonthFirstDate = function(date){
    return new Date(date.getFullYear(), date.getMonth(), 1);
};
Chart.Common.Util.DateUtil.getHalfYearEndDate = function(date){
    var month = date.getMonth() + 1;
    var monthsToAdd = Math.ceil(month / 6) * 6 - month;
    return Chart.Common.Util.DateUtil.getMonthEndDate(date.dateAdd("m", monthsToAdd));
};
Chart.Common.Util.DateUtil.getYearEndDate = function(date){
    return new Date(date.getFullYear(), 11, 31);
};
Chart.Common.Util.DateUtil.getQuarterEndDate = function(date){
    var month = date.getMonth() + 1;
    var monthsToAdd = Math.ceil(month / 3) * 3 - month;
    return Chart.Common.Util.DateUtil.getMonthEndDate(date.dateAdd("m", monthsToAdd));
};
Chart.Common.Util.DateUtil.getLastWeekEndDate = function(date){
    if (date.getDay() != 6) {
        date = date.dateAdd(Chart.Common.Util.DataFrequency.Daily, -7);
    }
    return date.dateAdd(Chart.Common.Util.DataFrequency.Daily, 6 - date.getDay());
};
Chart.Common.Util.DateUtil.getLastMonthEndDate = function(date){
    if (date.getDate() < Chart.Common.Util.DateUtil.dayInMonth(date.getFullYear(), date.getMonth())) {
		date = date.dateAdd(Chart.Common.Util.DataFrequency.Monthly, -1);
	}
    return Chart.Common.Util.DateUtil.getMonthEndDate(date);
};
Chart.Common.Util.DateUtil.getLastQuarterEndDate = function(date, fiscalYearEndMonth){
    if (!fiscalYearEndMonth) {
		fiscalYearEndMonth = 12;
	}
    var monthsPastQuarterEnd = (date.getMonth() + 1 + 12 - fiscalYearEndMonth) % 3;
    var dayinMonth = Chart.Common.Util.DateUtil.dayInMonth(date.getFullYear(), date.getMonth());
    if (date.getDay() < dayinMonth && monthsPastQuarterEnd === 0) {
        date = date.dateAdd(Chart.Common.Util.DataFrequency.Monthly, -3);
    }
    else 
        if (date.getDay() < dayinMonth && monthsPastQuarterEnd > 0) {
            date = date.dateAdd(Chart.Common.Util.DataFrequency.Monthly, -monthsPastQuarterEnd);
        }
    return Chart.Common.Util.DateUtil.getMonthEndDate(date);
};
Chart.Common.Util.DateUtil.getLastYearEndDate = function(date){
    if (date.getDay() < 31 || date.getMonth() < 11) {
        date = new Date(date.getFullYear() - 1, 11, 31);
    }
    return date;
};
Chart.Common.Util.DateUtil.getPeriodEnd = function(date, frequency){
    switch (frequency) {
        case Chart.Common.Util.DataFrequency.Weekly:
            return Chart.Common.Util.DateUtil.getWeekEndDate(date);
        case Chart.Common.Util.DataFrequency.Monthly:
            return Chart.Common.Util.DateUtil.getMonthEndDate(date);
        case Chart.Common.Util.DataFrequency.Quarterly:
            return Chart.Common.Util.DateUtil.getQuarterEndDate(date);
        case Chart.Common.Util.DataFrequency.Semiannually:
            return Chart.Common.Util.DateUtil.getHalfYearEndDate(date);
        case Chart.Common.Util.DataFrequency.Annually:
        case Chart.Common.Util.DataFrequency.AnnuallyIncludingYearToDate:
            return Chart.Common.Util.DateUtil.getYearEndDate(date);
        default:
            return date;
    }
};
Chart.Common.Util.DateUtil.getLastPeriodEnd = function(date, frequency){
    switch (frequency) {
        case Chart.Common.Util.DataFrequency.Weekly:
            return Chart.Common.Util.DateUtil.getLastWeekEndDate(date);
        case Chart.Common.Util.DataFrequency.Monthly:
            return Chart.Common.Util.DateUtil.getLastMonthEndDate(date);
        case Chart.Common.Util.DataFrequency.Quarterly:
            return Chart.Common.Util.DateUtil.getLastQuarterEndDate(date);
        case Chart.Common.Util.DataFrequency.Semiannually:
            return Chart.Common.Util.DateUtil.getHalfYearEndDate(date).dateAdd(Chart.Common.Util.DataFrequency.Monthly, -6);
        case Chart.Common.Util.DataFrequency.Annually:
        case Chart.Common.Util.DataFrequency.AnnuallyIncludingYearToDate:
            return Chart.Common.Util.DateUtil.getLastYearEndDate(date);
        default:
            return date;
    }
};

Chart.Common.Util.NumberUtil = function(){
};
Chart.Common.Util.NumberUtil.parseRawDouble = function(douleString, failedValue){
	var ret = parseFloat(douleString);
	if(isNaN(ret)){
		ret = failedValue;
	}
	return ret;
};

/**
 * Chart.Common.Util.ChildManagerTool
 * @class Chart.Common.Util.ChildManagerTool.
 * @note arrange a list of child.
 * @param childTypeStr {string} child type name string.
 * @return current object.
 */
Chart.Common.Util.ChildManagerTool = function(childTypeStr){
	this.childType = childTypeStr;
	this.childList = [];
	this.index = 0;
	return this;
};
Chart.Common.Util.ChildManagerTool.prototype = {
	getChild: function(){
		this._appendNewChildWhenNeeded.apply(this, arguments);
		return this.childList[this.index++];
	},
	clearChildren: function(){
		this.childList = [];
	},
	restart: function(){
		this.index = 0;
	},
	backspace: function(){
		if (this.index > 0) {
			this.index--;
		}
	},
	_addChild:function(item){
		this.childList.push(item);
	},
	_appendNewChildWhenNeeded: function(){
		if (this.index >= this.childList.length) {
			var child = this._createChild.apply(this, arguments);
			this._addChild(child);
		}
	},
	_createChild: function(){
		var str = "new " + this.childType + "(";
		var len = arguments.length;
		if (len > 0) {
			len--;
			for (var i = 0; i < len; i++) {
				str += "arguments[" + i + "],";
			}
			str += "arguments[" + len + "]";
		}
		str += ")";
		return eval(str);
	}
};
//---------- Common Util Folder end ----------

//========== Common Coordinate Folder start ==========
Chart.Common.Coordinate = function(){
};

Chart.Common.Coordinate.CartesianMappingType = {
    Log: 0,
    Linear: 1
};

Chart.Common.Coordinate.ScatterValueMapping = function(){
    this._coordinateRange = {
        first: 0,
        second: 0
    };
    this._borderList = [];
    
    this._scatterValueCount = 0;
    this._unitWidth = 0;
};
Chart.Common.Coordinate.ScatterValueMapping.prototype = {
    getCoordinateRange: function(){
        return this._coordinateRange;
    },
    getScatterValueCount: function(){
        return this._scatterValueCount;
    },
    getCoordinate: function(valueIndex){
        if(this._scatterValueCount > 0 && this._borderList.length > this._scatterValueCount){
            if(valueIndex > -1 && valueIndex < this._scatterValueCount){
                return this._borderList[valueIndex];
            }
            return 0;
        }
        else{
            return 0;
        }
    },
    getValueIndex: function(coordinate){
        if(this._scatterValueCount > 0 &&
            this._borderList.length > this._scatterValueCount){
                var index = -1;
                while(coordinate > this._borderList[index + 1] && index < this._borderList.length -1){
                    index++;
                }
                return index;
            }
            else{
                return -1;
            }
    },
    getUnitWidth: function(){
        return this._unitWidth;
    },
    setCoordinateRange: function(range){
        if(range){
            this._coordinateRange = range;
            this._parseBorder();
        }
    },
    setScatterValueCount: function(count){
        if(!isNaN(count)){
            this._scatterValueCount = count;
            this._parseBorder();
        }
    },
    _parseBorder: function(){
        this._borderList = [];
        this._borderList.push(this._coordinateRange.first);
        this._unitWidth = this._coordinateRange.second - this._coordinateRange.first;
        if(this._scatterValueCount > 1){
            var border = this._coordinateRange.first;
            this._unitWidth = this._unitWidth / this._scatterValueCount;
            for(var i = 1; i< this._scatterValueCount; i++){
                border += this._unitWidth;
                this._borderList.push(border);
            }
        }
        this._borderList.push(this._coordinateRange.second);
    }
};

Chart.Common.Coordinate.Date2DoubleLinearMapping = function(){
    this._coordinateRange = {
        first: 0,
        second: 0
    };
    this._valueRange = {
        first: Chart.Common.Util.DateUtil.BASE_DATE(),
        second: Chart.Common.Util.DateUtil.BASE_DATE()
    };
    
    this._unitSpaceEveryDay = 0;
    this._unitTimeEveryPt = 0;
    
    var mapping = this;
    
    this.preCalculate = function(){
        var dateDiff = mapping._valueRange.first.dateDiff(Chart.Common.Util.DataFrequency.Daily, mapping._valueRange.second);
        var coorDiff = mapping._coordinateRange.second - mapping._coordinateRange.first;
        if (dateDiff == 0 || coorDiff == 0) {
            mapping._unitSpaceEveryDay = 0;
            mapping._unitTimeEveryPt = 0;
        }
        else {
            mapping._unitSpaceEveryDay = coorDiff / dateDiff;
            mapping._unitTimeEveryPt = dateDiff / coorDiff;
        }
    };
};
Chart.Common.Coordinate.Date2DoubleLinearMapping.prototype.getCoordinateRange = function(){
    return this._coordinateRange;
};
Chart.Common.Coordinate.Date2DoubleLinearMapping.prototype.getValueRange = function(){
    return this._valueRange;
};
Chart.Common.Coordinate.Date2DoubleLinearMapping.prototype.setCoordinateRange = function(range){
    if (range) {
        this._coordinateRange.first = range.first;
        this._coordinateRange.second = range.second;
        this.preCalculate();
        return true;
    }
    return false;
};
Chart.Common.Coordinate.Date2DoubleLinearMapping.prototype.setValueRange = function(range){
    if (range) {
        this._valueRange.first = new Date(range.first.getFullYear(), range.first.getMonth(), range.first.getDate());
        this._valueRange.second = new Date(range.second.getFullYear(), range.second.getMonth(), range.second.getDate());
        this.preCalculate();
        return true;
    }
    return false;
};
Chart.Common.Coordinate.Date2DoubleLinearMapping.prototype.getCoordinate = function(date){
    if (this._valueRange.first.dateDiff("d", this._valueRange.second) != 0) {
        return this._coordinateRange.first + this._valueRange.first.dateDiff("d", date) * this._unitSpaceEveryDay;
    }
    else {
        return 0;
    }
};
Chart.Common.Coordinate.Date2DoubleLinearMapping.prototype.getDate = function(coordinate){
    if (this._coordinateRange.second - this._coordinateRange.first != 0) {
        return this._valueRange.first.dateAdd("d", Math.floor((coordinate - this._coordinateRange.first) * this._unitTimeEveryPt + 0.5));
    }
    else {
        return Chart.Common.Util.DateUtil.BASE_DATE();
    }
};

Chart.Common.Coordinate.Double2DoubleMapping = function(){
	var _crange = {
		first: 0,
		second: 0
	};
	var _vrange = {
		first: 0,
		second: 0
	};
    this._coordinateRange = _crange;
    this._valueRange = _vrange;
};
Chart.Common.Coordinate.Double2DoubleMapping.prototype.getCoordinateRange = function(){
    return this._coordinateRange;
};
Chart.Common.Coordinate.Double2DoubleMapping.prototype.getValueRange = function(){
    return this._valueRange;
};
Chart.Common.Coordinate.Double2DoubleMapping.prototype.setCoordinateRange = function(range){
    if (range) {
        //this._coordinateRange.first = range.first;
        //this._coordinateRange.second = range.second;
		this._coordinateRange = range;
        this.preCalculate(); //hook
        return true;
    }
    return false;
};
Chart.Common.Coordinate.Double2DoubleMapping.prototype.setValueRange = function(range){
    if (range) {
        //this._valueRange.first = range.first;
        //this._valueRange.second = range.second;
		this._valueRange = range;
        this.preCalculate(); //hook
        return true;
    }
    return false;
};
Chart.Common.Coordinate.Double2DoubleMapping.prototype.getCoordinate = function(value){
    //virtual
    return 0;
};
Chart.Common.Coordinate.Double2DoubleMapping.prototype.getValue = function(coordinate){
    //virtual
    return 0;
};

Chart.Common.Coordinate.Double2DoubleLinearMapping = function(){
    this._unitSpaceEveryDay = 0;
    this._unitValueEveryPt = 0;
    
    var mapping = this;
    
    this.preCalculate = function(){
        var valueDiff = mapping._valueRange.second - mapping._valueRange.first;
        var coorDiff = mapping._coordinateRange.second - mapping._coordinateRange.first;
        if (valueDiff == 0 || coorDiff == 0) {
            mapping._unitSpaceEveryDay = 0;
            mapping._unitValueEveryPt = 0;
        }
        else {
            mapping._unitSpaceEveryDay = coorDiff / valueDiff;
            mapping._unitValueEveryPt = valueDiff / coorDiff;
        }
    };
};
Chart.Common.Coordinate.Double2DoubleLinearMapping.prototype = $.extend(new Chart.Common.Coordinate.Double2DoubleMapping(),{
	getCoordinate: function(value){
		if ((this._valueRange.second - this._valueRange.first) != 0) {
			return this._coordinateRange.first + (value - this._valueRange.first) * this._unitSpaceEveryDay;
		}
		else {
			return 0;
		}
	},
	getValue: function(coordinate){
		if ((this._coordinateRange.second - this._coordinateRange.first) != 0) {
			return this._valueRange.first + (coordinate - this._coordinateRange.first) * this._unitValueEveryPt;
		}
		return 0;
	}
});

Chart.Common.Coordinate.Double2DoubleLogMapping = function(){
    this._adjustOffset = 0;
    
    var mapping = this;
    this.preCalculate = function(){
        if (mapping._valueRange.first < 1) {
            mapping._adjustOffset = 1 - mapping._valueRange.first;
        }
    };
};
Chart.Common.Coordinate.Double2DoubleLogMapping.prototype = $.extend(new Chart.Common.Coordinate.Double2DoubleMapping(),{
	getCoordinate: function(value){
		if ((this._valueRange.second - this._valueRange.first) != 0) {
			return this._coordinateRange.first +
			(Math.log(value + this._adjustOffset) - Math.log(this._valueRange.first + this._adjustOffset)) /
			(Math.log(this._valueRange.second + this._adjustOffset) - Math.log(this._valueRange.first + this._adjustOffset)) *
			(this._coordinateRange.second - this._coordinateRange.first);
		}
		else {
			return 0;
		}
	},
	getValue: function(coordinate){
		if ((this._coordinateRange.second - this._coordinateRange.first) != 0) {
			return Math.pow(Math.E, Math.log(this._valueRange.first) +
			(coordinate - this._coordinateRange.first) *
			(Math.log(this._valueRange.second) - Math.log(this._valueRange.first)) /
			(this._coordinateRange.second - this._coordinateRange.first));
		}
		else {
			return 0;
		}
	}
});

//---------- Common Coordinate Folder end ----------

//========== Common Command Folder start ==========
Chart.Common.Command = function(){
};

Chart.Common.Command.Commands = {
	COMMAND_START: -1,
	UPDATE_SELECTION: 0,
	RESIZE: 1,
	INITIALIZE: 2,
	COMPONENT_STATUS_UPDATE: 3,
	REFRESH_PRESENTATION: 4,
	UPDATE_TIME_RANGE: 5,
	ADD_INVESTMENT: 6,
	DELETE_ITEM: 7,
	DELETE_INVESTMENT: 8,
	ITEM_STATUS_UPDATE: 9,
	APPLY_CHART_SETTING: 10,
	GET_CHART_SETTING: 11,
	SET_CULTURE: 12,
	UPDATE_PERIOD: 13,
	COMMAND_END: 999
};

Chart.Common.Command.ComponentStatus = {
    BeginRequest: 1,
    EndRequest: 2,
    ClearAll: 3,
    ClearData: 4
};

Chart.Common.Command.CommandDirection = {
    ToRoot: 1,
    ToLeaf: 2
};

Chart.Common.Command.CommandArgs = function(sender, cmd, data, direction){
    this.sender = sender;
    this.command = cmd;
    this.data = data;
    this.direction = Chart.Common.Command.CommandDirection.ToLeaf;
    if (direction) 
        this.direction = direction;
    
    this.handled = false;
};

Chart.Common.Command.CommandHandler = function(){
	//var _firstLoaded = true;
    this.parentContainer = null; //CommandHandler
    this.interactiveChildren = []; //CommandHandler[]
    this.addChild = function(child){
        child.parentContainer = this;
		//if(_firstLoaded){
		//	_firstLoaded = false;
		//	this.interactiveChildren = [];
		//}
        this.interactiveChildren.push(child);
    };
};
Chart.Common.Command.CommandHandler.prototype.executeCommand = function(args){
    if (args == null || args.handled) {
        return;
    }
    
    var direction = args.direction;
    
    if (args.sender != this) {
        if (this.getHandler != null && typeof(this.getHandler) == "function") {
            var handler = this.getHandler(args);
            if (handler) {
                handler.apply(this, new Array(args));
                
                //pass to children node 
                args.direction = Chart.Common.Command.CommandDirection.ToLeaf;
                $(this.interactiveChildren).each(function(){
                    if (this.executeCommand) 
                        this.executeCommand(args);
                });
            }
        }
    }
    
    args.direction = direction;
    
    if (args.direction == Chart.Common.Command.CommandDirection.ToRoot && this.parentContainer) {
        args.sender = this;
        this.parentContainer.executeCommand(args);
    }
};
Chart.Common.Command.CommandHandler.prototype.collectionChildren = function(){
    //virtual
    this.interactiveChildren = [];
};

Chart.Common.Command.Args = function(){
};
Chart.Common.Command.Args.AddInvestmentArgs = function(investmentId){
    this.investmentId = investmentId;
    this.index = -1;
};
Chart.Common.Command.Args.ChartSettingArgs = function(setting){
	/*
	 * setting object in JSON format
	 */
	this.setting = setting;
};
Chart.Common.Command.Args.UpdateSelectionArgs = function(startIndex, endIndex){
    this.startIndex = startIndex;
    this.endIndex = endIndex;
};
Chart.Common.Command.Args.ItemStatusUpdateArgs = function(investmentId, itemKey, status){
    this.investmentId = startIndex;
    this.itemKey = itemKey;
    this.status = status;
};
//---------- Common Command Folder end ----------

//========== Common Data Folder start ==========
Chart.Common.Data = function(){
};

Chart.Common.Data.IChartBusinessManager = function(){
};
Chart.Common.Data.IChartBusinessManager.prototype = {
	getInvestmentName: function(investmentId){
	
	},
	getInvestmentSetting: function(investmentId){
	
	}
};

Chart.Common.Data.ListWrapper = function(data){
    this.data = [];
    if (data) 
        this.data = data;
};

Chart.Common.Data.TimeSeriesDatum = function(dateIndex, value){
    this.dateIndex = dateIndex;
    this.value = Number.NaN;
    if (value) 
        this.value = value;
};
Chart.Common.Data.TimeSeriesDatum.prototype.dateValue = function(){
    return Chart.Common.Util.DateUtil.getDateFromIndex(this.dateIndex);
};

//Chart.Common.Data.DataRecord = function(dataKey) {
//    this.dataKey = dataKey;
//    this.data = null;
//    this.dataStatus = 0;
//};

Chart.Common.Data.Item = function(){
};
Chart.Common.Data.ItemStatus = {
    Initialized: 0,
    Requesting: 1,
    DataResponseOK: 2,
    DataResponseEmpty: 3,
    DataResponseFailed: 4,
    DataCalculatedOK: 5,
    DataCalculatedEmpty: 6,
    DataCalculatedFailed: 7,
    DataDeferred: 99 // data request/calculation is deferred
};
Chart.Common.Data.ItemKey = function(){
	this.investmentId = "";
	this.dataId = "";
	
	this.secId = "";
	this.cfId = "";
	this.ticker = "";
	this.mpId = "";
};
Chart.Common.Data.ItemKey.prototype.toString = function(){
	return $.toJSON(this);
};

Chart.Common.Data.GroupDataRecord = function(dataKey){
	this.dataKey = dataKey;
    this.groupData = null;
    
    this.minValue = 0;
    this.maxValue = 0;
};
Chart.Common.Data.GroupDataRecord.prototype = {
	/*
	 * get the border value of current datarecord.
	 * this function will be called frequently, so it require high performance.
	 * @param null.
	 * @return null.
	 */
	parseBorderValue: function(){
		if (this.groupData == null || this.groupData.count < 1) {
			this.maxValue = 0;
			this.minValue = 0;
			return;
		}
		this.maxValue = -Number.MAX_VALUE;
		this.minValue = Number.MAX_VALUE;
		
		var vals = this.groupData.values();
		for (var i = 0, n = this.groupData.count; i < n; i++) {
			if (isNaN(vals[i])) 
				return;
			
			if (vals[i] > this.maxValue) {
				this.maxValue = vals[i];
			}
			if (vals[i] < this.minValue) {
				this.minValue = vals[i];
			}
		}
	}
};

Chart.Common.Data.TimeSeries = function(){
};
/**
 * Chart.Common.Data.TimeSeries.TimeSeriesDataRecord
 * @class Chart.Common.Data.TimeSeries.TimeSeriesDataRecord.
 * @note a package of series data, including data and dataKey.
 * @param dataKey {object} the identity of this record
 * @return current object.
 */
Chart.Common.Data.TimeSeries.TimeSeriesDataRecord = function(dataKey){
    this.dataKey = dataKey;
    this.tsData = null;
    
    this.minValue = 0;
    this.maxValue = 0;
    this.earliestDateIndex = 0;
    this.lastestDateIndex = 0;
};
Chart.Common.Data.TimeSeries.TimeSeriesDataRecord.prototype = {
	/*
     * get the border value of current datarecord.
     * this function will be called frequently, so it require high performance.
     * @param null.
     * @return null.
     */
	parseBorderValue: function(){
		if (this.tsData == null || this.tsData.data.length < 1) {
			this.maxValue = 0;
			this.minValue = 0;
			this.earliestDateIndex = 0;
			this.lastestDateIndex = 0;
			return;
		}
		this.maxValue = -Number.MAX_VALUE;
		this.minValue = Number.MAX_VALUE;
		
		/*
		var colsure = this;
	 	$(this.tsData.data).each(function(){
	 		if (isNaN(this.value))
	 		return;
	 
	 		if (this.value > colsure.maxValue) {
	 			colsure.maxValue = this.value;
	 		}
	 		if (this.value < colsure.minValue) {
	 			colsure.minValue = this.value;
	 		}
	 	});
	 	*/
		//more faster then the code above;
		var datum = null;
		for (var i = 0, n = this.tsData.data.length; i < n; i++) {
			datum = this.tsData.data[i];
			if (isNaN(datum.value)) 
				return;
			
			//Math.max,min will also slow the code.
			//colsure.maxValue = Math.max(colsure.maxValue,datum.value);
			//colsure.minValue = Math.min(colsure.minValue,datum.value);
			if (datum.value > this.maxValue) {
				this.maxValue = datum.value;
			}
			if (datum.value < this.minValue) {
				this.minValue = datum.value;
			}
		}
		
		this.earliestDateIndex = this.tsData.data[0].dateIndex;
		this.lastestDateIndex = this.tsData.data[this.tsData.data.length - 1].dateIndex;
	}
};

Chart.Common.Data.TimeSeries.TSDataSlicer = function(){
};
Chart.Common.Data.TimeSeries.TSDataSlicer.isPeriodEnd = function(frequencyEx){
	/*
    switch (frequencyEx.frequency) {
        case Chart.Common.Util.DataFrequency.Daily:
            return true;
        case Chart.Common.Util.DataFrequency.Weekly:
            return (previousDate.dateDiff("d", currentDate) > 7);
        case Chart.Common.Util.DataFrequency.Monthly:
            return ((nextDate.getFullYear() != currentDate.getFullYear()) || (nextDate.getMonth() != currentDate.getMonth())) &&
            (currentDate.getMonth() + 1) % frequencyEx.count == 0;
        case Chart.Common.Util.DataFrequency.Quarterly:
            return ((nextDate.getFullYear() != currentDate.getFullYear()) || (nextDate.getMonth() > currentDate.getMonth())) &&
            (currentDate.getMonth() + 1) % (frequencyEx.count * 3) == 0;
        case Chart.Common.Util.DataFrequency.Semiannually:
            return ((nextDate.getFullYear() != currentDate.getFullYear()) || (nextDate.getMonth() > currentDate.getMonth())) &&
            (currentDate.getMonth() + 1) % (frequencyEx.count * 6) == 0;
        case Chart.Common.Util.DataFrequency.Annually:
            return nextDate.getFullYear() > currentDate.getFullYear() &&
            currentDate.getFullYear() % frequencyEx.count == 0;
        default:
            return true;
    }
    */
	switch (frequencyEx.frequency) {
		case Chart.Common.Util.DataFrequency.Weekly:
			return function(currentDate, previousDate, nextDate){
				return (previousDate.dateDiff("d", currentDate) > 7);
			};
		case Chart.Common.Util.DataFrequency.Monthly:
			return function(currentDate, previousDate, nextDate){
				return ((nextDate.getFullYear() != currentDate.getFullYear()) || (nextDate.getMonth() != currentDate.getMonth())) &&
				(currentDate.getMonth() + 1) % frequencyEx.count == 0;
			};
		case Chart.Common.Util.DataFrequency.Quarterly:
			return function(currentDate, previousDate, nextDate){
				return ((nextDate.getFullYear() != currentDate.getFullYear()) || (nextDate.getMonth() > currentDate.getMonth())) &&
				(currentDate.getMonth() + 1) % (frequencyEx.count * 3) == 0;
			};
		case Chart.Common.Util.DataFrequency.Semiannually:
			return function(currentDate, previousDate, nextDate){
				return ((nextDate.getFullYear() != currentDate.getFullYear()) || (nextDate.getMonth() > currentDate.getMonth())) &&
				(currentDate.getMonth() + 1) % (frequencyEx.count * 6) == 0;
			};
		case Chart.Common.Util.DataFrequency.Annually:
			return function(currentDate, previousDate, nextDate){
				return nextDate.getFullYear() > currentDate.getFullYear() && currentDate.getFullYear() % frequencyEx.count == 0;
			};
		case Chart.Common.Util.DataFrequency.Daily:
			return function(){
				return true;
			};
	}
};
Chart.Common.Data.TimeSeries.TSDataSlicer.isPeriodStart = function(currentDate, previousDate, frequencyEx){
    switch (frequencyEx.frequency) {
        case Chart.Common.Util.DataFrequency.Daily:
            return true;
        case Chart.Common.Util.DataFrequency.Weekly:
            return (previousDate.dateDiff("d", currentDate) > 7);
        case Chart.Common.Util.DataFrequency.Monthly:
            return ((previousDate.getFullYear() != currentDate.getFullYear()) || (currentDate.getMonth() > previousDate.getMonth())) &&
            (currentDate.getMonth() + 1) % frequencyEx.count == 0;
        case Chart.Common.Util.DataFrequency.Quarterly:
            return ((previousDate.getFullYear() != currentDate.getFullYear()) || (currentDate.getMonth() > previousDate.getMonth())) &&
            (currentDate.getMonth() + 1) % (frequencyEx.count * 3) == 0;
        case Chart.Common.Util.DataFrequency.Semiannually:
            return ((previousDate.getFullYear() != currentDate.getFullYear()) || (currentDate.getMonth() > previousDate.getMonth())) &&
            (currentDate.getMonth() + 1) % (frequencyEx.count * 6) == 0;
        case Chart.Common.Util.DataFrequency.Annually:
            return currentDate.getFullYear() > previousDate.getFullYear() &&
            currentDate.getFullYear() % frequencyEx.count == 0;
        default:
            return true;
    }
};
Chart.Common.Data.TimeSeries.TSDataSlicer.getFrequencyRatio = function(frequencyEx){
    switch (frequencyEx.frequency) {
        case Chart.Common.Util.DataFrequency.Daily:
            return frequencyEx.count;
        case Chart.Common.Util.DataFrequency.Weekly:
            return frequencyEx.count * 7;
        case Chart.Common.Util.DataFrequency.Monthly:
            return frequencyEx.count * 30;
        case Chart.Common.Util.DataFrequency.Quarterly:
            return frequencyEx.count * 90;
        case Chart.Common.Util.DataFrequency.Semiannually:
            return frequencyEx.count * 180;
        case Chart.Common.Util.DataFrequency.Annually:
            return frequencyEx.count * 365;
    }
    return 0;
};
Chart.Common.Data.TimeSeries.TSDataSlicer.getSliceFrequency = function(maxDotCount, maxDateCount, minRatio){
	if (!minRatio) 
		minRatio = 0;
	var dateToDotRatio = maxDateCount / maxDotCount;
	dateToDotRatio = Math.max(minRatio, dateToDotRatio);
	if (dateToDotRatio <= 1) {
		return new Chart.Common.Util.DataFrequencyEx(Chart.Common.Util.DataFrequency.Daily, 1);
	}
	else 
		if (dateToDotRatio <= 7) {
			return new Chart.Common.Util.DataFrequencyEx(Chart.Common.Util.DataFrequency.Weekly, 1);
		}
		else 
			if (dateToDotRatio < 30) {
				return new Chart.Common.Util.DataFrequencyEx(Chart.Common.Util.DataFrequency.Monthly, 1);
			}
			else 
				if (dateToDotRatio < 90) {
					return new Chart.Common.Util.DataFrequencyEx(Chart.Common.Util.DataFrequency.Quarterly, 1);
				}
				else 
					if (dateToDotRatio < 180) {
						return new Chart.Common.Util.DataFrequencyEx(Chart.Common.Util.DataFrequency.Semiannually, 1);
					}
					else 
						if (dateToDotRatio < 365) {
							return new Chart.Common.Util.DataFrequencyEx(Chart.Common.Util.DataFrequency.Annually, 1);
						}
						else 
							if (dateToDotRatio < 730) {
								return new Chart.Common.Util.DataFrequencyEx(Chart.Common.Util.DataFrequency.Annually, 2);
							}
							else 
								if (dateToDotRatio < 1825) {
									return new Chart.Common.Util.DataFrequencyEx(Chart.Common.Util.DataFrequency.Annually, 5);
								}
								else {// if (dateToDotRatio < 3650) {
									return new Chart.Common.Util.DataFrequencyEx(Chart.Common.Util.DataFrequency.Annually, 10);
								}
};
Chart.Common.Data.TimeSeries.TSDataSlicer.sliceDataByFreqency = function(tsNodelist, frequencyEx, startDateIndex, endDateIndex, getPeriodEnd){
    function getStartPosition(){
        if (tsNodelist.data[0].dateIndex >= startDateIndex) 
            return 0;
        if (tsNodelist.data[nodeCount - 1].dateIndex <= startDateIndex) 
            return -1;
        
        var begin = 0;
        var end = nodeCount - 1;
        while (end - begin >= 2) {
            var mid = begin + Math.floor((end - begin) / 2);
            if (tsNodelist.data[mid].dateIndex < startDateIndex) {
                begin = mid;
            }
            else {
                end = mid;
            }
        }
        if (tsNodelist.data[begin].dateIndex == startDateIndex) {
            return begin;
        }
        else {
            return end;
        }
    }
    function getEndPosition(){
        if (tsNodelist.data[nodeCount - 1].dateIndex <= endDateIndex) 
            return nodeCount - 1;
        if (tsNodelist.data[0].dateIndex >= endDateIndex) 
            return -1;
        
        var begin = 0;
        var end = nodeCount - 1;
		var dateIndex = 0;
		var mid = 0;
        while (end - begin >= 2) {
			mid = begin + Math.floor((end - begin) / 2);
			dateIndex = tsNodelist.data[mid].dateIndex;
			if (dateIndex == endDateIndex) {
				return mid;
			}
			if (dateIndex < endDateIndex) {
				begin = mid;
			}
			else {
				end = mid;
			}
		}
        if (tsNodelist.data[end].dateIndex == endDateIndex) {
            return end;
        }
        else {
            return begin;
        }
    }
    function getNextIndex(currentIndex, currentDate){
		var date = currentDate.dateAdd(frequencyEx.frequency, frequencyEx.count);
		return currentIndex + currentDate.dateDiff("d", date);
	}
	
	var d = +new Date();
    var newList = new Chart.Common.Data.ListWrapper([]);
    var nodeCount = tsNodelist.data.length;
    var startPos = getStartPosition();
    var endPos = getEndPosition();
    if (startPos < 0 || endPos <= startPos) 
        return newList;
    
    if (getPeriodEnd) {
		/*
	 	var fun = Chart.Common.Data.TimeSeries.TSDataSlicer.isPeriodEnd(frequencyEx);
	 	for (var i = startPos; i < endPos; i++) {
	 	var currentNode = tsNodelist.data[i];
	 	var currentIndex = currentNode.dateIndex;
	 	var currentDate = currentNode.dateValue();
	 	//            if (currentIndex < startDateIndex) { continue; }
	 	//            if (currentIndex > endDateIndex) { break; }
	 
	 	var nextDate = tsNodelist.data[i + 1].dateValue();
	 
	 	//try to keep the selection
	 	if (currentIndex == startDateIndex ||
	 	currentIndex == endDateIndex ||
	 	fun(currentDate, previousDate, nextDate)) {
	 	newList.data.push(currentNode);
	 	previousDate = currentDate;
	 	}
	 	}
	 	var tsNode = tsNodelist.data[endPos];
	 	if (tsNode.dateIndex >= startDateIndex &&
	 	tsNode.dateIndex <= endDateIndex) {
	 	newList.data.push(tsNode);
	 	}
	 	*/
		
		//new method, much faster then the code above.
		//require the series should be continuous in time.
		//todo: only support daily series, will add the other frequency here.
		newList.data.push(tsNodelist.data[startPos]);
		var startDate = tsNodelist.data[startPos].dateValue();
		var currentDate = Chart.Common.Util.DateUtil.getPeriodEnd(startDate, frequencyEx.frequency);
		var currentIndex = startDate.dateDiff("d", currentDate) + startPos;
		var datum = null;
		
		if (currentDate == startDate) 		//avoid double add first node.
			currentIndex = getNextIndex(currentIndex, currentDate);
		while (currentIndex <= endPos) {
			datum = tsNodelist.data[currentIndex];
			currentDate = Chart.Common.Util.DateUtil.getDateFromIndex(datum.dateIndex + 1);	//+1 for update the datetime to next period's start.
			currentIndex = getNextIndex(currentIndex, currentDate);
			newList.data.push(datum);
		}
		newList.data.push(tsNodelist.data[endPos]);
	}
	else {
		//useless code;
		var previousDate = new Date(1900, 0, 1);
		var tsNode = tsNodelist.data[startPos];
		if (tsNode.dateIndex >= startDateIndex &&
		tsNode.dateIndex <= endDateIndex) {
			newList.data.push(tsNode);
			previousDate = tsNode.dateValue();
		}
		for (var i = startPos + 1; i <= endPos; i++) {
			var currentNode = tsNodelist.data[i];
			var currentIndex = currentNode.dateIndex;
			var currentDate = currentNode.dateValue();
			if (currentIndex < startDateIndex) {
				continue;
			}
			if (currentIndex > endDateIndex) {
				break;
			}
			
			if (Chart.Common.Data.TimeSeries.TSDataSlicer.isPeriodStart(currentDate, previousDate, frequencyEx)) {
				newList.data.push(currentNode);
				previousDate = currentDate;
			}
		}
	}
	ChartLogger.instance.write(String.format("[time-consuming] time consuming of slice data from {0} to {1}: {2}, freq: {3}",startDateIndex,endDateIndex,(+new Date() - d),frequencyEx));
    return newList;
};
Chart.Common.Data.TimeSeries.TSDataSlicer.sliceDataByFreqencyDaily = function(tsNodelist, frequencyEx, startNodeIndex, endNodeIndex){
	var getNextIndex = function(currentIndex, currentDate){
		var date = currentDate.dateAdd("d", 1).dateAdd(frequencyEx.frequency, frequencyEx.count);
		return currentIndex + currentDate.dateDiff("d", date) - 1;
	};
	
	var result = [];
	var startDate = tsNodelist.data[startNodeIndex].dateValue();
	var currentDate = Chart.Common.Util.DateUtil.getPeriodEnd(startDate, frequencyEx.frequency);
	var currentIndex = startDate.dateDiff("d", currentDate) + startNodeIndex;
	var datum = null;
	while (currentIndex <= endNodeIndex) {
		datum = tsNodelist.data[currentIndex];
		currentDate = datum.dateValue();
		currentIndex = getNextIndex(currentIndex, currentDate);
		result.push(datum);
	}
	return result;
};
Chart.Common.Data.TimeSeries.TSDataSlicer.getSingleCurrentData = function(totalData, maxDotCount, startIndex, endIndex, getPeriodEnd, minFrequency){
    if (!minFrequency) 
        minFrequency = new Chart.Common.Util.DataFrequencyEx(Chart.Common.Util.DataFrequency.Daily, 1);
    
    if (totalData.tsData == null) {
        return null;
    }
    var freqencyEx = Chart.Common.Data.TimeSeries.TSDataSlicer.getSliceFrequency(maxDotCount, endIndex - startIndex, Chart.Common.Data.TimeSeries.TSDataSlicer.getFrequencyRatio(minFrequency) - 1);
    
    var data = Chart.Common.Data.TimeSeries.TSDataSlicer.sliceDataByFreqency(totalData.tsData, freqencyEx, startIndex, endIndex, getPeriodEnd);
    var returnData = new Chart.Common.Data.TimeSeries.TimeSeriesDataRecord(totalData.dataKey);
    returnData.tsData = data;
    returnData.parseBorderValue();
    
    return returnData;
};
Chart.Common.Data.TimeSeries.TSDataSlicer.getAllCurrentData = function(totalDataRecords, maxDotCount, startIndex, endIndex, getPeriodEnd, minFrequency){
    if (!minFrequency) 
        minFrequency = new Chart.Common.Util.DataFrequencyEx(Chart.Common.Util.DataFrequency.Daily, 1);
    if (totalDataRecords == null || totalDataRecords.length < 1) {
        return null;
    }
    var currentRecords = new Array();
    $(totalDataRecords).each(function(){
        var temp = Chart.Common.Data.TimeSeries.TSDataSlicer.getSingleCurrentData(this, maxDotCount, startIndex, endIndex, getPeriodEnd, minFrequency);
        if (temp != null) {
            currentRecords.push(temp);
        }
    });
    return currentRecords;
};

Chart.Common.Data.TimeSeries.TSUtil = function(){
};
Chart.Common.Data.TimeSeries.TSUtil.increaseMonth = function(date, monthCount){
    return new Date(date.getFullYear(), date.getMonth(), 1).dateAdd("m", monthCount);
};
Chart.Common.Data.TimeSeries.TSUtil.increaseYear = function(date, yearCount){
    return new Date(date.getFullYear(), 0, 1).dateAdd("a", yearCount);
};
Chart.Common.Data.TimeSeries.TSUtil.getNextPeriodEnd = function(date, frequencyEx){
    switch (frequencyEx.frequency) {
        case Chart.Common.Util.DataFrequency.Daily:
            return date.dateAdd("d", -frequencyEx.count + 1).dateAdd("d", -1);
        case Chart.Common.Util.DataFrequency.Weekly:
            return date.dateAdd("d", -frequencyEx.count * 7 + 1).dateAdd("d", -1);
        case Chart.Common.Util.DataFrequency.Monthly:
            return Chart.Common.Data.TimeSeries.TSUtil.increaseMonth(date, -frequencyEx.count + 1).dateAdd("d", -1);
        case Chart.Common.Util.DataFrequency.Quarterly:
            return Chart.Common.Data.TimeSeries.TSUtil.increaseMonth(date, -frequencyEx.count * 3 + 1).dateAdd("d", -1);
        case Chart.Common.Util.DataFrequency.Semiannually:
            return Chart.Common.Data.TimeSeries.TSUtil.increaseMonth(date, -frequencyEx.count * 6 + 1).dateAdd("d", -1);
        case Chart.Common.Util.DataFrequency.Annually:
            return Chart.Common.Data.TimeSeries.TSUtil.increaseYear(date, -frequencyEx.count + 1).dateAdd("d", -1);
        default:
            throw new Exception(); // todo: 
    }
};
Chart.Common.Data.TimeSeries.TSUtil.createDateTimeMarks = function(start, end, frequencyEx){
    var marklist = new Array();
    var current = end;
    while (current > start) {
        marklist.push(current);
        current = Chart.Common.Data.TimeSeries.TSUtil.getNextPeriodEnd(current, frequencyEx);
    }
    if (marklist.length > 0) {
        marklist.push(start);
        marklist.reverse();
    }
    return marklist;
};

//---------- Common Data Folder end ----------

//========== Common Control Folder start ==========
Chart.Common.Controls = function(){
};
/**
 * Chart.Common.Controls.Panel
 * @class Chart.Common.Controls.Panel.
 * @note Container of all floating dialog.
 * @param containerDom {Jquery search package} parent element. will use document.body as default
 * @return current object.
 */
Chart.Common.Controls.Panel = function(containerDom){
	var html = '<div class="chart-panel">' +
	'<div class="container">' +
	'<div class="ctn"></div>' +
	'</div>' +
	'<div class="shadow"></div>' +
	'</div>';
	this.jqDOM = $(html);
	this.ctn = null;
	this.shadow = null;
	this._init(containerDom);
	return this;
};
Chart.Common.Controls.Panel.prototype = {
    _init: function(containerDom){
		var self = this;
		this.ctn = this.jqDOM.find('.ctn');
		this.shadow = this.jqDOM.find('.shadow');
		this.jqDOM.appendTo(containerDom ? containerDom : jQuery('body', document));
	},
    setContent: function(obj){
        this.ctn.append(obj);
    },
    setTitle: function(str){
        this.title.html(str);
    },
	setBackGround:function(className){
		this.shadow.addClass(className);
	},
	setPosition: function(pt){
		this.jqDOM.css({
			left: pt.x,
			top: pt.y
		});
	},
  	getSize: function(){
		var margin = $.getMargins(this.jqDOM.get(0), true);
		return {
			width: this.jqDOM.width() + margin.l + margin.r,
			height: this.jqDOM.height() + margin.t + margin.b
		};
	},
    show: function(){
        this.jqDOM.find('.shadow').css({
            height: this.jqDOM.height()
        });
        this.jqDOM.show();
    },
    hide: function(){
		this.jqDOM.removeCSS("width,height");
        this.jqDOM.hide();
    },
    del: function(){
        this.jqDOM.remove();
    }
};

Chart.Common.Controls.TipStatus = {
	Hide: 0,
	Show: 1,
	Fixed: 2
};
Chart.Common.Controls.TipDirection = {
	TopLeft: 0,
	TopRight: 1,
	BottomLeft: 2,
	BottomRight: 3
};

/**
 * Chart.Common.Controls.ITooltip
 * @class Chart.Common.Controls.ITooltip.
 * @note Abstract class of all tooltip classes. can't be used directly.
 * @param null.
 * @return current object.
 * @abstract
 */
Chart.Common.Controls.ITooltip = function(){
	this.container = null;
	this.activeRegion = {x: 0,y: 0,width: 0,height: 0};
	this.dialogSize = {width: 0,height: 0};
	this.status = Chart.Common.Controls.TipStatus.Hide;
	this.direction = Chart.Common.Controls.TipDirection.TopLeft;
	this.panel = null;
	this.offset = 1;
	return this;
};
Chart.Common.Controls.ITooltip.prototype = {
	popupAt:function(pt){
		
	},
	hide:function(){
		
	},
	/*
     * set the contents to show in tooltip.
     * @param ctnArray {[{first:string,second:string},...]} content.
     * @return null.
     */
	setContent:function(ctnArray){
		
	},
	/*
     * update the tip's active region and drag region.
     * @param activeRegion {{x:integer,y:integer,width:integer,height:integer}} content.
     * @return null.
     */
	setActiveRegion: function(activeRegion){
		this.activeRegion = activeRegion;
		this.panel.jqDOM.dragOption({
			rect: this.activeRegion
		});
	},
	_initialize: function(){
		this.panel = new Chart.Common.Controls.Panel(this.container);
		this.panel.hide();
		this._initializeEx();
	},
	_initializeEx:function(){
	},
	_moveTo:function(pt){
		this.panel.setPosition(pt);
	},
	_resize: function(){
		//resize tip dialog
		//this.panel.jqDOM.removeAttr("width");
		//this.panel.jqDOM.removeAttr("height");
		this.panel.jqDOM.removeCSS("width,height");
		this.panel.show();
		var size = this.panel.getSize();
		size.width = size.width > this.minWidth ? size.width : this.minWidth;
		this.panel.hide();
		//this.panel.jqDOM.width(size.width);
		//this.panel.jqDOM.height(size.height);
		this.panel.jqDOM.css({
			width: size.width,
			height: size.height
		});
		
		this.dialogSize.width = size.width;
		this.dialogSize.height = size.height;
	},
	/*
     * decide which place a tip should be shown.
     * @param pt {{x:number,y:number}} reference position.
     * @return null.
     */
	_setTipDirection:function(pt){
		if (this.activeRegion.width > pt.x + this.dialogSize.width * 0.5) {
			if (pt.y > this.dialogSize.height) {
				this.direction = Chart.Common.Controls.TipDirection.TopRight;
			}
			else {
				this.direction = Chart.Common.Controls.TipDirection.BottomRight;
			}
		}
		else {
			if (pt.y > this.dialogSize.height) {
				this.direction = Chart.Common.Controls.TipDirection.TopLeft;
			}
			else {
				this.direction = Chart.Common.Controls.TipDirection.BottomLeft;
			}
		}
	},
	/*
     * decide which place a tip should be shown. by center
     * @param pt {{x:number,y:number}} reference position.
     * @return null.
     */
	_setTipDirection2: function(pt){
		var tempMiddleX = this.activeRegion.x + this.activeRegion.width / 2;
		var tempMiddleY = this.activeRegion.y + this.activeRegion.height / 2;
		if (pt.y < tempMiddleY) {
			if (pt.x < tempMiddleX) 
				this.direction = Chart.Common.Controls.TipDirection.BottomRight;
			else 
				this.direction = Chart.Common.Controls.TipDirection.BottomLeft;
		}
		else {
			if (pt.x < tempMiddleX) 
				this.direction = Chart.Common.Controls.TipDirection.TopRight;
			else 
				this.direction = Chart.Common.Controls.TipDirection.TopLeft;
		}
	},
	/*
     * decide which place a tip should be shown, and move the tip to target position.
     * @param pt {{x:number,y:number}} reference position.
     * @return null.
     */
	_adjustTipPlace: function(pt){
		this._setTipDirection(pt);
		switch (this.direction) {
			case Chart.Common.Controls.TipDirection.TopLeft:
				this._moveTo({
					x: pt.x - this.dialogSize.width - this.offset,
					y: pt.y - this.dialogSize.height - this.offset
				});
				break;
			case Chart.Common.Controls.TipDirection.TopRight:
				this._moveTo({
					x: Math.min(pt.x + this.offset, this.activeRegion.width - this.dialogSize.width),
					y: pt.y - this.dialogSize.height - this.offset
				});
				break;
			case Chart.Common.Controls.TipDirection.BottomLeft:
				this._moveTo({
					x: pt.x - this.dialogSize.width - this.offset,
					y: pt.y + this.offset
				});
				break;
			default://BottomRight
				this._moveTo({
					x: Math.min(pt.x + this.offset, this.activeRegion.width - this.dialogSize.width),
					y: pt.y + this.offset
				});
				break;
		}
	}
};

/**
 * Chart.Common.Controls.BasicTip
 * @class Chart.Common.Controls.BasicTip.
 * @note The most normal tip, only show text in it.
 * @param containerDom {Jquery search package} the referece of element which will has this tip.
 * @return current object.
 */
Chart.Common.Controls.BasicTip = function(containerDom){
	this.minWidth = 50;
	this.container = containerDom;
	this._initialize();
	return this;
};
Chart.Common.Controls.BasicTip.prototype = $.extend(new Chart.Common.Controls.ITooltip(),{
	/*
	 * override
	 */
	popupAt:function(pt){
		this._adjustTipPlace(pt);
		this._setStatus(Chart.Common.Controls.TipStatus.Show);
	},
	/*
	 * override
	 */
	hide:function(){
		this._setStatus(Chart.Common.Controls.TipStatus.Hide);
	},
	/*
	 * override
	 */
	setContent: function(ctnArray){
		var str = "";
		$(ctnArray).each(function(){
			str += "<h5>" + this + "</h5>";
		});
		this.panel.msg.html(str);
		this._resize();
	},
	/*
     * switch tip status
     * @param status {Chart.Common.Controls.TipStatus}.
     * @return null.
     */
	_setStatus:function(status){
		switch (status) {
			case Chart.Common.Controls.TipStatus.Fixed:
			case Chart.Common.Controls.TipStatus.Show:
				this.panel.show();
				this.status = Chart.Common.Controls.TipStatus.Show;
				break;
			case Chart.Common.Controls.TipStatus.Hide:
			default:
				this.panel.hide();
				this.status = Chart.Common.Controls.TipStatus.Hide;
				break;
		}
	},

	/*
	 * override
	 */
	_initializeEx: function(){
		this.panel.setContent($("<div>Message</div>").addClass("msg"));
		this.panel.msg = this.panel.ctn.find(".msg");
		this.panel.jqDOM.addClass("basic-tip").css({
			"cursor": "default"
		}).drag({
			isInDragArea: function(pt){
				return false;
			}
		});
	}
});

/**
 * Chart.Common.Controls.GraphRectTip
 * @class Chart.Common.Controls.GraphRectTip.
 * @note rectangle tip, contains title and a fixed flag.
 * @param containerDom {Jquery search package} the referece of element which will has this tip.
 * @return current object.
 */
Chart.Common.Controls.GraphRectTip = function(containerDom)
{
	this.minWidth = 50;
	this.container = containerDom;
	this._initialize();
	return this;
};
Chart.Common.Controls.GraphRectTip.prototype = $.extend(new Chart.Common.Controls.ITooltip(),{
	/*
	 * override
	 */
	popupAt:function(pt){
		this._adjustTipPlace(pt);
		this._setStatus(Chart.Common.Controls.TipStatus.Show);
	},
	/*
	 * override
	 */
	hide:function(){
		this._setStatus(Chart.Common.Controls.TipStatus.Hide);
	},
	/*
	 * override
	 */
	setContent: function(ctnArray){
		var str = "";
		$(ctnArray).each(function(){
			str += "<h5>" + this + "</h5>";
		});
		this.panel.msg.html(str);
		this._resize();
	},
	/*
     * special interface for GraphRectTip, will show a title abort the context. 
     * @param title {string}. string to show in title.
     * @return null.
     */
	setTitle: function(title){
		this.panel.titleMsg.html(title);
		this._resize();
	},
	/*
     * switch tip status
     * @param status {Chart.Common.Controls.TipStatus}.
     * @return null.
     */
	_setStatus:function(status){
		switch (status) {
			case Chart.Common.Controls.TipStatus.Fixed:
				this.panel.show();
				this.status = Chart.Common.Controls.TipStatus.Fixed;
				break;
			case Chart.Common.Controls.TipStatus.Show:
				this.panel.show();
				this.status = Chart.Common.Controls.TipStatus.Show;
				break;
			case Chart.Common.Controls.TipStatus.Hide:
			default:
				this.panel.hide();
				this.status = Chart.Common.Controls.TipStatus.Hide;
				break;
		}
	},
	/*
	 * override
	 */
	_initializeEx: function(){
		this.panel.setContent($("<div><h5>Title</h5></div>").addClass("title"));
		this.panel.setContent($("<div>Message</div>").addClass("msg"));
		this.panel.titleMsg = this.panel.ctn.find(".title h5");
		this.panel.msg = this.panel.ctn.find(".msg");
		this.panel.jqDOM.addClass("rect-tip").css({
			"cursor": "default"
		}).drag({
			rect:this.activeRegion
		});
	}
});

/**
 * Chart.Common.Controls.BasicTipFactory
 * @class Chart.Common.Controls.BasicTipFactory.
 * @note Factory to create basic tip in "phTip" holder.
 * @param null.
 * @return current object.
 */
Chart.Common.Controls.BasicTipFactory = function(){
	var postfix = "";
	if (arguments.length > 0) 
		postfix = arguments[0];
	this.container = $("#phTip" + postfix);
	this.activeRegion = {
		x: 0,
		y: 0,
		width: 800,
		height: 600
	};
	this.clearChildren();
	return this;
};
Chart.Common.Controls.BasicTipFactory.prototype = $.extend(new Chart.Common.Util.ChildManagerTool("Chart.Common.Controls.BasicTip") ,{
	create: function(){
		var tip = this.getChild(this.container);
		tip.activeRegion = this.activeRegion;
		//tip.hide();
		return tip;
	},
	setActiveRegion: function(region){
		this.activeRegion.x = region.x;
		this.activeRegion.y = region.y;
		this.activeRegion.width = region.width;
		this.activeRegion.height = region.height;
	}
});

/**
 * Chart.Common.Controls.GraphRectTipFactory
 * @class Chart.Common.Controls.GraphRectTipFactory.
 * @note Factory to create graph rect tip in "phTip" holder.
 * @param null.
 * @return current object.
 */
Chart.Common.Controls.GraphRectTipFactory = function(){
	var postfix = "";
	if (arguments.length > 0) 
		postfix = arguments[0];
	this.container = $("#phTip" + postfix);
	this.activeRegion = {
		x: 0,
		y: 0,
		width: 800,
		height: 600
	};
	this.clearChildren();
	return this;
};
Chart.Common.Controls.GraphRectTipFactory.prototype = $.extend(new Chart.Common.Util.ChildManagerTool("Chart.Common.Controls.GraphRectTip") ,{
	create: function(){
		var tip = this.getChild(this.container);
		tip.setActiveRegion(this.activeRegion);
		//tip.hide();
		return tip;
	},
	setActiveRegion: function(region){
		this.activeRegion.x = region.x;
		this.activeRegion.y = region.y;
		this.activeRegion.width = region.width;
		this.activeRegion.height = region.height;
	}
});

//---------- Common Control Folder end ----------

//========== Common Globalization Folder start ==========
var Globalization = function(){
};
Globalization.DateFormatType = {
    Normal: 0,
    Shorter: 1
};
Globalization.ShortFormatType = {
    NONE: -1,
    SHORT_FORMAT_KILO: 0,
    SHORT_FORMAT_MEGA: 1,
    SHORT_FORMAT_BIL: 2
};

var LocalizationManager = function(){

	var ROOT_PATH = "root";
	var FILE_NAME = "label.xml";

    var _labelMap = null;		//Dictionary<string, string>
    var _dataPointMap = null;	//Dictionary<string, string>
	var _currentCulture = "en_us";
    
	var _serverPath = "xml/";
	var _resourceFileName = FILE_NAME;
	var _initCallbackList = [];	//List<function(bool)>
	
    // date format
    var _dateFormatDaily = "MM-dd-yyyy";
    var _dateFormatMonthly = "MM-yyyy";
    var _dateFormatAnnaully = "yyyy";
    var _shortDateFormatDaily = "MM-dd-yy";
    var _shortDateFormatMonthly = "MM-yy";
    var _shortDateFormatAnnaully = "yy";
    
    // currency and number
    var _currencySymbol = "";
    var _clusterCount = 3;
    var _divider = ",";
    var _radixPoint = ".";
    
    var me = this;
    
	this.initialize = function(uri, filename){
		//_initCallbackList.push(statusCallback);
		_serverPath = uri;
		_resourceFileName = filename;
		//downloadResource();
	};
	
	this.setCurrentCulture = function(cultureName, statusCallback){
		var reg=/<[^>]+>/g;
		_initCallbackList.push(statusCallback);
		if (reg.test(cultureName)) {
			informCallback(initCfg($(cultureName)));
		}
		else {
			_currentCulture = cultureName;			
			downloadResource();
		}
	};
	this.getCurrentCulture = function(){
		return _currentCulture;
	};
    this.getLabel = function(labelName, defaultText){
		labelName=labelName.toLowerCase();
        if (_labelMap != null && _labelMap.containsKey(labelName)) {
            var slabel = _labelMap.item(labelName);
            if (slabel) 
                return slabel;
        }
        return defaultText;
    };
    this.getDateFormat = function(frequency, type){
        var dateFormat = _dateFormatAnnaully;
        switch (frequency) {
            case Chart.Common.Util.DataFrequency.Annually:
            case Chart.Common.Util.DataFrequency.Irregular:
            case Chart.Common.Util.DataFrequency.None:
                dateFormat = type == Globalization.DateFormatType.Normal ? _dateFormatAnnaully : _shortDateFormatAnnaully;
                break;
            case Chart.Common.Util.DataFrequency.Semiannually:
            case Chart.Common.Util.DataFrequency.Quarterly:
            case Chart.Common.Util.DataFrequency.Monthly:
                dateFormat = type == Globalization.DateFormatType.Normal ? _dateFormatMonthly : _shortDateFormatMonthly;
                break;
            case Chart.Common.Util.DataFrequency.Weekly:
            case Chart.Common.Util.DataFrequency.Daily:
                dateFormat = type == Globalization.DateFormatType.Normal ? _dateFormatDaily : _shortDateFormatDaily;
                break;
            default:
                break;
        }
        return dateFormat;
    };
	this.getDailyDateString = function(date){
        return this.formatDate(date, this.getDateFormat(Chart.Common.Util.DataFrequency.Daily, Globalization.DateFormatType.Normal));
    };
    this.formatDate = function(date, format){
        var dateStr = format.toLowerCase();
        //for year conversion
        var yearStr = date.getFullYear().toString();
        dateStr = dateStr.replace(/yyyy/g, yearStr);
        dateStr = dateStr.replace(/yy/g, yearStr.substr(yearStr.length - 2));
        
        //for month conversion
        dateStr = dateStr.replace(/mmmm/g, this.getLabel("month" + date.getMonth().toString(), date.getMonth().toString()));
        dateStr = dateStr.replace(/mmm/g, this.getLabel("abmonth" + date.getMonth().toString(), date.getMonth().toString()));
        dateStr = dateStr.replace(/mm/g, pad(date.getMonth() + 1));
        dateStr = dateStr.replace(/m/g, (date.getMonth() + 1).toString());
        
        //for day conversion
        //    dateStr = dateStr.replace(/dddd/g, this.getLabel(date.getDay().ToString().ToLower(), date.DayOfWeek.ToString()));
        dateStr = dateStr.replace(/dd/g, pad(date.getDate()));
        dateStr = dateStr.replace(/d/g, date.getDate().toString());
        return dateStr;
        
    };
    this.formatDecimal = function(value, digitCount){
		if ($.isNull(digitCount) || digitCount < 0) 
			digitCount = -1;
		return formatDecimalWithDigitCount(value, digitCount);
	};
    this.removeTrailingZero = function(numberString){
        while (numberString.indexOf(_radixPoint) >= 0 &&
        (numberString.lastIndexOf('0') == numberString.length - 1 ||
        numberString.lastIndexOf(_radixPoint) == numberString.length - 1)) {
            numberString = numberString.substr(0, numberString.length - 1);
        }
        
        return numberString;
    };
	/*
	 * download special file and return the result
	 * @param fileUri {string} file path
	 * @param callback {function(bool, string)} callback event after download completed
	 * @return null;
	 */
	this.downloadFile = function(fileUri, callback){
		if (!callback || typeof(callback) != "function") {
			return;
		}
		
		if (fileUri == null || fileUri == "" || fileUri.length <= 1) {
			callback(false, null);
		}
		if (_currentCulture == "") {
			downloadFileEx(fileUri, callback);
			return;
		}
		var index = fileUri.lastIndexOf(".");
		if (index < 0) {
			downloadFileEx(fileUri, callback);
			return;
		}
		var uri = fileUri.substr(0, index) + "_" + _currentCulture + fileUri.substr(index);
		$.ajax({
			type: "GET",
			url: uri,
			success: function(msg){
				callback(true, msg);
				ChartLogger.instance.write("[download-resource] success to download resource: " + uri);
			},
			error: function(msg){
				ChartLogger.instance.write("[download-resource] failed to download resource: " + uri);
				downloadFileEx(fileUri, callback);
				return;
			}
		});
	};
    
    function pad(v, isPad, padlength){
        if (padlength == null) 
            padlength = 2;
        if (isPad == null || isPad) {
            var str = v.toString();
            if (str.length < padlength) {
                var extLength = padlength - str.length;
                for (var i = 0; i < extLength; i++) {
                    str = "0" + str;
                }
            }
            return str;
        }
        if (!isPad) {
            return v;
        }
    }
    function formatDecimalWithDigitCount(value, digitCount){
        var sign = "";
        if (digitCount != -1) {
            var factor = Math.pow(10, digitCount);
            value = Math.round(value * factor) / factor;
        }
        if (value < 0) {
            sign = "-";
        }
        var result = Math.abs(value).toString();
        
        var index = result.indexOf(".");
        if (index == -1) {
            result += _radixPoint; //".";
            index = result.length - 1;
        }
        var integer = result.substr(0, index);
        if (_clusterCount > 0) {
            var length = integer.length;
            while (length > _clusterCount) {
                integer = integer.substr(0, length - _clusterCount) +
                _divider +
                integer.substr(length - _clusterCount, integer.length - length + _clusterCount);
                length -= _clusterCount;
            }
        }
        var sDecimal = result.substr(index + 1);
        if (digitCount != -1) {
            while (sDecimal.length < digitCount) {
                sDecimal += "0";
            }
            sDecimal = sDecimal.substr(0, digitCount);
        }
        if (sDecimal != "") {
            return sign + integer + _radixPoint + sDecimal; //"." 
        }
        return sign + integer;
    }
	
	function downloadResource(){
		var fullPath = _serverPath + _resourceFileName + "?date=" + (+new Date()).toString();
		me.downloadFile(fullPath, function(success, xml){
			try {
				if (!success || !xml) {
					informCallback(false);
					ChartLogger.instance.write("[localization] failed to parse localization cfg file");
					return;
				}
				informCallback(initCfg($(xml)));
				ChartLogger.instance.write("[localization] success to parse localization cfg file");
			} 
			catch (ex) {
				informCallback(false);
				ChartLogger.instance.write("[localization] failed to parse localization cfg file");
			}
		});
		ChartLogger.instance.write("[download-resource] loading " + fullPath);
	}
	function downloadFileEx(fileUri, callback){
		$.ajax({
			type: "GET",
			url: fileUri,
			success: function(msg){
				callback(true, msg);
				ChartLogger.instance.write("[download-resource] success to download resource: " + fileUri);
			},
			error: function(msg){
				callback(false, null);
				ChartLogger.instance.write("[download-resource] failed to download resource: " + fileUri);
			}
		});
	}
	
	function initCfg(cfg){
		var node = null;
		node = cfg.find(ROOT_PATH+" cy");
		if (node && node.length > 0) {
			_currencySymbol = node.text();
		}
		
		node = cfg.find(ROOT_PATH+" dateformatdaily");
		if (node && node.length > 0) {
			_dateFormatDaily = node.text();
		}
		node = cfg.find(ROOT_PATH+" dateformatmonthly");
		if (node && node.length > 0) {
			_dateFormatMonthly = node.text();
		}
		node = cfg.find(ROOT_PATH+" dateformatannually");
		if (node && node.length > 0) {
			_dateFormatAnnaully = node.text();
		}
		
		node = cfg.find(ROOT_PATH+" sdateformatdaily");
		if (node && node.length > 0) {
			_shortDateFormatDaily = node.text();
		}
		node = cfg.find(ROOT_PATH+" sdateformatmonthly");
		if (node && node.length > 0) {
			_shortDateFormatMonthly = node.text();
		}
		node = cfg.find(ROOT_PATH+" sdateformatannually");
		if (node && node.length > 0) {
			_shortDateFormatAnnaully = node.text();
		}
		
		node = cfg.find(ROOT_PATH+" decimal");
		if (node && node.length > 0) {
			var temp = parseInt(node.attr("cluster"));
			if (temp != NaN && temp >= 0) {
				_clusterCount = temp;
			}
		}
		
		node = cfg.find(ROOT_PATH+" groupsep");
		if (node && node.length > 0) {
			_divider = node.text();
		}
		
		node = cfg.find(ROOT_PATH+" decsep");
		if (node && node.length > 0) {
			_radixPoint = node.text();
		}
		
		node = cfg.find(ROOT_PATH+" errmsg");
		if (!node || node.length <= 0) {
			return false;
		}
		_labelMap = new Dictionary();
		node.children().each(function(){
			_labelMap.add(this.nodeName.toLowerCase(), $(this).text());
		});
		
		return true;
	}
	function informCallback(success){
		$(_initCallbackList).each(function(){
			this(success);
		});
		_initCallbackList = [];
	}
};
LocalizationManager.instance = new LocalizationManager();

var StrFormatter = function(){
};
StrFormatter.formatDecimal = function(number, decimalCount){
    return LocalizationManager.instance.formatDecimal(number, decimalCount);
};
StrFormatter.formatNumber = function(number, decimalCount){
    var nType = Globalization.ShortFormatType.NONE;
    if (number > 999999999) {
        nType = ShortFormatType.SHORT_FORMAT_BIL;
    }
    else 
        if (number > 999999) {
            nType = ShortFormatType.SHORT_FORMAT_MEGA;
        }
        else 
            if (number > 999) {
                nType = ShortFormatType.SHORT_FORMAT_KILO;
            }
    
    return StrFormatter.shortenNumber(number, nType, decimalCount);
};
StrFormatter.shortenNumber = function(number, shortFormatType, decimalCount){
    var numberString = "";
    switch (shortFormatType) {
        case Globalization.ShortFormatType.SHORT_FORMAT_BIL:
            numberString = LocalizationManager.instance.removeTrailingZero(StrFormatter.formatDecimal(number / 1000000000, decimalCount)) +
            "B";
            break;
        case Globalization.ShortFormatType.SHORT_FORMAT_MEGA:
            numberString = LocalizationManager.instance.removeTrailingZero(StrFormatter.formatDecimal(number / 1000000, decimalCount)) +
            "M";
            break;
        case Globalization.ShortFormatType.SHORT_FORMAT_KILO:
            numberString = LocalizationManager.instance.removeTrailingZero(StrFormatter.formatDecimal(number / 1000, decimalCount)) +
            "K";
            break;
        default:
            numberString = LocalizationManager.instance.removeTrailingZero(StrFormatter.formatDecimal(number, decimalCount));
            break;
    }
    
    return numberString;
};
StrFormatter.getFormattedNumString = function(number, scaleRange, decimalCount, shorten){
    if (shorten) {
        if (number >= 0) {
            return StrFormatter.getFormattedNumStringImpl(number, scaleRange, decimalCount);
        }
        else {
            return "-" + StrFormatter.getFormattedNumStringImpl(Math.abs(number), scaleRange, decimalCount);
        }
    }
    else {
        return LocalizationManager.instance.formatDecimal(number, decimalCount);
    }
};
StrFormatter.getFormattedNumStringImpl = function(number, scaleRange, decimalCount){
    if (!decimalCount) 
        decimalCount = 2;
    if (number < 1000) {
        return StrFormatter.shortenNumber(number, Globalization.ShortFormatType.NONE, decimalCount);
    }
    else 
        if (number >= 1000 && number < 1000000) {
            return StrFormatter.shortenNumber(number, Globalization.ShortFormatType.SHORT_FORMAT_KILO, decimalCount);
        }
        else 
            if (number >= 1000000 && number < 1000000000) {
                return StrFormatter.shortenNumber(number, Globalization.ShortFormatType.SHORT_FORMAT_MEGA, decimalCount);
            }
            else {
                return StrFormatter.shortenNumber(number, Globalization.ShortFormatType.SHORT_FORMAT_BIL, decimalCount);
            }
};
StrFormatter.getFormattedLabel = function(labelName, defaultText){
	return LocalizationManager.instance.getLabel(labelName, defaultText);
};
//---------- Common Globalization Folder end ----------

//========== Common Log Folder start ==========

var ChartLogger = function(){
    var status = true;
    this.debugoutput = null;	//handle of detail output
    
    this.write = function(message){
		if (!status || !this.debugoutput) 
			return;
		
		var now = new Date();
		var dateArray = new Array();
		dateArray.push(now.getFullYear());
		dateArray.push(now.getMonth() + 1);
		dateArray.push(now.getDate());
		
		var timeArray = new Array();
		timeArray.push(now.getHours());
		timeArray.push(now.getMinutes());
		timeArray.push(now.getSeconds());
		timeArray.push(now.getMilliseconds());
		
		var messageArray = new Array();
		messageArray.push(dateArray.join("-") + " " + timeArray.join(":"));
		messageArray.push("HTML");
		messageArray.push(message);
		messageArray.push("\r\n");
		this.debugoutput(messageArray.join("|"));
	};
    
    this.isEnable = function(){
        return status;
    };
    this.enableLog = function(){
        status = true;
    };
    this.disableLog = function(){
        status = false;
    }
};
ChartLogger.instance = new ChartLogger();

//---------- Common Log Folder end ----------
