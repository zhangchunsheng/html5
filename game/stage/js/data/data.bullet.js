// JavaScript Document
if(!WSUI.Data){WSUI.Data={}};

//基本数据
WSUI.Data.Bullet=function(){
	if(!WSUI.Classes["WSUI.Data.Bullet"])WSUI.Classes["WSUI.Data.Bullet"]=this;
	this.baseData=[
		{
			type:"normal",
			data:{ //标准弹
				power:2,life:400,spd:5,cls:"bullet_normal",effet:[]
			}
		},
		{
			type:"ice",
			data:{ //减速弹
				power:1,life:400,spd:5,cls:"bullet_ice",effet:["slow"]
			}
		},
		{
			type:"sniper",
			data:{ //长射程弹,有一定概率 直接秒敌
				power:5,life:400,spd:15,cls:"bullet_poison",effet:["kill"]
			}
		},
		{
			type:"poison",
			data:{ //毒气弹
				power:0,life:400,spd:5,cls:"bullet_poison",effet:["poison"]
			}
		}
	]
};

//数据操作接口
$.extend(WSUI.Data.Bullet.prototype,{//定义属于怪物数据的操作
	getData:function(t){//根据输入塔类型及等级求出相应的数据
		var _this=this;
		var val={};
		$.each(this.baseData,function(){
			if(this.type==t){//返回数据
				
				WSUI.Util.CloneAll(this.data,val);
			}
		})
		return val;
	},
/*	getData:function(e){//根据输入怪物类型及等级求出相应的数据
		var _this=this;
		var val={};
		$.each(this.baseData,function(){
			if(this.type==e){
				//根据等级修改返回的数据
				val.hp=this.data.hp+this.data.hp*(WSUI.Classes["WSUI.Data.Game"].baseData.level-1)*0.9;
				val.gold=this.data.gold+this.data.gold*(WSUI.Classes["WSUI.Data.Game"].baseData.level-1)*0.03;
				val.scores=this.data.scores+this.data.scores*(WSUI.Classes["WSUI.Data.Game"].baseData.level-1)*0.3;
				val.def=this.data.def;
				val.spd=this.data.spd;
				val.cls=this.data.cls;
			}
		})
		return val;
	}
*/
})

new WSUI.Data.Bullet();