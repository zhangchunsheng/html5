// JavaScript Document
if(!WSUI.Data){WSUI.Data={}};

//基本数据
WSUI.Data.Stage=function(){
	if(!WSUI.Classes["WSUI.Data.Stage"])WSUI.Classes["WSUI.Data.Stage"]=this;
	this.baseData=[//怪物类别、数量、怪物等级
	
		{
			wave:1,
			data:{
				num:5,type:"typeC",level:6
			}
		},
		{
			wave:2,
			data:{
				num:8,type:"typeD",level:8
			}
		},
		{
			wave:3,
			data:{
				num:10,type:"typeE",level:12
			}
		},
		{
			wave:4,
			data:{
				num:10,type:"typeD",level:15
			}
		},
		{
			wave:5,
			data:{
				num:10,type:"typeE",level:18
			}
		}
	]
};

//数据操作接口
$.extend(WSUI.Data.Stage.prototype,{//定义属于数据的操作
	getData:function(t){//根据输入的波数求出相应的数据
		var _this=this;
		var val={};
		$.each(this.baseData,function(){
			if(this.wave==t){//返回数据
				WSUI.Util.CloneAll(this.data,val);
			}
		})
		return val;
	}
})

new WSUI.Data.Stage();