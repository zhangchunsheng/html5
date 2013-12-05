/**
 * @author achen2
 */
//========== Date Extended Method start =========
Date.prototype.dateAdd = function(interval, number){
	var arg = [this.getFullYear(),this.getMonth(),this.getDate()];
    var d = new Date(arg[0], arg[1], arg[2]);
	/*
    var k = {
        'a': 'FullYear',
        'q': 'Month',
        'm': 'Month',
		's': 'Month',//Semiannually
        'w': 'Date',
        'd': 'Date'
        //'h': 'Hours',
        //'n': 'Minutes',
        //'ss': 'Seconds',
        //'ms': 'MilliSeconds'
    };
    var n = {
        'q': 3,
        'w': 7,
		's': 6
    };
    eval('d.set' + k[interval] + '(d.get' + k[interval] + '()+' + ((n[interval] || 1) * number) + ')');
    */
	switch (interval) {
		case "d":
			d.setDate(arg[2] + number);
			break;
		case "w":
			d.setDate(arg[2] + number * 7);
			break;
		case "m":
			d.setMonth(arg[1] + number);
			break;
		case "q":
			d.setMonth(arg[1] + number * 3);
			break;
		case "s":
			d.setMonth(arg[1] + number * 6);
			break;
		case "a":
			d.setFullYear(arg[0] + number);
			break;
	}
    return d;
};
Date.prototype.dateDiff = function(interval, objDate2){
	var d = this, t = d.getTime(), t2 = objDate2.getTime();
	
	/*
	 var i = {}
	 i['y'] = objDate2.getFullYear() - d.getFullYear();
	 i['q'] = i['y'] * 4 + Math.floor(objDate2.getMonth() / 4) - Math.floor(d.getMonth() / 4);
	 i['s'] = i['y'] * 2 + Math.floor(objDate2.getMonth() / 2) - Math.floor(d.getMonth() / 2);
	 i['m'] = i['y'] * 12 + objDate2.getMonth() - d.getMonth();
	 //i['ms'] = objDate2.getTime() - d.getTime();
	 i['w'] = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t + 345600000) / (604800000));
	 i['d'] = Math.floor(t2 / 86400000) - Math.floor(t / 86400000);
	 //i['h'] = Math.floor(t2 / 3600000) - Math.floor(t / 3600000);
	 //i['n'] = Math.floor(t2 / 60000) - Math.floor(t / 60000);
	 //i['ss'] = Math.floor(t2 / 1000) - Math.floor(t / 1000);
	 return i[interval];
	 */
	switch (interval) {
		case "d":
			return Math.floor(t2 / 86400000) - Math.floor(t / 86400000);
		case "w":
			return Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t + 345600000) / (604800000));
		case "m":
			return (objDate2.getFullYear() - d.getFullYear()) * 12 + objDate2.getMonth() - d.getMonth();
		case "q":
			return (objDate2.getFullYear() - d.getFullYear()) * 4 + Math.floor(objDate2.getMonth() / 4) - Math.floor(d.getMonth() / 4);
		case "s":
			return (objDate2.getFullYear() - d.getFullYear()) * 2 + Math.floor(objDate2.getMonth() / 2) - Math.floor(d.getMonth() / 2);
		case "a":
			return objDate2.getFullYear() - d.getFullYear();
	}
	return 0;
};
Date.prototype.clone = function(){
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};
//----------Date ExtendMethod end ----------

//========== String ExtendMethod start ==========
String.format = function(){
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    
    return s;
};
String.prototype.endWith = function(suffix){
    return (this.substr(this.length - suffix.length) === suffix);
};
String.prototype.startWith = function(prefix){
    return (this.substr(0, prefix.length) === prefix);
};
//---------- String ExtendMethod end ----------

//========== Number ExtendMethod start ==========
Number.prototype.floatToFixed = function(num){
	var strTmp = "" + this;
	if (-1 == strTmp.indexOf(".")){
		return this;
	}
	else {
		return this.toFixed(num);	
	}
};

Number.prototype.toHex = function(){
	
	var sHex = this.toString(16);
	if (sHex.length % 2 == 1){
		return "0" + this.toString(16);
	}
	else{
		return this.toString(16);	
	}
};
Number.prototype.equalWith = function(num){
	return Math.abs(this - num) < 0.00001;
};
Number.prototype.mul = function(arg){
	var m = 0,
		s1 = arg.toString(),
		s2 = this.toString();
	
	var arr1 = s1.split(".");
	var arr2 = s2.split(".");

	if (arr1.length > 1) {
		m += arr1[1].length;
	}
	if (arr2.length > 1) {
		m += arr2[1].length;
	}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
};
Number.prototype.div = function(arg){
	var t1 = 0, t2 = 0, r1, r2;
	
	var s1 = this.toString(), s2 = arg.toString();
	var arr1 = s1.split(".");
	var arr2 = s2.split(".");
	
	if (arr1.length > 1) {
		t1 = arr1[1].length;
	}
	if (arr2.length > 1) {
		t2 = arr2[1].length;
	}
	
	r1 = Number(s1.replace(".", ""));
	r2 = Number(s2.replace(".", ""));
	return (r1 / r2) * Math.pow(10, t2 - t1);
};
Number.prototype.add = function(arg){
	var r1 = 0, r2 = 0, m;
	var arr1 = arg.toString().split(".");
	var arr2 = this.toString().split(".");
	
	if (arr1.length > 1) {
		r1 = arr1[1].length;
	}
	if (arr2.length > 1) {
		r2 = arr2[1].length;
	}
	
	m = Math.pow(10, Math.max(r1, r2));
	return (arg * m + this * m) / m;
};
//---------- Number ExtendMethod end ----------

//========== Array ExtendMethod start ==========
if (!Array.prototype.indexOf) {
    [].indexOf ||
    (Array.prototype.indexOf = function(elt /*, from*/){
        var len = this.length;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) 
            from += len;
        
        for (; from < len; from++) {
            if (from in this && this[from] === elt) 
                return from;
        }
        return -1;
    });
}
//---------- Array ExtendMethod end ----------

//========== Math ExtendMethod start ==========
Math.log10 = function(x){
	return Math.log(x) / Math.log(10);
};
//---------- Math ExtendMethod end ----------

//========== MouseEvent ExtendMethod start ==========
jQuery.extend({
    getPosition: function(container, e){
        var offset = {
            left: 0,
            top: 0
        };
        try {
            if (container) {
                offset = $(container).offset();
            }
        } 
        catch (e) {
        }
        return {
            x: e.pageX - offset.left,
            y: e.pageY - offset.top
        };
    },
	getMargins : function(element, toInteger)
	{
		var el = $(element);
		var t = el.css('margin-top') || '';
		var r = el.css('margin-right') || '';
		var b = el.css('margin-bottom') || '';
		var l = el.css('margin-left') || '';
		if (toInteger)
			return {
				t: parseInt(t)||0,
				r: parseInt(r)||0,
				b: parseInt(b)||0,
				l: parseInt(l)
			};
		else
			return {t: t, r: r,	b: b, l: l};
	},
	getPadding : function(element, toInteger)
	{
		var el = $(element);
		var t = el.css('padding-top') || '';
		var r = el.css('padding-right') || '';
		var b = el.css('padding-bottom') || '';
		var l = el.css('padding-left') || '';
		if (toInteger)
			return {
				t: parseInt(t)||0,
				r: parseInt(r)||0,
				b: parseInt(b)||0,
				l: parseInt(l)
			};
		else
			return {t: t, r: r,	b: b, l: l};
	},
	getBorder : function(element, toInteger)
	{
		var el = $(element);
		var t = el.css('border-top-width') || '';
		var r = el.css('border-right-width') || '';
		var b = el.css('border-bottom-width') || '';
		var l = el.css('border-left-width') || '';
		if (toInteger)
			return {
				t: parseInt(t)||0,
				r: parseInt(r)||0,
				b: parseInt(b)||0,
				l: parseInt(l)||0
			};
		else
			return {t: t, r: r,	b: b, l: l};
	}
});

$.fn.extend({
	/*
    getWidth: function(){
        if ($.browser.msie) {
            return this.width() - (parseInt(this.css("border-left-width")) || 0) - (parseInt(this.css("border-right-width")) || 0);
        }
        else {
            return this.width();
        }
    },
    getHeight: function(){
        if ($.browser.msie) {
            return this.height() - (parseInt(this.css("border-top-width")) || 0) - (parseInt(this.css("border-bottom-width")) || 0);
        }
        else {
            return this.height();
        }
    },*/
	removeCSS: function(cssName) {
        return this.each(function() {
            var curDom = $(this);
            jQuery.grep(cssName.split(","),
                    function(cssToBeRemoved) {
                        curDom.css(cssToBeRemoved, '');
                    });
            return curDom;
        });
    }

});

//---------- MouseEvent ExtendMethod end ----------

jQuery.extend({
	BooleanTrueString : "true",
	parseToBool: function(inputStr){
		var outputBool = false;
		
		inputStr = inputStr.toLowerCase();
		if(inputStr == "1"){
			outputBool = true;
		}
		
		
		if($.BooleanTrueString.indexOf(inputStr) == 0){
			outputBool = true;
		}
		
		return outputBool;
	},
	isNull: function(obj){
		return obj == null || typeof(obj) == "undefined";
	}
});

/*
var a = null;
var b;
//var c;

var obj = {
	a : true
};

document.write(a);
document.write(typeof(a));
document.write(b);
document.write(typeof(b));
document.write(c);
document.write(typeof(c));
document.write(obj.a);
document.write(typeof(obj.a));
document.write(obj.c);
document.write(typeof(obj.c));
*/

/*
function foo(parent, opt){
	var container = parent || document, 
		name = opt.name || "no name",
		isLive = opt.isLive || true;
	
	var mar = mar + "str";
	
	if(ty){
		//do something
	}
}

foo(document, {name:""});
*/
