// JavaScript Document

//基于JQ的扩展包
$.extend({
	//将NUM强制转换为00000123的格式	
	formatNum:function(n,l){
		var str_n=n+'',i=l;
		while(i--)str_n='0'+str_n;
		return str_n.slice(-l);
	},
	strLen:function(val){//通过使用dom的方法，获得输入字符串的实际长度
		if(!document.getElementById("strLen")){
			var td=$("<div style='display:none' id=\"strLen\"></div>")
			$("body").append(td);
		}else{
			var td=$("#strLen");
		}
		td.html(val);
		return td.width();
	}
});

$.fn.extend({
	//此扩展用于使某INPUT空间获得光标，并使光标移动到最后
	//sample: $(".input").focusEnd()
	focusEnd:function(){
		return this.each(function(){
			var t=$(this).val();
			$(this).val("").focus().val(t);
		})
	},
	//使用此方法扩展了IE6下没有max-width和max-height的缺点，所以对于需要使用此功能的图片，建议首先关闭显示属性，以免加载过程中太大。
	//？？ 此扩展待确认
	maxSize:function(){
		return this.each(function(){
			if (($.browser.msie)&&($.browser.version<7)){
				var w=parseInt($(this).css("max-width"));
				var h=parseInt($(this).css("max-height"));
				var scale=$(this).width()/$(this).height();
	
				if($(this).width()>w){
					$(this).width(w);
					$(this).height($(this).width()/scale);
				};
				if($(this).height()>h){
					$(this).height(h);
					$(this).width($(this).height()*scale);
				};
			}
			$(this).show();
		})
	}
	
})


//extend IE6
if ($.browser.msie && $.browser.version < 7.0){
	//extend IE6 trim
	String.prototype.trim = function(){
		var str = this;
		str =str.replace(/^\s\s*/,''),
		ws=/\s/,
		i=str.length;
		while(ws.test(str.charAt(--i)));
		return str.slice(0,i+1);
	};
}