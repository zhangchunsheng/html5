
/*var drapStatus=0;//拖拽状态，0为默认状态，1为当前正在拖放


var dom=$("<div id=\"drap_item\" style=\"width:24px;height:24px;display:none;left:-100px;top:-100px;\" class=\"ui_drap_item\"></div>")
$("#warp").append(dom);
$("#towerPanel img").click(function(e){
	e.cancelBubble=true;
	e.stopPropagation();
	if(drapStatus==1){
		drapStatus=0;
		$("#warp").unbind("mousemove");
		dom.hide();
		return false;
	}
	drapStatus=1;
	
	dom.addClass("ui_drap_item_"+$(this).attr("type"))
	dom.show();
	$("#warp").bind("mousemove",function(e){
		dom.css({
			left:e.pageX-10,
			top:e.pageY-11
		})
	});
});

$("#warp").click(function(e){
	e.cancelBubble=true;
	e.stopPropagation(); 
	$("#warp").unbind("mousemove");
	if(drapStatus==1){
		dom.hide();
		drapStatus=0;
		if(dom.hasClass("ui_drap_item_type_e")){
			new WSUI.App.Tower("normal",e.pageX,e.pageY);
		}if(dom.hasClass("ui_drap_item_type_d")){
			new WSUI.App.Tower("ice",e.pageX,e.pageY);
		}
		dom.removeClass("ui_drap_item_type_e ui_drap_item_type_d ui_drap_item_type_c ui_drap_item_type_b ui_drap_item_type_a");
	};
})

*/