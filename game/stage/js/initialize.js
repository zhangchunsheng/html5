// JavaScript Document

//公共资源加载，完成后执行pageOnload;
var imgCount=0;
var loadFin=function(para){
	imgCount=imgCount+para;
	

	
	//$("#loading").html("loading"+imgCount +"/29");
	if(imgCount==19){
		//$("#loading").remove();

		pageOnload();
	}
}

WSUI.Util.LoadImage("images/e_e.gif",loadFin,1);
WSUI.Util.LoadImage("images/e_d.gif",loadFin,1);
WSUI.Util.LoadImage("images/e_c.gif",loadFin,1);
WSUI.Util.LoadImage("images/map.gif",loadFin,1);


WSUI.Util.LoadImage("images/space.gif",loadFin,1);
WSUI.Util.LoadImage("images/boom_01.gif",loadFin,1);
WSUI.Util.LoadImage("images/boom_02.gif",loadFin,1);
WSUI.Util.LoadImage("images/boom_03.gif",loadFin,1);
WSUI.Util.LoadImage("images/boom_04.gif",loadFin,1);
WSUI.Util.LoadImage("images/boom_05.gif",loadFin,1);
WSUI.Util.LoadImage("images/freeze_01.gif",loadFin,1);
WSUI.Util.LoadImage("images/poison_01.gif",loadFin,1);

WSUI.Util.LoadImage("images/tower_normal.png",loadFin,1);
WSUI.Util.LoadImage("images/tower_ice.png",loadFin,1);
WSUI.Util.LoadImage("images/tower_sniper.png",loadFin,1);
WSUI.Util.LoadImage("images/tower_poison.png",loadFin,1);


WSUI.Util.LoadImage("images/bullet_normal.gif",loadFin,1);
WSUI.Util.LoadImage("images/bullet_ice.gif",loadFin,1);
WSUI.Util.LoadImage("images/bullet_poison.gif",loadFin,1);
