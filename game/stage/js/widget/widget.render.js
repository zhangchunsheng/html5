// JavaScript Document

(function(timer){
	var _this=this;
	//NEW了一个对象后，即注册Classes
	WSUI.Classes.Render=this;
	WSUI.Classes.Render.List={}; //渲染列表,各个需要渲染的对象需讲自己丢进此列表
	this.timer=timer ? timer : 20;
		setInterval(function(){
			$.each(WSUI.Classes.Render.List,function(){
				$(this).trigger("render");
			})
		},_this.timer)//执行任务
})();
