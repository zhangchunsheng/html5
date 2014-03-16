// JavaScript Document
if(!WSUI.Data){WSUI.Data={}};

//基本数据
WSUI.Data.Tower=function(){
	if(!WSUI.Classes["WSUI.Data.Tower"])WSUI.Classes["WSUI.Data.Tower"]=this;
	this.baseData=[
		{
			type:"normal",
			data:{ //标准塔
				range:50,interval:500,gold:50,cls:"tower_normal",bullet:"normal"
			}
		},
		{
			type:"ice",
			data:{ //减速塔,没什么攻击力
				range:50,interval:800,gold:100,cls:"tower_ice",bullet:"ice"
			}
		},
		{
			type:"sniper",
			data:{ //远距塔
				range:180,interval:1500,gold:150,cls:"tower_sniper",bullet:"sniper"
			}
		},
		{
			type:"range",
			data:{ //群体攻击塔,范围内的怪持续扣血
				range:50,interval:100,gold:250,cls:"tower_range",bullet:"range"
			}
		},
		{
			type:"poison",
			data:{ //持续伤害塔,没什么攻击力，但能使怪物持续受伤5秒
				range:50,interval:700,gold:200,cls:"tower_poison",bullet:"poison"
			}
		}
	]
};

//数据操作接口
$.extend(WSUI.Data.Tower.prototype,{//定义属于怪物数据的操作
	getData:function(t){//根据输入塔类型及等级求出相应的数据
		var _this=this;
		var val={};
		$.each(this.baseData,function(){
			if(this.type==t){//返回数据
				WSUI.Util.CloneAll(this.data,val);
			}
		})
		return val;
	}
})

new WSUI.Data.Tower();