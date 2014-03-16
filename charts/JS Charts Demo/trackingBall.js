if(!Chart){
	var Chart = {};
}
if(!Chart.Component){
	Chart.Component = {};
}
Chart.Component.trackingBall=function(target){
	this._style={
		height:8,
		width:8,
		type:3,
		color:"#666666"
	};
	this._target=target;
	this._init=function(){
		if(this._placeHolder){
			this._placeHolder.remove();
		}
		this._placeHolder=$("<div></div>").css({
			position:"absolute",
			width:this._style.width,
			height:this._style.height
		}).appendTo(target);
	var w=this._style.width;
	var h=this._style.height;
	this._canvas=$.Canvas.create(this._placeHolder,"",0,0,w,h);
	this._ctx=this._canvas.getContext("2d");
	this._ctx.clearRect(0,0,w,h);		
	} 
	this._draw = function(){
		this._init();
		var icondrawer = new Icon.Drawer(this._canvas);
		var iconsetting = new Icon.Setting();
		iconsetting.align = 1;
		iconsetting.valign = 1;
		iconsetting.size.width = this._style.width;
		iconsetting.size.height =this._style.height;
		iconsetting.iconType = this._style.type;
		iconsetting.color =$.color.parse(this._style.color).toString();
		iconsetting.position.x =this._style.width/2;
		iconsetting.position.y =this._style.height/2;
		icondrawer.draw(iconsetting); 
	}
}
Chart.Component.trackingBall.prototype={
	setStyle:function(s){
		$.extend(true,this._style,s);
		return this;
	},
	draw:function(){
		this._draw();
		return this;
	},
	setPosition:function(p){
		if(p){
/*			this._placeHolder.unbind("mouseover").bind("mouseover",function(){
				 $(this).show();
			 });	*/			
			if(p.x&&typeof(p.x)=="number"){
				if(p.x>this._target.width()||p.x<0){
					this.hide();
					return;
				}
				var l=p.x-this._style.width/2;
				this._placeHolder.show().css({left:l});
			}
			if(p.y&&typeof(p.y)=="number"){
				if(p.y>this._target.height()||p.y<0){
					this.hide();
					return;
				}				
				var t=p.y-this._style.height/2;
				this._placeHolder.show().css({top:t});	
			}
		}
	 return this;	
	},
	hide:function(){
		this._placeHolder.hide();
		return this;
	},
	bind:function(type,fn){
		type=type.toLowerCase();
		if(type=="click"&&typeof(fn)=="function"){
 			this._placeHolder.bind(type,fn);
		}
		return this;		
	},
	unbind:function(type){
		if(typeof(type)=="undefined"){
			this._placeHolder.unbind();
		}
		else if(type=="string"){
		type=type.toLowerCase();
		this._placeHolder.unbind(type);			
		}
		return this;
	}
	
}
