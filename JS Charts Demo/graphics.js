/*
 * var graphics = new $.Graphics(canvas.getContext("2d"));
 */

$.extend({
	Canvas: {
		create: function(target_, postion_, left_, top_, width_, height_, bgColor_){
			function makeCanvas(width, height){
				var c = document.createElement('canvas');
				c.width = width;
				c.height = height;
				if ($.browser.msie) { // excanvas hack
					c = window.G_vmlCanvasManager.initElement(c);
				}
				return c;
			}
			
			return $(makeCanvas(width_, height_)).css({
				position: postion_,
				left: left_,
				top: top_,
				width: width_,
				height: height_,
				"background-color": bgColor_ ? bgColor_ : "transparent"
			}).appendTo(target_).get(0);
		},
		createDiv: function(target_, postion_, left_, top_, width_, height_){
			function makeDiv(width, height){
				var c = document.createElement('DIV');
				c.width = width;
				c.height = height;
				return c;
			}
			return $(makeDiv(width_, height_)).css({
				position: postion_,
				left: left_,
				top: top_,
				width: width_,
				height: height_
			}).appendTo(target_).get(0);
		},
		resize: function(target_, width_, height_){
		    target_.css({
		        width:width_,
		        height:height_
		    });
		    target_.each(function(){
		        this.width = width_;
		        this.height = height_;
		    });
		}
	},
	
	TextStudio: {
		create: function(text, target_, postion_, left_, top_, width_, height_, class_){
			var str = '<div class="' + class_ + '">' + text + "</div>";
			
			var c = $(str).css({
				position: postion_,
				left: left_,
				top: top_
			}).appendTo(target_);
			if (width_) {
				c.css({
					width: width_
				});
			}
			if (height_) {
				c.css({
					height: height_
				});
			}
			return c.get(0);
		},

		createTextString: function(text, target_, postion_, left_, top_, width_, height_, class_){

			var str = '';
			str+= '<div style="position: ' + postion_ +
				  '; left: ' + left_ + 'px; top:  ' + top_ + 'px; ' ;
			if (width_){
				str += 'width: ' + width_ + 'px;' 
			}	  
			if (height_){
				str += 'height: ' + height_ + 'px;" ' 
			}	  
			str += ' class="' + class_ + '">' + text + '</div>';

			return str;
		},
		createVertical: function(text, target_, postion_, left_, top_, width_, height_, class_){
			var str = '<div class="' + class_ + '">' + text + "</div>";
			
			var c = $(str).css({
				position: postion_
			}).appendTo(target_);
			if (width_) {
				c.css({
					width: width_
				});
			}
			if (height_) {
				c.css({
					height: height_
				});
			}
			
			if (!$.browser.msie) {
				var offset = (c.width() - c.height()) / 2;
				left_ -= offset;
				top_ += offset;
			}
			c.css({
				left: left_,
				top: top_,
				//"filter": "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)",
				//"-ms-filter": "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)",
				"writing-mode": "tb-rl",
				//"filter": "flipv fliph",
				"-o-transform": "rotate(-90deg)",
				"-moz-transform": "rotate(-90deg)",
				"-webkit-transform": "rotate(-90deg)"
			});
			
			return c.get(0);
		},
		getTextMeasure: function(text, target_, class_){
			
			if (!target_){
				target_ = $(document.body)
			}
			var newClass = "" + class_ + " textnowrap";
			var textbox = $(target_).children("#tbGetWidth");
			if (!textbox || textbox.length < 1) {
				textbox = $($.TextStudio.create(text, target_, "absolute", 0, 0, null, null, newClass)).attr({
					id: "tbGetWidth"
				});
			}
			else {
				textbox.attr({
					"class": newClass
				});
				textbox.text(text);
			}
			textbox.get(0).style.display = "block";
			var ret = {
				width: textbox.width(),
				height: textbox.height()
			};
			textbox.get(0).style.display = "none";
			return ret;
		}
	},
	
	ShapeGallery: {
		begin: function(ctx){
			ctx.save();
			ctx.beginPath();
		},
		end: function(ctx){
			ctx.restore();
		},
		drawLine: function(ctx, ptStart, ptEnd, lineColor, lineWidth,autoAdjust){
			if(typeof(autoAdjust) == "undefined"){
				autoAdjust = true;
			}
			if (autoAdjust) {
				var adjust = lineWidth % 2 == 1 ? 0.5 : 0;
				ptStart.x = parseInt(ptStart.x) + adjust;
				ptStart.y = parseInt(ptStart.y) + adjust;
				ptEnd.x = parseInt(ptEnd.x) + adjust;
				ptEnd.y = parseInt(ptEnd.y) + adjust;
			}
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = lineColor;
			ctx.moveTo(ptStart.x, ptStart.y);
			ctx.lineTo(ptEnd.x, ptEnd.y);
			ctx.stroke();
		},
		drawLines: function(ctx, lines, lineColor, lineWidth, autoAdjust){
			if(typeof(autoAdjust) == "undefined"){
				autoAdjust = true;
			}
			var len = lines.length;
			if (len > 0) {
				if (autoAdjust) {
					var adjust = lineWidth % 2 == 1 ? 0.5 : 0;
					for (var i = 0; i < len; i++) {
						ctx.moveTo(parseInt(lines[i][0])+adjust, parseInt(lines[i][1])+adjust);
						ctx.lineTo(parseInt(lines[i][2])+adjust, parseInt(lines[i][3])+adjust);
					}
				}
				else {
					for (var i = 0; i < len; i++) {
						ctx.moveTo(lines[i][0], lines[i][1]);
						ctx.lineTo(lines[i][2], lines[i][3]);
					}
				}
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = lineColor;
				ctx.stroke();
			}
		},
		drawVDotLine: function(ctx, x, y1, y2, scale, space, lineColor, lineWidth){
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = lineColor;
			
			var temp1 = y2, temp2 = y2 - scale, unit = scale + space;
			while (temp1 > y1) {
				ctx.moveTo(x, temp2);
				ctx.lineTo(x, temp1);
				temp1 -= unit;
				temp2 -= unit;
				temp2 = temp2 < y1 ? y1 : temp2;
			}
			ctx.stroke();
		},
		drawCircle: function(ctx, ptCenter, radius, strokeColor, strokeWidth, fillColor){
			var counter = 0;
			if (fillColor) {
				ctx.arc(ptCenter.x, ptCenter.y, radius, 0, Math.PI * 2, false);
				ctx.fillStyle = fillColor;
				ctx.fill();
				counter++;
			}
			if (strokeWidth > 0) {
				if(counter>0){
					ctx.beginPath();
				}
				ctx.arc(ptCenter.x, ptCenter.y, radius, 0, Math.PI * 2, false);
				ctx.lineWidth = strokeWidth;
				ctx.strokeStyle = strokeColor;
				ctx.stroke();
			}
		},
		drawDotCircle: function(ctx, ptCenter, radius, scale, strokeColor, strokeWidth){
			var coordinate = [], length = Math.floor(Math.PI * 2 / (scale / radius));
			for (var i = 0; i <= length; i++) {
				coordinate[i] = [
					ptCenter.x + radius * Math.cos(i * scale / radius), 
					ptCenter.y + radius * Math.sin(i * scale / radius)];
			}
			
			ctx.lineWidth = strokeWidth;
			ctx.strokeStyle = strokeColor;
			for (i = 0; i < length; i++) {
				if (i % 2 == 0) {
					ctx.moveTo(coordinate[i][0], coordinate[i][1]);
					ctx.lineTo(coordinate[i + 1][0], coordinate[i + 1][1]);
				}
			}
			ctx.stroke();
		},
		drawArc:function(ctx, ptCenter, radius, beginArc, endArc, strokeColor, strokeWidth, fillColor){

			ctx.moveTo(ptCenter.x,ptCenter.y);
			if (endArc < beginArc){
				var tmp = beginArc;
				beginArc = endArc;
				endArc = tmp;
			}
			
			if (endArc - beginArc>= Math.PI * 2){
				ctx.arc(ptCenter.x, ptCenter.y, radius, beginArc, (beginArc + endArc)/2, false);
				ctx.arc(ptCenter.x, ptCenter.y, radius, (beginArc + endArc)/2 - 0.0001, endArc, false);
			}
			else{
				ctx.arc(ptCenter.x, ptCenter.y, radius, beginArc, endArc, false);
			}			
			if (fillColor) {
				ctx.fillStyle = fillColor;
				ctx.fill();
			}
			else {
				ctx.lineWidth = strokeWidth;
				ctx.strokeStyle = strokeColor;
				ctx.stroke();
		      }
		},
		drawEclipse: function(ctx, ptCenter, xRadius, yRadius, lineColor,
			lineWidth, fillColor){

			var a1=[];
			var a2=[];
			if (yRadius == 0){
				return;
			}

			for(var k = yRadius;k>=0;k -=0.5){
				a2.push(k);
				var tosq = xRadius*xRadius-xRadius*xRadius*k*k/(yRadius*yRadius);
				if(tosq<0){
					tosq = 0;
				}
				a1.push(Math.sqrt(tosq));
			}
			var or = [ptCenter.x, ptCenter.y];
			ctx.moveTo(or[0] + a1[0], or[1] - a2[0]);
			for(var k  =0;k<a1.length;k++){
				ctx.lineTo(or[0]+a1[k],or[1]-a2[k]);
			}
			for(var k  =a1.length-1;k>=0;k--){
				ctx.lineTo(or[0]+a1[k],or[1]+a2[k]);
			}
			for(var k  =0;k<a1.length;k++){
				ctx.lineTo(or[0]-a1[k],or[1]+a2[k]);
			}
			for(var k  =a1.length-1;k>=0;k--){
				ctx.lineTo(or[0]-a1[k],or[1]-a2[k]);
			}
			if (fillColor) {
				ctx.fillStyle = fillColor;
				ctx.fill();

			}
			else {
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = lineColor;
				ctx.stroke();
		    }
		},
		drawRectangle: function(ctx, ptLeftTop, width, height, strokeColor, strokeWidth, fillColor, autoAdjust){
			if(typeof(autoAdjust) == "undefined"){
				autoAdjust = true;
			}
			if (fillColor) {
				ctx.fillStyle = fillColor;
				if (autoAdjust) {
					ctx.fillRect(parseInt(ptLeftTop.x), parseInt(ptLeftTop.y), parseInt(width), parseInt(height));
				}
				else {
					ctx.fillRect(ptLeftTop.x, ptLeftTop.y, width, height);
				}
			}
			if (strokeWidth > 0) {
				ctx.lineWidth = strokeWidth;
				ctx.strokeStyle = strokeColor;
				if (autoAdjust) {
					var adjust = strokeWidth / 2;
					ctx.strokeRect(parseInt(ptLeftTop.x)+adjust, parseInt(ptLeftTop.y)+adjust, parseInt(width)-strokeWidth, parseInt(height)-strokeWidth);
				}
				else {
					ctx.strokeRect(ptLeftTop.x, ptLeftTop.y, width, height);
				}
			}
		},
		drawPolyline: function(ctx, ptCollection, strokeWidth, strokeColor){
			ctx.lineWidth = strokeWidth;
			ctx.lineJoin = "round";
			ctx.strokeStyle = strokeColor;
			this._drawPath(ctx,ptCollection,false);
			ctx.stroke();
		},
		drawPolygon: function(ctx, ptCollection, strokeWidth, strokeColor, fillColor){
			var counter = 0;
			if (fillColor) {
				this._drawPath(ctx,ptCollection,true);
				ctx.fillStyle = fillColor;
				ctx.fill();
				counter++;
			}
			if (strokeWidth > 0) {
				if(counter>0){
					ctx.beginPath();
				}
				this._drawPath(ctx,ptCollection,true);
				ctx.lineWidth = strokeWidth;
				ctx.lineJoin = "round";
				ctx.strokeStyle = strokeColor;
				ctx.stroke();
			}
		},
		_drawPath: function(ctx, ptCollection, closePath){
			var len = ptCollection.length;
			var checkPoints=function(index){
				var re=null;
				for (var i = index; i < len; i++) {
					if(typeof(ptCollection[i].y)=="number"){
						re=i;
						break;
					}
				}
				return re;
			}
			ctx.moveTo(ptCollection[0].x, ptCollection[0].y);
			for (var i = 1; i < len; i++) {
				if(typeof(ptCollection[i].y)=="number"){
					ctx.lineTo(ptCollection[i].x, ptCollection[i].y);	
				}
				else if(ptCollection[i].y==null){
					var index=checkPoints(i); 
					if(index!=null){
						ctx.moveTo(ptCollection[index].x, ptCollection[index].y);
					}
				}
							
			}
			if (closePath) {
				ctx.closePath();
			}
		}	
	},
	
	Graphics: function(ctx){
		this.GraphicFillType = {
			NONE_FILL: 0,
			NORMAL_FILL: 1,
			GRADIENT_FILL: 2
		};
		
		this._ctx = ctx;
		
		this._autoPos = true;
		this._lineWidth = 1;
		this._lineAlpha = 1; //from 0 to 1;
		this._lineColor = "rgba(0,0,0,1)";
		
		this._fillType = this.GraphicFillType.NORMAL_FILL;
		this._fillColor = "rgba(255,255,255,1)";
		this._fillAlpha = 1; //from 0 to 1;
		this._gradientFill = null;
				
		this.setContainer = function(ctx){
			this._ctx = ctx;
		};
		this.setLineStyle = function(lineWidth, lineColor, lineAlpha){
			if (!$.isNull(lineWidth)) {
				this._lineWidth = lineWidth;
			}
			if (!$.isNull(lineColor)) {
				this._lineColor = lineColor;
			}
			if (!$.isNull(lineAlpha)) {
				this._lineAlpha = lineAlpha;
			}
		};
		this.setNoneFill = function(){
			this._fillType = this.GraphicFillType.NONE_FILL;
		};
		this.setNormalFill = function(fillColor, fillAlpha){
			this._fillColor = fillColor;
			if (!$.isNull(fillAlpha)) {
				this._fillAlpha = fillAlpha;
			}
			this._fillType = this.GraphicFillType.NORMAL_FILL;
		};
		this.setGradientFill = function(gradient){
			this._gradientFill = gradient;
			this._fillType = this.GraphicFillType.GRADIENT_FILL;
		};
		this.getFillBrush = function(){
			switch (this._fillType) {
				case this.GraphicFillType.NONE_FILL:
					return null;
				case this.GraphicFillType.NORMAL_FILL:
					return this._fillColor;
				case this.GraphicFillType.GRADIENT_FILL:
					return this._gradientFill;
			}
			return null;
		};
		this.begin = function(){
			$.ShapeGallery.begin(this._ctx);
		};
		this.end = function(){
			$.ShapeGallery.end(this._ctx);
		};
		this.drawLine = function(x1, y1, x2, y2){
			$.ShapeGallery.drawLine(this._ctx, {
				x: x1,
				y: y1
			}, {
				x: x2,
				y: y2
			}, this._lineColor, this._lineWidth, this._autoPos);
		};
		this.drawLines = function(lines){
			$.ShapeGallery.drawLines(this._ctx, lines, this._lineColor, this._lineWidth, this._autoPos);
		};
		this.drawVDotLine = function(x, y1, y2, scale, space){
			$.ShapeGallery.drawVDotLine(this._ctx, x, y1, y2, scale, space, this._lineColor, this._lineWidth);
		};
		this.drawRectangle = function(x, y, width, height){
			
			//in opera, it doesn't work fine if the width or height is negative number.
			//so make a change
			if (height < 0){
				y = y + height;
				height = -height;
			}
			if (width < 0){
				x = x + width;
				width = -width;
			}
			$.ShapeGallery.drawRectangle(this._ctx, {
				x: x,
				y: y
			}, width, height, this._lineColor, this._lineWidth, this.getFillBrush());
		};
		this.drawPolyline = function(ptCollection){
			$.ShapeGallery.drawPolyline(this._ctx, ptCollection, this._lineWidth, this._lineColor);
		};
		this.drawPolygon = function(ptCollection){
			$.ShapeGallery.drawPolygon(this._ctx, ptCollection, this._lineWidth, this._lineColor, this.getFillBrush());
		};
		this.drawCircle = function(ptCenter, radius){
			$.ShapeGallery.drawCircle(this._ctx, ptCenter, radius, this._lineColor, this._lineWidth, this.getFillBrush());
		};
		this.drawDotCircle = function(ptCenter, radius, scale){
			$.ShapeGallery.drawDotCircle(this._ctx, ptCenter, radius, scale, this._lineColor, this._lineWidth);
		};
    	this.drawArc = function(ptCenter, radius,beginArc, endArc){

			if(beginArc.equalWith(endArc)){
				return;
			}
			$.ShapeGallery.drawArc(this._ctx, ptCenter, radius, beginArc, endArc, this._lineColor,
			this._lineWidth, this._fillColor);
  		};
    	this.drawEclipse = function(ptCenter, xRadius, yRadius){
			$.ShapeGallery.drawEclipse(this._ctx, ptCenter, xRadius, yRadius, this._lineColor,
			this._lineWidth, this.getFillBrush());

  		};


	}	
});
