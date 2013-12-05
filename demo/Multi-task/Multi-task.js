/*!
任务开发脚本 v0.03 (20100710)
更新日志:
0.01 建立了基本任务模型
0.02 改进了任务管理,扩展任务属性,优化多任务处理
0.03 支持动态修改任务，添加任务执行命令
说明：适用于各种定时任务应用，请注重劳动成果！保留说明文字，以便获得技术支持。
作者：康乐
发布：www.javacs.cn 中国java工作者
*/
var AlarmTimeSet=new Date();
var Atimes =new Array(); 
//任务数据类
function kllz(a,b,c,d,e,f,g){ 
this.Aid=a;//编号
this.Atime=b;//时间
this.Atext=c;//提示内容
this.Amusic=d;//音乐
this.Aphoto=e;//图像
this.Ais=f;//是否提示
this.Acmd=g;//执行命令
}

//生成GUID
kllz.newGuid=function(){ 
    var guid = ""; 
    for (var i = 1; i <= 32; i++){ 
        var n = Math.floor(Math.random()*16.0).toString(16); 
        guid += n; 
        if((i==8)||(i==12)||(i==16)||(i==20)) 
            guid += ""; 
    } 
    return guid; 
} 

//按index删除元素
Array.prototype.remove=function(dx)
  {
    if(isNaN(dx)||dx>this.length){return false;}
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i]!=this[dx])
        {
            this[n++]=this[i]
        }
    }
    this.length-=1
  }
//添加任务
kllz.addAtime =function()
{
	//if(Atimes.length!=0)
	//Atimes+={false};
	var AlarmTime=new Date(AlarmTimeSet.getFullYear(),AlarmTimeSet.getMonth()+1,AlarmTimeSet.getDate(),$("#H").val(),$("#M").val(),$("#S").val());
	var Aist=($('#Ais').attr('checked')) ? true : false;
	var lz  = new kllz(kllz.newGuid(),AlarmTime,$("#SMS").val(),$("#MUSIC").val(),$("#PHOTO").val(),Aist); 
	lz.Acmd=function(){
		kllz.gxAtimes();
		};
    Atimes.push(lz);
	$('#Ais').removeAttr("checked");
	var i=Atimes.length;
	var n=lz.Atime;
	$('#t').prepend("<li id=\"time_"+lz.Aid+"\">第" + i + "个任务: " +n.getFullYear()+"-"+n.getMonth()+"-"+n.getDate()+"  "+ n.getHours()+"-"+n.getMinutes()+"-"+n.getSeconds() +"\t提示内容："+lz.Atext+"\t提示音乐："+lz.Amusic+"\t提示图片："+lz.Aphoto+"\t是否提示:"+lz.Ais+"<button onClick=\"kllz.delAtimeAid('"+lz.Aid+"')\">删除</button><button onClick=\"kllz.updAtimeAid('"+lz.Aid+"')\">修改</button>");
	//gxAtimes();
	AlarmClock();
}
//根据index删除任务元素
kllz.delAtime=function (i)
{
	if(Atimes.length>0)
    Atimes.remove(i);
	$('#time_'+i).remove();
	//gxAtimes();
}
//修改指定任务
kllz.updAtimeAid=function(Aid)
{
	var AlarmTime=new Date(AlarmTimeSet.getFullYear(),AlarmTimeSet.getMonth()+1,AlarmTimeSet.getDate(),$("#H").val(),$("#M").val(),$("#S").val());
	var Aist=($('#Ais').attr('checked')) ? true : false;
	var lz  = new kllz(Aid,AlarmTime,$("#SMS").val(),$("#MUSIC").val(),$("#PHOTO").val(),Aist); 
	
	//var ts =kllz.selAtimeAid(Aid);
	//$.each(Atimes,ts,true);
	
	if(Atimes.length>0)
	{
		$.each( Atimes, function(j, m){
		var i=Atimes.length;
	var n=lz.Atime;
		if(m.Aid==Aid)
		{
			 Atimes[j]=lz;
			 $('#time_'+lz.Aid).html("第" + i + "个任务: " +n.getFullYear()+"-"+n.getMonth()+"-"+n.getDate()+"  "+ n.getHours()+"-"+n.getMinutes()+"-"+n.getSeconds() +"\t提示内容："+lz.Atext+"\t提示音乐："+lz.Amusic+"\t提示图片："+lz.Aphoto+"\t是否提示:"+lz.Ais+"<button onClick=\"kllz.delAtimeAid('"+lz.Aid+"')\">删除</button><button onClick=\"kllz.updAtimeAid('"+lz.Aid+"')\">修改</button>");
	
		}
		
		if(j>=Atimes.length-1)return null;
		});
	}
}
//根据Aid返回 任务元素
 kllz.selAtimeAid=function (idt)
 {
 	$('#time_'+idt).remove();
	if(Atimes.length>0)
	{
		$.each( Atimes, function(j, m){
		if(m.Aid==idt)
		{
			 return Atimes[j];
		}
		
		if(j>=Atimes.length-1)return null;
		});
	}
	 
 }
//根据Aid删除任务元素
kllz.delAtimeAid=function (idt)
{
$('#time_'+idt).remove();
	if(Atimes.length>0)
	{
		$.each( Atimes, function(j, m){
		if(m.Aid==idt)
		{
			 Atimes.remove(j);
		}
		
		if(j>=Atimes.length-1)return;
		});
	}
	//gxAtimes();
}
//更新任务
kllz.gxAtimes=function ()
{
	$('#t').html("");
	$.each( Atimes, function(i, m){
	var n = m.Atime;
	$('#t').prepend("<li id=\"time_"+m.Aid+"\">第" + (i+1) + "个任务: " +n.getFullYear()+"-"+n.getMonth()+"-"+n.getDate()+"  "+ n.getHours()+"-"+n.getMinutes()+"-"+n.getSeconds() +"<button onClick=\"kllz.delAtimeAid('"+m.Aid+"')\">删除</button></li>");
	if(i==Atimes.length-1)return;
	});
}
//开启任务
AlarmClock=function ()
{  
  
  var TimeNowSet=new Date();
 $.each( Atimes, function(i, m){
  
 n=m.Atime;
  //$('#w').prepend("Item #" + i + ": " + n +"<br/>");
  //任务时间
  //var AlarmTime=new Date(AlarmTimeSet.getFullYear(),AlarmTimeSet.getMonth()+1,AlarmTimeSet.getDate(),H.value,M.value,S.value);
  var AlarmTime=n;
  //当前时间
  var TimeNow=new Date(TimeNowSet.getFullYear(),TimeNowSet.getMonth()+1,TimeNowSet.getDate(),TimeNowSet.getHours(),TimeNowSet.getMinutes(),TimeNowSet.getSeconds());
 $('#w').html(i+"当前时间: " +TimeNowSet.getFullYear()+"-"+TimeNowSet.getMonth()+"-"+TimeNowSet.getDate()+"  "+ TimeNow.getHours()+"-"+TimeNow.getMinutes()+"-"+TimeNow.getSeconds() +"<br/>");
  if(TimeNow.getTime() == AlarmTime.getTime())
  {//到时间时处理
  }else if(AlarmTime.getTime() < TimeNow.getTime()){
  	//过时后处理
   var id="_old_"+kllz.newGuid();
      $('#time_'+m.Aid).html(" <b>时间到了</b>任务: " +n.getFullYear()+"-"+n.getMonth()+"-"+n.getDate()+"  "+ n.getHours()+"-"+n.getMinutes()+"-"+n.getSeconds() +"<button onClick=\"kllz.delAtimeAid('"+id+"')\">删除</button>"+"<br/>"); 
	   $('#time_'+i).attr("id",id);
	     if(m.Ais)
    	{
      		$('#q').prepend("<li>任务提醒:"+m.Atext+"\t播放音乐<embed width='5px' height='5px' autostart='true' src="+m.Amusic+">\t图像:<img src='"+m.Aphoto+"'/><b>时间到了</b>任务: " +n.getFullYear()+"-"+n.getMonth()+"-"+n.getDate()+"  "+ n.getHours()+"-"+n.getMinutes()+"-"+n.getSeconds() +"</li>"); 
    	}
	  Atimes.remove(i);
	  if(m.Acmd)m.Acmd();//回调执行命令
  }  
  if(i>=Atimes.length-1)return false;
 
});
$('#cont').val(Atimes.length+"个活动的任务");
  setTimeout("AlarmClock()",1000);
}