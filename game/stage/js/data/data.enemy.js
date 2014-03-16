// JavaScript Document
if(!WSUI.Data){WSUI.Data={}};

//基本数据
WSUI.Data.Enemy=function(){
	if(!WSUI.Classes["WSUI.Data.Enemy"])WSUI.Classes["WSUI.Data.Enemy"]=this;
	this.baseData=[
		{
			type:"typeE",
			data:{ //标准初级怪，血量和速度成一般
				hp:3,def:1,spd:1,gold:5,scores:100,cls:"enemy_type_e"
			}
		},
		{
			type:"typeD",
			data:{//高速怪，血少，防御低，但速度快
				hp:3,def:0.7,spd:2,gold:8,scores:150,cls:"enemy_type_d"
			}
		},
		{
			type:"typeC",
			data:{ //重甲,血厚，防御厚，速度慢
				hp:6,def:2,spd:0.5,gold:20,scores:400,cls:"enemy_type_c"
			}
		},
		{
			type:"typeB",
			data:{//飞行怪，无视地图
				hp:3,def:0.5,spd:1,gold:7,scores:150,cls:"enemy_type_b"
			}
		},
		{
			type:"typeA",
			data:{//BOSS，单独出现，各方面都比较彪悍
				hp:20,def:2,spd:1,gold:50,scores:500,cls:"enemy_type_a"
			}
		}
	]
};

//数据操作接口
$.extend(WSUI.Data.Enemy.prototype,{//定义属于怪物数据的操作
	getData:function(e,l){//根据输入怪物类型及等级求出相应的数据
		var _this=this;
		var val={};
		$.each(this.baseData,function(){
			if(this.type==e){
				//根据等级修改返回的数据
				val.hp=this.data.hp+this.data.hp*(l-1);
				val.gold=this.data.gold+this.data.gold*(l-1)*0.3;
				val.scores=this.data.scores+this.data.scores*(l-1)*0.3;
				val.def=this.data.def;
				val.spd=this.data.spd;
				val.cls=this.data.cls;
			}
		})
		return val;
	}
})

new WSUI.Data.Enemy();