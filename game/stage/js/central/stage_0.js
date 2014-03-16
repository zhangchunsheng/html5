//
// @author				mitchell
// @description		rebuild.html页面的JS打包文件 注意引用顺序
// @lastmodified		$2010-10 -15$

function include(filename) {
	document.write("<scr" + "ipt language=\"JavaScript\" " +
		"type=\"text/javascript\" src=\"" +filename+ "\"><\/script>");
}


include("js/lib/jquery-1.4.4.js");

// mico
include("js/core/wsui.js");
include("js/core/util.js");
include("js/core/extend.js");

include("js/ui/ui.draggable.js");
include("js/ui/ui.popup.js");

include("js/widget/widget.grid.js")
include("js/widget/widget.move.js");
include("js/widget/widget.render.js");
include("js/widget/widget.findway.js");

include("js/data/data.game.js");
include("js/data/data.enemy.js");
include("js/data/data.bullet.js");
include("js/data/data.tower.js");
include("js/data/data.stage.js");


include("js/app/app.map.js");
include("js/app/app.enemy.js");
include("js/app/app.tower.js");
include("js/app/app.bullet.js");
include("js/app/app.effect.js");
include("js/app/app.skill.js");
include("js/app/app.ui.js");
include("js/app/app.stage.js");

include("js/stage/stage.0.js");
include("js/initialize.js");