// JavaScript Document
if(!WSUI.Data){WSUI.Data={}};

//基本数据
WSUI.Data.Game=function(){
	if(!WSUI.Classes["WSUI.Data.Game"])WSUI.Classes["WSUI.Data.Game"]=this;
	this.baseData={
			//level:3,
			wave:1,//当前波数
			life:20,
			gold:500,
			scores:0,
			step:100 //下一波间隔
		}
};

//数据操作接口
$.extend(WSUI.Data.Game.prototype,{//定义属于怪物数据的操作
/*	getLevel:function(){
		return this.baseData.level;
	},
*/	getWave:function(){
		return this.baseData.wave;
	},
	getGold:function(){
		return this.baseData.gold;
	},
	getStep:function(){
		return this.baseData.waveStep;
	},
	levelUp:function(){//游戏等级上升
		this.baseData.level++;
		$("#level").html(this.baseData.level);
		return this;
	},
	waveUp:function(){//波数上升
		this.baseData.wave++;
		$("#wave").html(this.baseData.wave);
		return this;
	},
	scoresUp:function(val){//成绩上升
		this.baseData.scores+=val;
		$("#scores").html(this.baseData.scores);
		return this;
	},
	goldUpdate:function(val){ //金币更新 得到的值为+~-
		this.baseData.gold+=parseInt(val);
		$("#gold").html(this.baseData.gold);
		return this;
	},
	lifeDown:function(){//剩余生命 不可回复
		this.baseData.life--;
		$("#life").html(this.baseData.life);
		if(this.baseData.life<=0){
			if(this.baseData.life==0){
				var dlg=new WSUI.Ui.Popup("","","<div style='width:450px;height:60px;text-align:center'>游戏结束，窗口关闭后仍可继续玩<br></div>");
				setTimeout(function(){dlg.closeDialog();},3000);
			}
			$("#life").html("游戏结束");

		}
		return this;
	}
})

new WSUI.Data.Game();