// JavaScript Document


//eg:SetStyle($(id),{left:'100px',top:'100px',zIndex:10})



WSUI.Util.GetAngle=function(t1,t2){//根据2点 获得 两点的角度
	return (Math.atan2(t1[1]-t2[1],t2[0]-t1[0])*180/3.1415+360)% 360;
};


WSUI.Util.GetOffset=function(angle,distance){//根据角度及距离，求出2点的偏差
	var a=angle*Math.PI/360*2;
	return [Math.cos(a)*distance,-Math.sin(a)*distance];
};


WSUI.Util.GetDistance=function(x1,y1,x2,y2){//根据2个坐标 求距离
	return Math.sqrt(Math.pow((y2-y1),2)+Math.pow((x2-x1),2))
};


WSUI.Util.GetCenter=function(o){//求中心  o必须拥有 x y w h 4个属性
	return [o.x+o.w/2,o.y+o.h/2];
};

WSUI.Util.Get_x_y=function(o){//根据中心求xy o必须有: cx,cy
	return [o.cx-o.w/2,o.cy-o.ch/2]
};


//A数字于B数值进行比较，当A数值在B的可容忍误差C内，则返回true 否则返回false
//example: WSUI.Util.FuzzyEqual(10,12,5) ==> return true; 因为12+5=17 12-5=8  8<10<15
WSUI.Util.FuzzyEqual=function(a,b,r){
	//if((a<(b+r))&&(a<(b-r))){return true}else{return false};
	return Math.abs(a-b) < r ? true : false;
};



WSUI.Util.Hit=function(objA,objB,callback){//碰撞测试 返回碰撞结果
	if((objA.x+objA.w>objB.x)&&(objA.x<objB.x+objB.w)&&(objA.y+objA.h>objB.y)&&(objA.y<objB.y+objB.h)){
		var hitDirection=[0,0]//碰撞方向,A相对B 第一位为左右 第2位为上下 -1为左上  +1为右下
		if((objA.x<objB.x+objB.w)&&(objA.x+objA.w>objB.x+objB.w)){ //右
			hitDirection[0]=1;
		}else if((objA.x<objB.x)&&(objA.x+objA.w>objB.x)){//左
			hitDirection[0]=-1;
		}
		
		if((objA.y<objB.y+objB.h)&&(objA.y+objA.h>objB.y+objB.h)){ //下
			hitDirection[1]=1;
		}else if((objA.y<objB.y)&&(objA.y+objA.h>objB.y)){//上
			hitDirection[1]=-1;
		}
		return [true,hitDirection]; 
	}
};

WSUI.Util.LoadImage=function(url,callback,Ar){//预加载图片
	if($.browser.msie){
		var img=new Image();  
		//当准备状态发生改变时判断是否complete，是则执行回调函数  
		img.onreadystatechange=function(){img.readyState=='complete'&&callback(Ar)}  
		//出错时状态改变事件置空，执行回调函数  
		img.onerror=function(){img.onreadystatechange=null;img.title=url;callback(Ar);};  
		img.src=url; //无论哪种浏览器，赋值要放在事件定义后  
	}else{
		var img=new Image();
		img.src=url;
		//是否有缓存，是则直接执行回调函数  
		img.complete?callback(Ar):(  
		//无缓存，执行onload后回调或者出错后回调  
			img.onload=function(){
				callback(Ar)
			},  
			img.onerror=function(){
				img.title=url;callback(Ar);
			}
		)
	}
};

WSUI.Util.CloneAll=function(fromObj,toObj){//对象复制
   for(var i in fromObj){    
      if(typeof fromObj[i] == "object"){    
         toObj[i]={};    
         WSUI.Util.CloneAll(fromObj[i],toObj[i]);    
         continue;    
      }    
      toObj[i] = fromObj[i];    
   }    
}   
/*
WSUI.Util.PlayAudio=function(src){
	this.list.hitTree=new Audio("audio/PZ_058.wav");
	
	if(/chrome/i.test(navigator.userAgent.toLowerCase()) && /webkit/i.test(navigator.userAgent.toLowerCase()) && /mozilla/i.test(navigator.userAgent.toLowerCase())){//目前只有chrome支持audio，所以非chrome不执行
		var media = new Audio(src);
		media.volume = 1;
		media.play();
		delete media;
	}
}*/