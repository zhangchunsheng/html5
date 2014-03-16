var Icon = function() { };

Icon.IconType = {
    Rect: 0,
    Area: 1,
    Square: 2,
    Circle: 3,
    Triangle: 4,
    TriangleUp:4,
    Cross: 5,
    LineSmall: 6,
    LineMedium: 7,
    LineThick: 8,
    CharDividend: 9,
    CharCapitalGain: 10,
    CharSplits: 11,
    TipBox: 12,
    LoadingIcon: 13,
    Ellipse: 14,
    DotSmall: 15,
    DotMedium: 16,
    DotLarge: 17,
    Menu: 18,
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
    RectFrame: 32,
	Centroid: 33,
	Shield: 34,
	RoundRect: 35,
    Warning: 97,
    Error: 98,
    None: 99
};

Icon.TriangleDirection = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};

Icon.HorizontalAlign = {
    Left: 0,
    Center: 1,
    Right: 2,
    Stretch: 3
};

Icon.VerticalAlign = {
    Top: 0,
    Center: 1,
    Bottom: 2,
    Stretch: 3
};

Icon.Setting = function() {
    this.iconType = Icon.IconType.None;
    this.position = { x: 0, y: 0 };
    this.region = { width: 0, height: 0 };
    this.size = { width: 0, height: 0 };
    this.align = Icon.HorizontalAlign.Left;
    this.valign = Icon.VerticalAlign.Center;
    this.color = "#808080";
    this.cross = false;
	this.zoomx = 1;
	this.zoomy = 1;
	this.fontStyle={
		font_content:"S",
		font_style:"normal",
		font_weight:900,
		font_size:9,
		font_family:"Times New Roman",
		color:"#cccccc"
	}
};

Icon.Drawer = function(container){
	//RECT
	var RECT_WIDTH = 9;
	var RECT_HEIGHT = 6;
	var RECT_BORDER = 6;

	//ROUNDRECT
	var ROUNDRECT_WIDTH = 15;
	var ROUNDRECT_HEIGHT = 6;
	
	//SQUARE
	var SQUARE_SIDE_LEN = 8;
	var SQUARE_BORDER = 1;

	//DIAMOND
	var DIAMOND_SIDE_LEN = 8;
	var DIAMOND_BORDER = 1;

	//SHIELD
	var SHIELD_TOTAL_WIDTH = 11;
	var SHIELD_HEIGHT_BODY = 9;
	var SHIELD_HEIGHT_ANGLE = 4;
	var SHIELD_HEIGHT_TAIL = 3;
	var SHIELD_TAIL_WIDTH = 1;
	var SHIELD_TOTAL_HEIGHT = SHIELD_HEIGHT_BODY + SHIELD_HEIGHT_ANGLE + 
				SHIELD_HEIGHT_TAIL + SHIELD_HEIGHT_TAIL;  // = 17

	//CIRCLE
	var CIRCLE_RADIUS = 4.5;
	var CIRCLE_BORDER = 1;

	var CENTROID_RADIUS = 4.5
	var CENTROID_BORDER = 1;
	var CENTROID_INNER_RADIUS = 1;

	//TRIANGLE
	var TRIANGLE_HEIGHT = 8;
	//CROSS

	//LINE:SMALL_LINE, MEDIUM_LINE, THICK_lINE
	var LINE_LEN = 10;
	var SMALL_LINE_WIDTH = 1;
	var MEDIUM_LINE_WIDTH = 2;
	var THICK_LINE_WIDTH = 3;

	var SMALL_DOT_RADIUS = 3;
	var MEDIUM_DOT_RADIUS = 4;
	var LARGE_DOT_RADIUS = 6;

	//LoadingIcon
	var LOADING_WIDTH = 12;
	var LOADING_HEIGHT = 12;

	//Cross
	var CROSS_WIDTH = 10;
	var CROSS_HEIGHT = 10;
	var CROSS_LINE_WIDTH = 2;
	
	var LEFT_MARGIN = 3;
	var RIGHT_MARGIN = 3;
	
	var FRAME_WIDTH = 1.5;
	
	var _container = null;
	var _isCanvas = false;
	var _iconSetting = null;
	var _graphics = null;
	
	
	this.setContainer = function(container){
		_container = container;
		_isCanvas = isCanvas(container);
		if (_isCanvas) {
			_graphics = new $.Graphics(_container.getContext("2d"));
		}
		else {
			_graphics = null;
		}
	};
	
	this.draw = function(iconSetting){
		if (!iconSetting) {
			return;
		}
		
		_iconSetting = iconSetting;
		
		var canvas = null;
		if (!_isCanvas) {
			//the container is a div or the other container,
			//we will create a new canvas for this icon.
			canvas = $.Canvas.create($(_container), "absolute", 
						iconSetting.position.x, iconSetting.position.y, 
						iconSetting.region.width, iconSetting.region.height);
			$(_container).css({
				"width": iconSetting.region.width,
				"height": iconSetting.region.height
			});
			_graphics = new $.Graphics(canvas.getContext("2d"));
		}
		else {
			canvas = _container;
		}
		
		switch (iconSetting.iconType) {
			case Icon.IconType.Rect:
			case Icon.IconType.Area:
                drawRect(false);
				break;
			case Icon.IconType.RectFrame:
                drawRect(true);
				break;
			case Icon.IconType.Square:
                drawSquare(true);
				break;
			case Icon.IconType.SquareFrame:
                drawSquare(false);
				break;
			case Icon.IconType.Circle:
				  drawCircle(true);
				break;
			case Icon.IconType.CircleFrame:
				  drawCircle(false);
				break;
			case Icon.IconType.Triangle:
			case Icon.IconType.TriangleUp:
                drawTriangle(Icon.TriangleDirection.UP, true);
				break;
			case Icon.IconType.Cross:
				break;
			case Icon.IconType.LineSmall:
				drawLine(SMALL_LINE_WIDTH);
				break;
			case Icon.IconType.LineMedium:
				drawLine(MEDIUM_LINE_WIDTH);
				break;
			case Icon.IconType.LineThick:
				drawLine(THICK_LINE_WIDTH);
				break;
			case Icon.IconType.DotSmall:
				break;
			case Icon.IconType.DotMedium:
				break;
			case Icon.IconType.DotLarge:
				break;
			case Icon.IconType.Menu:
				break;
			case Icon.IconType.Diamond:
                drawDiamond(true);
				break;
			case Icon.IconType.DiamondFrame:
                drawDiamond(false);
				break;
			case Icon.IconType.Pentagon:
				break;
			case Icon.IconType.PentagonFrame:
				break;
			case Icon.IconType.TriangleFrame:
                drawTriangle(Icon.TriangleDirection.UP, false);
				break;
			case Icon.IconType.TriangleDown:
				drawTriangle(Icon.TriangleDirection.DOWN, true);
				break;
			case Icon.IconType.TriangleDownFrame:
                drawTriangle(Icon.TriangleDirection.DOWN, false);
				break;
			case Icon.IconType.TriangleLeft:
				drawTriangle(Icon.TriangleDirection.LEFT, true);
				break;
			case Icon.IconType.TriangleLeftFrame:
                drawTriangle(Icon.TriangleDirection.LEFT, false);
				break;
			case Icon.IconType.TriangleRight:
				drawTriangle(Icon.TriangleDirection.RIGHT, true);
				break;
			case Icon.IconType.TriangleRightFrame:
                drawTriangle(Icon.TriangleDirection.RIGHT, false);
				break;           
			case Icon.IconType.Centroid:
				drawCentroid();
				break;
			case Icon.IconType.Shield:
				drawShield();
				break;
			case Icon.IconType.RoundRect:
                drawRoundRect(true);
				break;
			case Icon.IconType.Error:
				drawErrorCross();
				break;
		}

		if (!_isCanvas) {
			_graphics = null;
		};
		return canvas;
	};



	var drawShield = function(cArticle){

		var width = _iconSetting.size.width * _iconSetting.zoomx;
		var height = _iconSetting.size.height * _iconSetting.zoomy;
		var iCommomScale = Math.min(_iconSetting.zoomx, _iconSetting.zoomy);
		if (width == 0 && height == 0) {
			width = SHIELD_TOTAL_WIDTH * iCommomScale;
			height = SHIELD_TOTAL_HEIGHT * iCommomScale;
		}
		_iconSetting.size.adjustedWidth = width;
		_iconSetting.size.adjustedHeight = height;
		
		var ptArray = constructShield(width, height);

		_graphics.begin();
		_graphics.setLineStyle(0, _iconSetting.color);
		_graphics.setNormalFill(_iconSetting.color);
		_graphics.drawPolygon(ptArray);

		_graphics.setLineStyle(SHIELD_TAIL_WIDTH, _iconSetting.color);
		_graphics.drawLine(ptArray[3].x,ptArray[3].y,
							ptArray[4].x,ptArray[4].y);
		_graphics.end();
		
		var oContainerDiv = null;
		if (_isCanvas){
			
			oContainerDiv = $('<div></div>').appendTo(
								$(_container).parent().get(0))
		}
		else{
			oContainerDiv = $('<div></div>').appendTo($(_container));
		}

		oContainerDiv.css({
			"font-style":_iconSetting.fontStyle.font_style,
			"font-weight":_iconSetting.fontStyle.font_weight,
			"font-size":_iconSetting.fontStyle.font_size * iCommomScale,
			"font-family":_iconSetting.fontStyle.font_family,
			"color":_iconSetting.fontStyle.color,
			"text-align":"center",
			"vertical-align":"middle"});
		$.TextStudio.create(_iconSetting.fontStyle.font_content, oContainerDiv, "absolute", 
							ptArray[0].x, 
							ptArray[0].y, 
							width, 
							height * SHIELD_HEIGHT_BODY / SHIELD_TOTAL_HEIGHT);
	}

	var constructShield = function(width, height){

		var x1 = 0;
		var x2 = 0;
		var x3 = 0;
		var x4 = 0;
		var x5 = 0;
		var x6 = 0;
		var x7 = 0;
		var y1 = 0;
		var y2 = 0;
		var y3 = 0;
		var y4 = 0;
		var y5 = 0;
		var y6 = 0;
		var y7 = 0;
		var pointArray = [];
		switch (_iconSetting.align) {
			case Icon.HorizontalAlign.Left:
				x1 = 0;
				x2 = width;
				x3 = width;
				x4 = width/2;
				x5 = width/2;
				x6 = width/2;
				x7 = 0;
				break;
			case Icon.HorizontalAlign.Right:
				x1 = -width;
				x2 = 0;
				x3 = 0;
				x4 = -width/2;
				x5 = -width/2;
				x6 = -width/2;
				x7 = -width;
				break;
			case Icon.HorizontalAlign.Center:
			default:
				x1 = -width / 2;
				x2 = width / 2;
				x3 = width / 2;
				x4 = 0;
				x5 = 0;
				x6 = 0;
				x7 = -width / 2;
				break;
		};

		switch (_iconSetting.valign) {
			case Icon.VerticalAlign.Top:
				y1 = 0;
				y2 = 0;
				y3 = height * SHIELD_HEIGHT_BODY / SHIELD_TOTAL_HEIGHT;
				y4 = height * (SHIELD_HEIGHT_BODY + SHIELD_HEIGHT_ANGLE) / 
						SHIELD_TOTAL_HEIGHT;
				y5 = height;
				y6 = y4;
				y7 = y3;
				break;
			case Icon.VerticalAlign.Bottom:
				y1 = -height;
				y2 = -height;
				y3 = height * SHIELD_HEIGHT_BODY / SHIELD_TOTAL_HEIGHT - height;
				y4 = height * (SHIELD_HEIGHT_BODY + SHIELD_HEIGHT_ANGLE) / 
						SHIELD_TOTAL_HEIGHT - height;
				y5 = 0;
				y6 = y4;
				y7 = y3;
				break;
			case Icon.VerticalAlign.Center:
			default:
				y1 = -height/2;
				y2 = -height/2;
				y3 = height * SHIELD_HEIGHT_BODY / SHIELD_TOTAL_HEIGHT - height/2;
				y4 = height * (SHIELD_HEIGHT_BODY + SHIELD_HEIGHT_ANGLE) / 
						SHIELD_TOTAL_HEIGHT - height/2;
				y5 = height / 2;
				y6 = y4;
				y7 = y3;
				break;
		}

		pointArray.push(adjustPointWithAlignment({
			x: x1,
			y: y1
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x2,
			y: y2
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x3,
			y: y3
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x4,
			y: y4
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x5,
			y: y5
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x6,
			y: y6
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x7,
			y: y7
		}));

		return pointArray;
	};

	var drawLine = function(lineWidth){

		var width = _iconSetting.size.width * _iconSetting.zoomx;
		var height = _iconSetting.size.height * _iconSetting.zoomy;

		var iCommomScale = Math.min(_iconSetting.zoomx, _iconSetting.zoomy);
		if (width == 0 && height == 0) {
			width = LINE_LEN * iCommomScale;
			height = width;
		}

		_iconSetting.size.adjustedWidth = width;
		_iconSetting.size.adjustedHeight = height;
		
		var pt = constructLine(width, height);
		pt = adjustPointWithAlignment(pt);

		_graphics.begin();
		_graphics.setLineStyle(lineWidth, _iconSetting.color);
		_graphics.setNormalFill(_iconSetting.color);
		_graphics.drawLine(pt.x, pt.y, pt.x + width, pt.y);
		_graphics.end();
	}

	var constructLine = function(width, height){

		var pt = {x : 0, y : 0};
		switch (_iconSetting.align) {
			case Icon.HorizontalAlign.Left:
				pt.x = 0;
				break;
			case Icon.HorizontalAlign.Right:
				pt.x = -width;
				break;
			case Icon.HorizontalAlign.Center:
			default:
				pt.x = -width / 2;
				break;
		}
		return pt;
	};



	var drawRect = function(fill){

		var width = _iconSetting.size.width * _iconSetting.zoomx;
		var height = _iconSetting.size.height * _iconSetting.zoomy;

		var iCommomScale = Math.min(_iconSetting.zoomx, _iconSetting.zoomy);
		if (width == 0 && height == 0) {
			width = RECT_WIDTH * iCommomScale;
			height = RECT_HEIGHT * iCommomScale;
		}

		_iconSetting.size.adjustedWidth = width;
		_iconSetting.size.adjustedHeight = height;
		
		var pt = constructRectangle(width, height);
		pt = adjustPointWithAlignment(pt);

		_graphics.begin();
		if (fill) {
			_graphics.setLineStyle(0, _iconSetting.color);
			_graphics.setNormalFill(_iconSetting.color);
		}
		else {
			_graphics.setLineStyle(DIAMOND_BORDER, _iconSetting.color);
			_graphics.setNoneFill();
		}
		_graphics.drawRectangle(pt.x, pt.y, width, height);
		_graphics.end();
	}

	var drawDiamond = function(fill){

		var width = _iconSetting.size.width * _iconSetting.zoomx;
		var height = _iconSetting.size.height * _iconSetting.zoomy;
		if (width == 0 && height == 0) {
			width = DIAMOND_SIDE_LEN * Math.min(_iconSetting.zoomx, _iconSetting.zoomy);
			height = width;
		}

		_iconSetting.size.adjustedWidth = width;
		_iconSetting.size.adjustedHeight = height;
		
		var arrPts = constructDiamond(width, height);
		_graphics.begin();
		if (fill) {
			_graphics.setLineStyle(0, _iconSetting.color);
			_graphics.setNormalFill(_iconSetting.color);
		}
		else {
			_graphics.setLineStyle(DIAMOND_BORDER, _iconSetting.color);
			_graphics.setNoneFill();
		}
		_graphics.drawPolygon(arrPts);
		_graphics.end();
	}

	var constructDiamond = function(width, height){

		var arrPts = [];
		var x1 = 0;
		var x2 = 0;
		var x3 = 0;
		var x4 = 0;
		var y1 = 0;
		var y2 = 0;
		var y3 = 0;
		var y4 = 0;

		var iMinWidthHeight = Math.min(width, height);
		switch (_iconSetting.align) {
			case Icon.HorizontalAlign.Left:
				x1 = iMinWidthHeight / 2;
				x2 = iMinWidthHeight;
				x3 = iMinWidthHeight / 2;
				x4 = 0;
				break;

			case Icon.HorizontalAlign.Right:
				x1 = -iMinWidthHeight / 2;
				x2 = 0;
				x3 = -iMinWidthHeight / 2;
				x4 = -iMinWidthHeight;
				break;
			case Icon.HorizontalAlign.Center:
			default:
				x1 = 0;
				x2 = iMinWidthHeight/2;
				x3 = 0;
				x4 = -iMinWidthHeight/2;
				break;
		}

		switch (_iconSetting.valign) {
			case Icon.VerticalAlign.Top:
				y1 = 0;
				y2 = iMinWidthHeight/2;
				y3 = iMinWidthHeight;
				y4 = iMinWidthHeight/2;
				break;
			case Icon.VerticalAlign.Bottom:
				y1 = -iMinWidthHeight;
				y2 = -iMinWidthHeight/2;
				y3 = 0;
				y4 = -iMinWidthHeight/2;
				break;
			case Icon.VerticalAlign.Center:
			default:
				y1 = -iMinWidthHeight/2;
				y2 = 0;
				y3 = iMinWidthHeight/2;;
				y4 = 0;
				break;
		}
		
		arrPts.push(adjustPointWithAlignment({
			x: x1,
			y: y1
		}));
		arrPts.push(adjustPointWithAlignment({
			x: x2,
			y: y2
		}));
		arrPts.push(adjustPointWithAlignment({
			x: x3,
			y: y3
		}));
		arrPts.push(adjustPointWithAlignment({
			x: x4,
			y: y4
		}));

		return arrPts;
	};

	var drawSquare = function(fill){
		
		var width = _iconSetting.size.width * _iconSetting.zoomx;
		var height = _iconSetting.size.height * _iconSetting.zoomy;
		if (width == 0 && height == 0) {
			width = SQUARE_SIDE_LEN * Math.min(_iconSetting.zoomx, _iconSetting.zoomy);
			height = width;
		}

		_iconSetting.size.adjustedWidth = width;
		_iconSetting.size.adjustedHeight = height;
		
		
		var pt = constructRectangle(width, height);
		pt = adjustPointWithAlignment(pt);
		var iSquareLen = Math.min(width, height)

		_graphics.begin();
		if (fill) {
			_graphics.setLineStyle(0, _iconSetting.color);
			_graphics.setNormalFill(_iconSetting.color);
		}
		else {
			_graphics.setLineStyle(SQUARE_BORDER, _iconSetting.color);
			_graphics.setNoneFill();
		}
		_graphics.drawRectangle(pt.x, pt.y, iSquareLen, iSquareLen);
		_graphics.end();
	};

	var constructRectangle = function(width, height){

		var pt = {x : 0, y : 0};
		switch (_iconSetting.align) {
			case Icon.HorizontalAlign.Left:
				pt.x = 0;
				break;
			case Icon.HorizontalAlign.Right:
				pt.x = -width;
				break;
			case Icon.HorizontalAlign.Center:
			default:
				pt.x = -width / 2;
				break;
		}
		switch (_iconSetting.valign) {
			case Icon.VerticalAlign.Top:
				pt.y = 0;
				break;
			case Icon.VerticalAlign.Bottom:
				pt.y = -height;
				break;
			case Icon.VerticalAlign.Center:
			default:
				pt.y = -height * 0.5;
				break;
		}
		return pt;
	};

	var drawRoundRect = function(fill){

		var width = _iconSetting.size.width * _iconSetting.zoomx;
		var height = _iconSetting.size.height * _iconSetting.zoomy;

		var iCommomScale = Math.min(_iconSetting.zoomx, _iconSetting.zoomy);
		if (width == 0 && height == 0) {
			width = ROUNDRECT_WIDTH * iCommomScale;
			height = ROUNDRECT_HEIGHT * iCommomScale;
		}

		_iconSetting.size.adjustedWidth = width;
		_iconSetting.size.adjustedHeight = height;
		
		var pt = constructRectangle(width, height);
		pt = adjustPointWithAlignment(pt);

		_graphics.begin();
		if (fill) {
			_graphics.setLineStyle(0, _iconSetting.color);
			_graphics.setNormalFill(_iconSetting.color);
		}
		else {
			_graphics.setLineStyle(DIAMOND_BORDER, _iconSetting.color);
			_graphics.setNoneFill();
		}



		_graphics.drawArc({ x:pt.x + height * 0.5 + 1, y:pt.y + height * 0.5 },
				height * 0.5, Math.PI * 0.5, Math.PI * 1.5);
		_graphics.drawRectangle(pt.x + height * 0.5
				, pt.y , width - height, height);
		_graphics.drawArc({x:pt.x + width - height * 0.5 - 1, y:pt.y + height * 0.5 }, 
				height * 0.5, Math.PI * 1.5, Math.PI * 2.5);

		_graphics.end();
	}
	
	var drawCircle = function(fill){

		var width = _iconSetting.size.width * _iconSetting.zoomx;
		var height = _iconSetting.size.height * _iconSetting.zoomy;
		if (width == 0 && height == 0) {
			width = 2 * CIRCLE_RADIUS * Math.min(_iconSetting.zoomx, _iconSetting.zoomy);
			height = width;
		}

		_iconSetting.size.adjustedWidth = width;
		_iconSetting.size.adjustedHeight = height;
		
		var iRadius = Math.min(width, height) / 2;
		var oPtCenter = constructCircle(width, height);
		oPtCenter = adjustPointWithAlignment(oPtCenter);
		
		_graphics.begin();
		if (fill) {
			_graphics.setLineStyle(0, _iconSetting.color);
			_graphics.setNormalFill(_iconSetting.color);
		}
		else {
			_graphics.setLineStyle(CIRCLE_BORDER, _iconSetting.color);
			_graphics.setNoneFill();
		}
						
		_graphics.drawCircle(oPtCenter, iRadius);
		_graphics.end();
	};
	
	var drawCentroid = function(){

		var width = _iconSetting.size.width * _iconSetting.zoomx;
		var height = _iconSetting.size.height * _iconSetting.zoomy;
		if (width == 0 && height == 0) {
			width = 2 * CENTROID_RADIUS * Math.min(_iconSetting.zoomx, _iconSetting.zoomy);
			height = width;
		}
		
		_iconSetting.size.adjustedWidth = width;
		_iconSetting.size.adjustedHeight = height;
		
		var iRadius1 = Math.min(width, height) / 2;
		var iRadius2 = CENTROID_INNER_RADIUS;
		var oPtCenter = constructCircle(width, height);
		oPtCenter = adjustPointWithAlignment(oPtCenter);

		_graphics.begin();
		_graphics.setLineStyle(0, _iconSetting.color);
		_graphics.setNormalFill(_iconSetting.color);
		_graphics.drawCircle(oPtCenter, iRadius2);
		_graphics.end();

		_graphics.begin();
		_graphics.setLineStyle(CIRCLE_BORDER, _iconSetting.color);
		_graphics.setNoneFill();
		_graphics.drawCircle(oPtCenter, iRadius1);
		_graphics.end();
	};
	var constructCircle = function(width, height){

		var pt = {x:0, y:0};
		switch (_iconSetting.align) {
			case Icon.HorizontalAlign.Left:
				pt.x = width * 0.5;
				break;
			case Icon.HorizontalAlign.Right:
				pt.x = -width * 0.5;
				break;
			case Icon.HorizontalAlign.Center:
			default:
				pt.x = 0;
				break;
		}
		switch (_iconSetting.valign) {
			case Icon.VerticalAlign.Top:
				pt.y = height * 0.5;
				break;
			case Icon.VerticalAlign.Bottom:
				pt.y = -height * 0.5;
				break;
			case Icon.VerticalAlign.Center:
			default:
				pt.y = 0;
				break;
		}		
		return pt;		
	}

	var drawTriangle = function(direction, fill, cross){
		var width = _iconSetting.size.width * _iconSetting.zoomx;
		var height = _iconSetting.size.height * _iconSetting.zoomy;
		if (width == 0 && height == 0) {
			width = TRIANGLE_HEIGHT * Math.min(_iconSetting.zoomx, _iconSetting.zoomy);
			height = TRIANGLE_HEIGHT * Math.min(_iconSetting.zoomx, _iconSetting.zoomy);
		}
		_iconSetting.size.adjustedWidth = width;
		_iconSetting.size.adjustedHeight = height;
		
		var pointArray = null;
		switch (direction) {
			case Icon.TriangleDirection.UP:
				pointArray = constructTrangleUp(width, height);
				break;
			case Icon.TriangleDirection.DOWN:
				pointArray = constructTrangleDown(width, height);
				break;
			case Icon.TriangleDirection.LEFT:
				pointArray = constructTrangleLeft(width, height);
				break;
			case Icon.TriangleDirection.RIGHT:
				pointArray = constructTrangleRight(width, height);
				break;
		}
		_graphics.begin();
		if (fill) {
			_graphics.setLineStyle(0, _iconSetting.color);
			_graphics.setNormalFill(_iconSetting.color);
		}
		else {
			_graphics.setLineStyle(FRAME_WIDTH, _iconSetting.color);
			_graphics.setNoneFill();
		}
		_graphics.drawPolygon(pointArray);
		_graphics.end();
	};
	var constructTrangleUp = function(width, height){
		var pointArray = [];
		var x1, y1, x2, y2, x3, y3; // in order of top-right-bottom-left 
		switch (_iconSetting.align) {
			case Icon.HorizontalAlign.Left:
				x1 = width * 0.5;
				x2 = width;
				x3 = 0;
				break;
			case Icon.HorizontalAlign.Right:
				x1 = -width * 0.5;
				x2 = 0;
				x3 = -width;
				break;
			case Icon.HorizontalAlign.Center:
			default:
				x1 = 0;
				x2 = width * 0.5;
				x3 = -x2;
				break;
		}
		switch (_iconSetting.valign) {
			case Icon.VerticalAlign.Top:
				y1 = 0;
				y2 = height;
				y3 = y2;
				break;
			case Icon.VerticalAlign.Bottom:
				y1 = -height;
				y2 = 0;
				y3 = y2;
				break;
			case Icon.VerticalAlign.Center:
			default:
				y1 = -height * 0.5;
				y2 = height * 0.5;
				y3 = y2;
				break;
		}


		pointArray.push(adjustPointWithAlignment({
			x: x1,
			y: y1
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x2,
			y: y2
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x3,
			y: y3
		}));
		return pointArray;
	};
	var constructTrangleDown = function(width, height){
		var pointArray = [];
		var x1, y1, x2, y2, x3, y3; // in order of top-right-bottom-left 
		switch (_iconSetting.align) {
			case Icon.HorizontalAlign.Left:
                    x1 = 0;
                    x2 = width;
                    x3 = width * 0.5;
                    break;
                case Icon.HorizontalAlign.Right:
                    x1 = -width;
                    x2 = 0;
                    x3 = -0.5 * width;
                    break;
                case Icon.HorizontalAlign.Center:
                default:
                    x1 = -0.5 * width;
                    x2 = 0.5 * width;
                    x3 = 0;
                    break;
		}
		switch (_iconSetting.valign) {
			case Icon.VerticalAlign.Top:
				y1 = 0;
				y2 = y1;
				y3 = height;
				break;
			case Icon.VerticalAlign.Bottom:
				y1 = -height;
				y2 = y1;
				y3 = 0;
				break;
			case Icon.VerticalAlign.Center:
			default:
				y1 = -height * 0.5;
				y2 = y1;
				y3 = height * 0.5;
				break;
		}
		
		pointArray.push(adjustPointWithAlignment({
			x: x1,
			y: y1
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x2,
			y: y2
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x3,
			y: y3
		}));
		
		return pointArray;
	};
	var constructTrangleLeft = function(width, height){
		var pointArray = [];
		var x1, y1, x2, y2, x3, y3; // in order of top-right-bottom-left 
		switch (_iconSetting.align) {
			case Icon.HorizontalAlign.Left:
				x1 = width;
				x2 = x1;
				x3 = 0;
				break;
			case Icon.HorizontalAlign.Right:
				x1 = 0;
				x2 = x1;
				x3 = -width;
				break;
			case Icon.HorizontalAlign.Center:
			default:
				x1 = 0.5 * width;
				x2 = x1;
				x3 = -x1;
				break;
		}
		switch (_iconSetting.valign) {
			case Icon.VerticalAlign.Top:
				y1 = 0;
				y2 = height;
				y3 = 0.5 * height;
				break;
			case Icon.VerticalAlign.Bottom:
				y1 = -height;
				y2 = 0;
				y3 = -0.5 * height;
				break;
			case Icon.VerticalAlign.Center:
			default:
				y1 = -height * 0.5;
				y2 = height * 0.5;
				y3 = 0;
				break;
		}
		
		pointArray.push(adjustPointWithAlignment({
			x: x1,
			y: y1
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x2,
			y: y2
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x3,
			y: y3
		}));
		
		return pointArray;
	};
	var constructTrangleRight = function(width, height){
		var pointArray = [];
		var x1, y1, x2, y2, x3, y3; // in order of top-right-bottom-left 
		switch (_iconSetting.align) {
			case Icon.HorizontalAlign.Left:
				x1 = 0;
				x2 = width;
				x3 = x1;
				break;
			case Icon.HorizontalAlign.Right:
				x1 = -width;
				x2 = 0;
				x3 = x1;
				break;
			case Icon.HorizontalAlign.Center:
			default:
				x1 = -0.5 * width;
				x2 = 0.5 * width;
				x3 = x1;
				break;
		}
		switch (_iconSetting.valign) {
			case Icon.VerticalAlign.Top:
				y1 = 0;
				y2 = 0.5 * height;
				y3 = height;
				break;
			case Icon.VerticalAlign.Bottom:
				y1 = -height;
				y2 = -0.5 * height;
				y3 = 0;
				break;
			case Icon.VerticalAlign.Center:
			default:
				y1 = -height * 0.5;
				y2 = 0;
				y3 = height * 0.5;
				break;
		}
		
		pointArray.push(adjustPointWithAlignment({
			x: x1,
			y: y1
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x2,
			y: y2
		}));
		pointArray.push(adjustPointWithAlignment({
			x: x3,
			y: y3
		}));
		
		return pointArray;
	};
	var adjustPointWithAlignment = function(pt){
		if (_iconSetting.align == Icon.HorizontalAlign.Center) {
			pt.x += _iconSetting.region.width * 0.5;
		}
		else if (_iconSetting.align == Icon.HorizontalAlign.Right) {
			pt.x += _iconSetting.region.width - RIGHT_MARGIN * _iconSetting.zoomx;
		}
		else if (_iconSetting.align == Icon.HorizontalAlign.Left) {
			pt.x += LEFT_MARGIN * _iconSetting.zoomx;
		}

		if (_iconSetting.valign == Icon.VerticalAlign.Center) {
			pt.y += _iconSetting.region.height * 0.5;
		}
		else if (_iconSetting.valign == Icon.VerticalAlign.Bottom) {
			pt.y += _iconSetting.region.height;
		}

		if (_isCanvas) {
			pt.x += _iconSetting.position.x;
			pt.y += _iconSetting.position.y;
		}

		return pt;
	};

	var initializeEx = function(){
		_isCanvas = isCanvas(container);
		if (false == _isCanvas){
			var tmpWrapper = $('<div style="position:relative"></div>')
			tmpWrapper.appendTo(container);
			_container = tmpWrapper.get(0);
		}
		else{
			_container = container;
		}
		_iconSetting = null;
		_graphics = _isCanvas ? new $.Graphics(_container.getContext("2d")) : null;
	};
	var isCanvas = function(container){
		if (container) {
			return container.nodeName.toLowerCase() == "canvas";
		}
		return false;
	};
	initializeEx();
};



