// JavaScript Document
//特效包

WSUI.App.Effect=function(){
		WSUI.Classes.Effect=this;
}

$.extend(WSUI.App.Effect.prototype,{
	bulletHit:function(x,y){
		var id="fx_"+Math.random().toString().replace(".","_");
		var dom=$("<img src='images/boom_0"+Math.floor(1+Math.random()*4) +".gif#"+id+"' id='"+id+"' class='effect bomb_effect' style=\"top:"+(y-14)+"px;left:"+(x-14)+"px\"/>");
		$("#warp").append(dom);
		setTimeout(function(){dom.remove()},500*WSUI.Classes.Global["spd"]);
	},
	iceBulletHit:function(x,y){
		var id="fx_"+Math.random().toString().replace(".","_");
		var dom=$("<img src='images/freeze_01.gif#"+id+"' id='"+id+"' class='effect freeze_effect' style=\"top:"+(y-10)+"px;left:"+(x-10)+"px\"/>");
		$("#warp").append(dom);
		setTimeout(function(){dom.remove()},400*WSUI.Classes.Global["spd"]);
	},
	poisonBulletHit:function(x,y){
		var id="fx_"+Math.random().toString().replace(".","_");
		var dom=$("<img src='images/poison_01.gif#"+id+"' id='"+id+"' class='effect poison_effect' style=\"top:"+(y-10)+"px;left:"+(x-10)+"px\"/>");
		$("#warp").append(dom);
		setTimeout(function(){dom.remove()},400*WSUI.Classes.Global["spd"]);
	},

	enemyDie:function(x,y){
		var id="fx_"+Math.random().toString().replace(".","_");
		var dom=$("<img src=\"images/fire.gif#"+id+"\" id=\""+id+"\" class=\"enemy_die\" style=\"top:"+(y-14)+"px;left:"+(x-14)+"px\"/>")
		$("#warp").append(dom);	
		dom.animate({"opacity":0},{duration:700*WSUI.Classes.Global["spd"],easing:"linear",complete:function(){
			$(this).remove();
		}})
	},
	vibrate:function(dom){
		//注： 目前此方法，仅仅用于窗体，因为窗体没有设计成对象，所以不具备XY等属性
		var FUNC=[
			function(){dom.css("left","-2px");doActionList()},
			function(){setTimeout(function(){dom.css("left","1px");doActionList()},30*WSUI.Classes.Global["spd"])},
			function(){setTimeout(function(){dom.css("top","1px");doActionList()},30*WSUI.Classes.Global["spd"])},
			function(){setTimeout(function(){dom.css("left","-1px");doActionList()},30*WSUI.Classes.Global["spd"])},
			function(){setTimeout(function(){dom.css("top","-1px");doActionList()},30*WSUI.Classes.Global["spd"])},
			function(){setTimeout(function(){dom.css({left:"0px",top:"0px"})},30*WSUI.Classes.Global["spd"])}
		]
		var doActionList=function(){
			$(document).dequeue("vibrate");
		}
		$(document).queue("vibrate",FUNC);
		doActionList();
	}
})

//自动新建对象
new WSUI.App.Effect();