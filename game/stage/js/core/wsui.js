// define undefined
var undefined;

// Make sure we haven't already been loaded
var WSUI={};

WSUI.Classes={};//定义一个注册类，用于 关联 新建的对象

WSUI.Util={};

WSUI.Ui={};

WSUI.Widget={};

WSUI.App={};


//设置游戏的全局参数
WSUI.Classes.Global=[];
WSUI.Classes.Global["spd"]=1;

(function(){
	var d=new Date();
	WSUI.Classes.Global["timer"]=d.getTime();
})()


//屏蔽掉右键默认事件
$(document).mousedown(function(e){
	if(e.button==2){
		e.preventDefault();
		e.returnValue=false;
		//return false;
	}
})


WSUI.App.BaseObject=function(){} //基类: 塔 怪 子弹 地图 等基于此类， 但网格移动等功能类不继承

$.extend(WSUI.App.BaseObject.prototype,{
	initialize:function(options){
		this.x=options.x;
		this.y=options.y;
		
		//绑定class
		if(!WSUI.Classes[this.name])WSUI.Classes[this.name]=[];
		WSUI.Classes[this.name][this.id]=this;
		
		//在warp里生成DOM
		this.dom.css({
			left:this.x+"px",
			top:this.y+"px"
		});
		$("#warp").append(this.dom);
		
		//绑定网格
		WSUI.Classes.Grid.bind(this);
	}
	
})


/*function Person() {
	this.baseP="base";
}

Person.prototype = {
	getName: function() {
		return this.name;
	},
	setName:function(newName){
		return this.name=newName;
	}
}

function Employee(name, employeeID) {
	this.name = name;
	this.employeeID = employeeID;
	this.tempName=this.setName("aa");
	
	console.log(this.baseP);
}

Employee.prototype = new Person();
Employee.prototype.getEmployeeID = function() {
	return this.employeeID;
};


var zhang = new Employee("ZhangSan", "1234");
zhang.setName("wangwu"); // "ZhangSan" 
//console.log(zhang.getName()); // "ZhangSan" */