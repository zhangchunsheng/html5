/* Plugin for jQuery for working with colors.
* 
* Version 1.0.
* 
* Inspiration from jQuery color animation plugin by John Resig.
*
* Released under the MIT license by Ole Laursen, October 2009.
*
* Examples:
*
*   $.color.parse("#fff").scale('rgb', 0.25).add('a', -0.5).toString()
*   var c = $.color.extract($("#mydiv"), 'background-color');
*   console.log(c.r, c.g, c.b, c.a);
*   $.color.make(100, 50, 25, 0.4).toString() // returns "rgba(100,50,25,0.4)"
*
* Note that .scale() and .add() work in-place instead of returning
* new objects.
*/

(function() {
    jQuery.color = {};

    // construct color object with some convenient chainable helpers
    jQuery.color.make = function(r, g, b, a) {
        var o = {};
        o.r = r || 0;
        o.g = g || 0;
        o.b = b || 0;
        o.a = a != null ? a : 1;

        o.add = function(c, d) {
            for (var i = 0; i < c.length; ++i)
                o[c.charAt(i)] += d;
            return o.normalize();
        };

        o.scale = function(c, f) {
            for (var i = 0; i < c.length; ++i)
                o[c.charAt(i)] *= f;
            return o.normalize();
        };

        o.toString = function() {
            if (o.a >= 1.0) {
                return "rgb(" + [o.r, o.g, o.b].join(",") + ")";
            } else {
                return "rgba(" + [o.r, o.g, o.b, o.a].join(",") + ")";
            }
        };

        o.normalize = function() {
            function clamp(min, value, max) {
                return value < min ? min : (value > max ? max : value);
            }

            o.r = clamp(0, parseInt(o.r), 255);
            o.g = clamp(0, parseInt(o.g), 255);
            o.b = clamp(0, parseInt(o.b), 255);
            o.a = clamp(0, o.a, 1);
            return o;
        };

        o.clone = function() {
            return jQuery.color.make(o.r, o.b, o.g, o.a);
        };

        return o.normalize();
    };

	jQuery.color.getLinearColor = function(iValue, iStartValue, iEndValue,
				stratrColor, endColor){

		var getLinearColor = function(iValue, iStartValue, iEndValue,
				iStartColor, iEndColor){
			
			var iNumber = parseInt(iStartColor + (iValue - iStartValue) / 
				(iEndValue - iStartValue) * (iEndColor - iStartColor));
			
			if(iNumber > 255){
				iNumber = 255;
			}
			else if (iNumber < 0){
				iNumber = 0;
			}

			return iNumber;
		}

		var oStartColor = null;
		var oEndColor = null;
		if (typeof stratrColor == "string"){
			oStartColor = jQuery.color.parse(stratrColor);
		}
		else{
			oStartColor = stratrColor;
		}
		if (typeof endColor == "string"){
			oEndColor = jQuery.color.parse(endColor);
		}
		else{
			oEndColor = endColor;
		}
		
		var red = getLinearColor(iValue, iStartValue, iEndValue, oStartColor.r, oEndColor.r);
		var green = getLinearColor(iValue, iStartValue, iEndValue, oStartColor.g, oEndColor.g);
		var blue = getLinearColor(iValue, iStartValue, iEndValue, oStartColor.b, oEndColor.b);
		
		return jQuery.color.make(red, green, blue);
	};

	jQuery.color.getMidColor = function(stratrColor, endColor){
		
		return jQuery.color.getLinearColor(128,0, 256, stratrColor, endColor);
	}

    // extract CSS color property from element, going up in the DOM
    // if it's "transparent"
    jQuery.color.extract = function(elem, css) {
        var c;
        do {
            c = elem.css(css).toLowerCase();
            // keep going until we find an element that has color, or
            // we hit the body
            if (c != '' && c != 'transparent')
                break;
            elem = elem.parent();
        } while (!jQuery.nodeName(elem.get(0), "body"));

        // catch Safari's way of signalling transparent
        if (c == "rgba(0, 0, 0, 0)")
            c = "transparent";

        return jQuery.color.parse(c);
    };

    // parse CSS color string (like "rgb(10, 32, 43)" or "#fff"),
    // returns color object
    jQuery.color.parse = function(str) {
        var res, m = jQuery.color.make;

        // Look for rgb(num,num,num)
        if (res = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(str))
            return m(parseInt(res[1], 10), parseInt(res[2], 10), parseInt(res[3], 10));

        // Look for rgba(num,num,num,num)
        if (res = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))
            return m(parseInt(res[1], 10), parseInt(res[2], 10), parseInt(res[3], 10), parseFloat(res[4]));

        // Look for rgb(num%,num%,num%)
        if (res = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(str))
            return m(parseFloat(res[1]) * 2.55, parseFloat(res[2]) * 2.55, parseFloat(res[3]) * 2.55);

        // Look for rgba(num%,num%,num%,num)
        if (res = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))
            return m(parseFloat(res[1]) * 2.55, parseFloat(res[2]) * 2.55, parseFloat(res[3]) * 2.55, parseFloat(res[4]));

        // Look for #FFa0b1c2
        if (res = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(str))
            return m(parseInt(res[2], 16), parseInt(res[3], 16), parseInt(res[4], 16), parseInt(res[1], 16) / 255);

        // Look for #a0b1c2
        if (res = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(str))
            return m(parseInt(res[1], 16), parseInt(res[2], 16), parseInt(res[3], 16));

        // Look for #fff
        if (res = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(str))
            return m(parseInt(res[1] + res[1], 16), parseInt(res[2] + res[2], 16), parseInt(res[3] + res[3], 16));

		var name = jQuery.trim(str).toLowerCase();
		if(name == "" || name == null || name == "undefined"){return null;}
        if (name == "transparent"){
            return m(255, 255, 255, 0);
		}
		
		if(parseInt(name)){
			var name = parseInt(name);
			var index = name > 20 ? (name%20) : name;
			if(index == 0) {index = 20;};
			str = lookupColors[index];
			if(res = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(str)){
				return m(parseInt(res[1], 16), parseInt(res[2], 16), parseInt(res[3], 16));
			}
		}else{
			res = lookupColors2[name];
			return m(res[0], res[1], res[2]);
		}
};
    var lookupColors = {
    		1 : "#0A1E60",
    		2 : "#A6BC09", 
    		3 : "#FEA620",
    		4 : "#FF1300", 
    		5 : "#738FB6",
            6 : "#006065",
            7 : "#47A888",
            8 : "#FFD100",
            9 : "#D13973",
            10 : "#73A87F",
            11 : "#4A4A7B",
            12 : "#3E841C",
            13 : "#F0F065",
            14 : "#770000",
            15 : "#81ABBA",
            16 : "#949FB7",
            17 : "#CFD47F",
            18 : "#F4B287",
            19 : "#CD7F99", 
            20 : "#7FAFB2"
    };
    var lookupColors2 = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0]
    };
})();
