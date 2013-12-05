// JavaScript Document
// 关卡
WSUI.App.Stage=function(){
	var _this=this;
	//读取game数据
	this.name="WSUI.App.Stage";
	WSUI.Classes[this.name]=this;
	this.waveStep=WSUI.Classes["WSUI.Data.Game"].getStep();//获得每波的间隔
//	this.start(WSUI.Classes["WSUI.Data.Game"].getWave());//获得数据库里的wave,开始
	this.timer=setInterval(function(){
		_this.next();
	},30000)
}

$.extend(WSUI.App.Stage.prototype,{
	start:function(w){//指定波数开始
		var _this=this;
		this.wave=w || 1;//获得波数,如果空则为第1波
		this.data=WSUI.Classes["WSUI.Data.Stage"].getData(this.wave);//根据波数获得数据
		var _count=0;//计数器
		var createEnemy=function(){
			new WSUI.App.Enemy(_this.data.type,_this.data.level,50,90);
			_count++;
			if(_count<_this.data.num){
				setTimeout(function(){
					createEnemy();
				},1000);
			};
		};
		createEnemy();
	},
	next:function(){//下一波
		WSUI.Classes["WSUI.Data.Game"].waveUp();//下一波
		this.start(WSUI.Classes["WSUI.Data.Game"].getWave());//获得数据库里的wave,开始
	},
	end:function(){//结束游戏，停止出现下一波
		clearInterval(this.timer);
	}
});

