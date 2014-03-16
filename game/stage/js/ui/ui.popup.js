// JavaScript Document
WSUI.Ui.Popup=function(title,loc,content){
	var _this=this;
	this.dom=$("<div class=\"popup\" style=\"left:150px;top:70px;z-index:999\">\
        <div class=\"header\">\
            弹出窗口\
        </div><div class=\"content\">\
        </div>\
    </div>");
	$("body").append(this.dom);
	this.dom.find(".content").append(content);
	if (!($.browser.msie&&$.browser.version<9)){
		this.basezoom=0;
		this.zoomMax=1.1;	
		this.stepzoom=0.3;
		this.zoomadd=function(){
			_this.basezoom+=_this.stepzoom;
				_this.dom.css({"-moz-transform":"scale("+_this.basezoom+")","-webkit-transform":"scale("+_this.basezoom+")",msTransform:"scale("+_this.basezoom+")"});
			if(_this.basezoom<_this.zoomMax){
				setTimeout(function(){
					_this.zoomadd();
				},40)
			}else{
				setTimeout(function(){
					_this.zoomSubtract();
				},40)
			}
		};
		this.zoomSubtract=function(){
			_this.basezoom-=_this.stepzoom;
				_this.dom.css({"-moz-transform":"scale("+_this.basezoom+")","-webkit-transform":"scale("+_this.basezoom+")",msTransform:"scale("+_this.basezoom+")"});
			if(_this.basezoom>1){
				setTimeout(function(){
					_this.zoomSubtract();
				},50)
			}else{
				setTimeout(function(){
					_this.dom.css({"-moz-transform":"scale(1)","-webkit-transform":"scale(1)",msTransform:"scale(1)"});
				},50)
			}
		}
		this.zoomadd();
	}
}
$.extend(WSUI.Ui.Popup.prototype,{
	closeDialog:function(){
		var _this=this;
		if (!($.browser.msie&&$.browser.version<9)){
			this.hide=function(){
				_this.basezoom+=_this.stepzoom;
					_this.dom.css({"-moz-transform":"scale("+_this.basezoom+")","-webkit-transform":"scale("+_this.basezoom+")",msTransform:"scale("+_this.basezoom+")"});
				if(_this.basezoom<_this.zoomMax){
					setTimeout(function(){
						_this.hide();
					},50)
				}else{
					setTimeout(function(){
						_this.hideStep2();
					},50)
				}
			};
			this.hideStep2=function(){
				_this.basezoom-=_this.stepzoom;
					_this.dom.css({"-moz-transform":"scale("+_this.basezoom+")","-webkit-transform":"scale("+_this.basezoom+")",msTransform:"scale("+_this.basezoom+")"});
				if(_this.basezoom>0){
					setTimeout(function(){
						_this.hideStep2();
					},40)
				}else{
					setTimeout(function(){
						_this.dom.remove();
					},40)
				}
			}
			this.hide();
		}else{
			_this.dom.remove();
		}
	}
})