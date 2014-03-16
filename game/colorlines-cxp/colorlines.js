var oh=57, cols=9, minLineSize=5;
var md,mdCover,divNext,currScore,topScore,addingScore;
var data=[], blank=[], currBall, nextBalls=[], dataBalls={}, pathXYs=[],spaceValues=[],endValue,endP,cornerCount;
var imgpath='images/',imgpaths=[],colors=['black','blue','green','orange','purple','red','yellow'];
var colorsLength = colors.length;
var IS_MOVE=true, IS_NOT_MOVE=false;
var Score={curr:0,top:100};
var currShowing='';
var IE=0/*@cc_on+1@*/;
for(var i=0;i<colorsLength;i++){
	imgpaths[i]=imgpath+colors[i]+'.p'+'ng';
	(new Image()).src=imgpaths[i];
}
if(!window.console)console={};
if(!console.info)console.info=function(){};
if(!console.debug)console.debug=function(){};

function $$(s){return document.getElementById(s)}
function randomInt(ceil){return Math.floor(Math.random()*ceil)}
function p2xy(p){return {x:p%cols, y:(p-p%cols)/cols}}
function xy2p(x,y){return x+y*cols}
function FALSE_FUNC(){return false;}
function FALSE_FUNC_FF(e){e.preventDefault();e.stopPropagation();return false;}

Score.print = function (ele,n){
	var y=ele==topScore?0:-28;
	var arr=n.toString().split('');
	var s='',len=arr.length;
	ele.style.width=(len>4)?'130px':'105px';
	while(len--){
		s+='<div style="background-position: '+(-25*arr[len])+'px '+(y)+'px;"></div>';
	}
	ele.innerHTML = s;
}
Score.read = function (){
	var m=document.cookie.match(/(?:^|\s|\;)colorline_cxp_score_top=(\d+)/);
	if(m)this.top = +m[1];
	return this.top;
}
Score.save = function (){
	var d=new Date((new Date()).getFullYear()+2,1,1);
	document.cookie = 'colorline_cxp_score_top='+this.top+'; expires='+d.toGMTString();
}
Score.adding = function (n){
	var ele=addingScore, style = ele.style;
	var x=(md.offsetHeight>>1)-50;
	var a=0.05, ad=0.05;
	ele.innerHTML = '+'+n;
	this.curr+=n;
	this.print(currScore, this.curr);
	if(this.top < this.curr){
		this.top = this.curr;
		this.save();
	}
	var _f=function (){
		if(a>0){
			a += ad;
			if(a>1){
				a=1;
				ad=-ad;
			}
			if(IE){
			ele.filters[0].opacity = a*100;
			}else{
			style.opacity = a;
			}
			style.top = (x-=2)+'px';
		}else{
			style.top = '';
			clearInterval(_timer);
		}
	}
	var _timer=setInterval(_f,30);
}

function Ball(element,color,x,y){
	this.element=element;
	this.color=color;
	this.x=x;
	this.y=y;
	this.p=this.getP();
}
Ball.prototype.getP=function(){
	this.p=this.x+this.y*cols;
	return this.p;
}
Ball.prototype.putAt=function(x,y){
	this.x=x;
	this.y=y;
	this.getP();
	this.element.style.left=x*oh+'px';
	this.element.style.top=y*oh+'px';
}
Ball.prototype.cssHT=function(height,top){
	this.element.style.height = height+'px';
	this.element.style.top = top+'px';
}
Ball.prototype.cssLT=function(left,top){
	this.element.style.left = left+'px';
	this.element.style.top = top+'px';
}
Ball.prototype.cssWHLT=function(width,height,left,top){
	this.element.style.width = width+'px';
	this.element.style.height = height+'px';
	this.element.style.left = left+'px';
	this.element.style.top = top+'px';
}
Ball.prototype.destroy=function(){
	this.element.parentNode.removeChild(this.element);
}
Ball.prototype.animate=function(){
	var i=0, delay=80, d=[0,1,2,3,4,5,4,3,2,1], n=d.length, t=this.y*oh;
	var THIS=this;
	var _f=function(){
		i=(i+1)%n;
		THIS.cssHT(oh-d[i]*2,  t+d[i]*2);
		THIS.timerId=setTimeout(_f,delay);
	}
	_f();
}
Ball.prototype.stopAnimate=function(){
	clearTimeout(this.timerId);
	this.cssHT(oh,  this.y*oh);
}
Ball.prototype.animateMove=function(path){
	if(path.length<4)return;
	var aniXY=[], stepPix=8, delay=20, timerId, x0=this.x, y0=this.y, l0=x0*oh, t0=y0*oh, x1,y1,t1,l1, N=path.length;
	var p1=xy2p(path[N-2],path[N-1]), p0=xy2p(this.x,this.y);
	this.x=path[N-2]; this.y=path[N-1]; this.getP();
	data[p1]=data[p0]; data[p0]=0;
	delete dataBalls[p0];
	dataBalls[p1]=this;
	var ds=[],dir,i,j;
	for(i=1;i<=4;i++){
		ds[i-1]=Math.round(i*oh/4);
	}
	for(i=1;i<N/2;i++){
		l1=path[i*2]*oh, t1=path[i*2+1]*oh;
		if(l1==l0){
			dir=t1>t0?1:-1;
			for(j=0;j<4;j++){
				aniXY.push(l0, t0+ds[j]*dir);
			}
			aniXY[aniXY.length-1]=t1;
		}else{
			dir=l1>l0?1:-1;
			for(j=0;j<4;j++){
				aniXY.push(l0+ds[j]*dir, t0);
			}
			aniXY[aniXY.length-2]=l1;
		}
		l0=l1; t0=t1;
	}
	var M=aniXY.length, i=0;
	var THIS=this, P=this.p;
	currShowing='animateMove';
	var _f=function (){
		THIS.cssLT(aniXY[i], aniXY[i+1]);
		i+=2;
		if(i<M){
			timerId=setTimeout(_f,delay);
		}else{
			currShowing='';
			checkLine([P], IS_MOVE);
		}
	}
	_f();
}

function animateHideBalls(balls,callback){
	var k=10, delay=50, timerId;
	for(var i=0;i<balls.length;i++){
		delete dataBalls[balls[i].p];
	}
	currShowing='animateHideBalls';
	var _f=function (){
		k--;
		if(k>0){
			var h=Math.round(oh*k/10);
			var d2=Math.round((10-k)*oh/20);
			for(var i=0;i<balls.length;i++){
				balls[i].cssWHLT(h, h, balls[i].x*oh+d2, balls[i].y*oh+d2);
			}
			timerId=setTimeout(_f,delay);
		}else{
			currShowing='';
			for(var i=0;i<balls.length;i++){
				balls[i].destroy();
				balls[i]=null;
			}
			if(callback)callback();
		}
	}
	_f();
}
function animateShowBalls(balls,callback){
	var k=10, delay=50, timerId;
	currShowing='animateShowBalls';
	var _f=function (){
		k--;
		if(k>=0){
			var d=Math.round(oh*k/20);
			for(var i=0;i<balls.length;i++){
				balls[i].cssWHLT(oh-d*2, oh-d*2, balls[i].x*oh+d, balls[i].y*oh+d);
			}
			if(k>0){
				timerId=setTimeout(_f,delay);
			}else{
				currShowing='';
				if(callback)callback();
			}
		}
	}
	_f();
}


function randomPutBalls(n,callback){
	var arr=randomBlanks(n), nn=n, balls=[], gameover=false;
	if(arr.length<n){
		gameover=true;
		n=arr.length;
	}
	while(n--){
		var p=arr[n];
		var xy=p2xy(p);
		var ball=new Ball(md.appendChild(nextBalls[n].cloneNode(true)), nextBalls[n].color, xy.x, xy.y);
		dataBalls[p]=ball;
		data[p]=ball.color+1;
		balls.push(ball);
	}
	animateShowBalls(balls, function(){
		checkLine(arr, IS_NOT_MOVE);
		checkGameOver();
	});
	if(callback)callback();
	randomNextBalls(nn);
	if(blank.length==0)gameover=true;
}
function randomNextBalls(n){
	var i;
	while(n--){
	i=randomInt(colorsLength);
	nextBalls[n].color=i
	nextBalls[n].src=imgpaths[i];
	}
}
function randomBlanks(n){
	var A=[],i;
	if(blank.length<=n)return blank.splice(0,blank.length);
	while(n--){
		i=randomInt(blank.length);
		A[n]=blank.splice(i,1)[0];
	}
	return A;
}
function replaceBlank(a,b){
	for(var i=0;i<blank.length;i++){
		if(blank[i]==a){
			blank[i]=b;
			break;
		}
	}
}
function checkLine(pArr, isMove){
	var linePArr=[],allLinePArr=[], dxyArr=[-1,-1,1,1,  -1,1,1,-1,  -1,0,1,0,  0,-1,0,1];
	var p0,color0,xy0,x0,y0, p1,color1,xy1,x1,y1, dx,dy, i,j,k, clears=0;
	for(k=0;k<pArr.length;k++){
		p0=pArr[k], color0=data[p0];
		xy0=p2xy(p0),x0=xy0.x,y0=xy0.y;
		var foundLine=false;
		for(i=0;i<4;i++){
			linePArr.unshift([]);
			for(j=0,x1=x0,y1=y0;j<2;j++){
				dx=dxyArr[i*4+j*2],dy=dxyArr[i*4+j*2+1];
				while(true){
					x1+=dx, y1+=dy, p1=xy2p(x1,y1);
					if(x1<0 || x1>=cols || y1<0 || y1>=cols || data[p1]!=color0){
						x1=x0,y1=y0;
						break;
					}else{
						linePArr[0].push(p1);
					}
				}
			}
			if(linePArr[0].length<minLineSize-1){
				linePArr[0].length=0;
				linePArr.shift();
			}else{
				if(!foundLine){
					foundLine=true;
					allLinePArr.push(p0);
				}
				for(var n=linePArr[0].length-1;n>=0;n--){
					allLinePArr.push(linePArr[0][n]);
				}
			}
		}
	}
	if(allLinePArr.length>0){
		var tmp={};
		for(var i=allLinePArr.length-1;i>0;i--){
			if(tmp[allLinePArr[i]]){
				allLinePArr.splice(i,1);
			}else{
				tmp[allLinePArr[i]]=true;
			}
		}
		tmp=null;
		var balls=[];
		for(var i=allLinePArr.length-1;i>=0;i--){
			var p=allLinePArr[i];
			balls[i]=dataBalls[p];
			if(currBall==balls[i])currBall=null;
			data[p]=0;
			blank.push(p);
		}
		if(isMove){
			animateHideBalls(balls);
			Score.adding(allLinePArr.length*20 - minLineSize*10);
		}else{
			animateHideBalls(balls);
		}
	}else{
		if(isMove){
			randomPutBalls(3);
		}
	}
	return allLinePArr.length>0;
}
function checkGameOver(){
	if(blank.length>0)return;
	if(Score.top<Score.curr){
		Score.top = Score.curr;
		Score.save();
		Score.print(topScore,Score.top);
	}
	showGameOver();
	setTimeout(function(){if(currShowing=='gameOver'){replay()}},6000);
}
function calSpaceValues(x,y,value){
	var p=xy2p(x,y), v0=spaceValues[p];
	if(value==0){
		v0=0;
	}else{
		if(value>=endValue || value>=v0)return;
		if(p==endP){
			if(value<endValue){
				endValue=value;
				spaceValues[p]=value;
			}
			return;
		}
	}
	spaceValues[p]=value++;
	if(y>0 && data[p-cols]==0)
		calSpaceValues(x,y-1,value);
	if(y+1<cols && data[p+cols]==0)
		calSpaceValues(x,y+1,value);
	if(x>0 && data[p-1]==0)
		calSpaceValues(x-1,y,value);
	if(x+1<cols && data[p+1]==0)
		calSpaceValues(x+1,y,value);
}
function searchPath(x,y,expectedValue,tmpPath,tmpCornerCount){
	var p=xy2p(x,y), value=spaceValues[p];
	if(data[p]!=0 && value!=0)return;
	if(value!==expectedValue)return;
	if(tmpPath.length==0){
		pathXYs.length=0;
		cornerCount=0;
	}else{
		if(tmpPath.length>=4){
			if(x!==tmpPath[2] && y!==tmpPath[3]){
				tmpCornerCount++;
			}
		}
	}
	tmpPath.unshift(x,y);
	if(value===0){
		if(tmpCornerCount<cornerCount || pathXYs.length==0){
			pathXYs=tmpPath.slice(0);
			cornerCount=tmpCornerCount;
		}
		return;
	}
	value--;
	if(y>0)
		searchPath(x,y-1,value,tmpPath.slice(0),tmpCornerCount);
	if(y+1<cols)
		searchPath(x,y+1,value,tmpPath.slice(0),tmpCornerCount);
	if(x>0)
		searchPath(x-1,y,value,tmpPath.slice(0),tmpCornerCount);
	if(x+1<cols)
		searchPath(x+1,y,value,tmpPath.slice(0),tmpCornerCount);
}

function md_onmouseup(e){
	if(currShowing)return;
	var event=window.event||e, obj=event.srcElement||event.target;
	var x=(typeof event.offsetX!='undefined')?event.offsetX:event.layerX;
	var y=(typeof event.offsetY!='undefined')?event.offsetY:event.layerY;
	x=(x-x%oh)/oh;
	y=(y-y%oh)/oh;
	var p=xy2p(x,y);
	var isBall=!!dataBalls[p];
	if(isBall){
		var eventBall=dataBalls[p];
		if(currBall!=eventBall){
			if(currBall){
				currBall.stopAnimate();
			}
			currBall=eventBall;
			currBall.animate();
		}
	}else if(currBall){
		replaceBlank(xy2p(x,y), currBall.p);
		endValue=cols*cols;
		endP=xy2p(x,y);
		spaceValues=[];
		calSpaceValues(currBall.x,currBall.y,0);
		searchPath(x,y,spaceValues[xy2p(x,y)],[],0);
		if(pathXYs.length>=4){
			currBall.stopAnimate();
			currBall.animateMove(pathXYs);
			currBall=null;
		}else{
		}
	}else{
	}
}

function replay(){
	for(var i=cols*cols-1;i>=0;i--){
		data[i]=0;
		blank[i]=i;
	}
	currBall=null, dataBalls={}, spaceValues=[],pathXYs=[];
	if(Score.top<Score.curr){
		Score.top = Score.curr;
		Score.save();
	}
	Score.print(topScore,Score.top);
	Score.curr=0;
	Score.print(currScore, Score.curr);
	md.innerHTML='';
	randomNextBalls(3);
	randomPutBalls(3);
	currShowing='';
	hideGameOver();
	hideAboutus();
}

function showGameOver(){
	currShowing='gameOver';
	$$("gameOver").style.top='';
	$$("gameOverBg").style.top='';
}
function hideGameOver(){
	$$("gameOver").style.top='-1000px';
	$$("gameOverBg").style.top='-1000px';
}
function showAboutus(){
	currShowing='aboutus';
	$$("aboutus").style.top='';
}
function hideAboutus(){
	currShowing='';
	$$("aboutus").style.top='-1000px';
}
function showLoading(){
	currShowing='loading';
	$$("loading").style.top='';
	$$("gameBody").style.top='-1000px';
}
function hideLoading(){
	currShowing='';
	$$("loading").style.top='-1000px';
	$$("gameBody").style.top='';
}

function init(){
	md=$$("md");
	currScore=$$("currScore");
	topScore=$$("topScore");
	addingScore=$$("addingScore");
	mdCover=$$("mdCover");
	divNext=$$("next");
	divNext.innerHTML='<img align="absmiddle"><img align="absmiddle"><img align="absmiddle">';
	nextBalls=divNext.childNodes;
	Score.read();
	Score.print(currScore, Score.curr);
	Score.print(topScore,Score.top);
	replay();
	hideLoading();
	document.body.oncontextmenu = FALSE_FUNC;
	mdCover.onmouseup = md_onmouseup;
	mdCover.onmousemove = IE ? FALSE_FUNC : FALSE_FUNC_FF;
	mdCover.onclick = function(){
		if(currShowing=='aboutus'){
			currShowing='';
			hideAboutus();
		}else if(currShowing=='gameOver'){
			currShowing='';
			replay();
		}
	}
	$$("btnAbout").onclick = function(){
		if(currShowing=="skins")Skin.hidePanel();
		if(!currShowing){
			showAboutus();
		}
		this.blur();
		return false;
	}
	$$("btnSkin").onclick = function(){
		if(currShowing=="aboutus")hideAboutus();
		if(!currShowing){
			Skin.showPanel();
		}
		this.blur();
		return false;
	}
	$$("skinPanel").onclick = function(e){
		if((e ? e.target : window.event.srcElement)['tagName']!='IMG'){
			Skin.hidePanel();
		}
	}
	$$("btnReplay").onclick = function(){
		if(currShowing=="aboutus")hideAboutus();
		if(currShowing=="skins")Skin.hidePanel();
		if(!currShowing){
			replay();
		}
		this.blur();
		return false;
	}
}
window.onload = init;

Skin={
	'data':{
		'classical':['','']
		,'girl':['images/bg-girl.jpg','images/grid-purple.gif']
		,'mdb':['images/bg-mdb.jpg','images/grid-white.gif']
		,'spring':['images/bg-spring.jpg','images/grid-grass.gif']
	}
	,'active':'classical'
	,'ready':false
	,'loaded':{'classical':true}
}
Skin.init = function(){
	this.ready=true;
	this.panel=$$("skinPanel");
	this.list=$$("skinList");
	var s='';
	for(var n in this.data){
		s+='<a href="/"'+(n==this.active?' class="active"':'')+' skinname="'+n+'" onclick="Skin.set(\''+n+'\');return false;" hidefocus="true"><img src="'+imgpath+'skin-'+n+'.png" width="144" height="132" /></a>';
	}
	s+='<br style="clear:both;font-size:0;" />';
	this.list.innerHTML=s;
}
Skin.read = function (){
	var m=document.cookie.match(/(?:^|\s|\;)colorline_cxp_skin_active=([^;]+)/);
	if(m)this.active = m[1];
	return this.active;
}
Skin.save = function (){
	var d=new Date((new Date()).getFullYear()+2,1,1);
	document.cookie = 'colorline_cxp_skin_active='+this.active+'; expires='+d.toGMTString();
}
Skin.showPanel = function(){
	currShowing='skins';
	if(!this.ready)this.init();
	this.panel.style.top='';
}
Skin.hidePanel = function(){
	currShowing='';
	this.panel.style.top='-1000px';
}
Skin.onload = function(){
	hideLoading();
	var d=this.data[this.active];
	$$("stage").style.backgroundImage=d[0]?'url('+d[0]+')':'';
	$$("md").style.backgroundImage=d[1]?'url('+d[1]+')':'';
	$$("next").style.backgroundImage=d[1]?'url('+d[1]+')':'';
}
Skin.set = function(skinName){
	if(!skinName || !this.data[skinName])return;
	this.active = skinName;
	this.save();
	var as=this.list.childNodes, asN=as.length;
	for(var i=0;i<asN;i++){
		if(as[i].getAttribute("skinname")==this.active){
			if(as[i].className!="active")as[i].className='active';
		}else{
			if(as[i].className=="active")as[i].className='';
		}
	}
	var d=this.data[skinName];
	$$("stage").style.cssText='';
	$$("md").style.cssText='';
	$$("next").style.cssText='';
	if(!this.loaded[skinName]){
		showLoading();
		var img=new Image();
		var img2=new Image();
		//img.onload = function(){if(img.complete && img2.complete)Skin.onload();}
		//img2.onload = function(){if(img.complete && img2.complete)Skin.onload();}
		img.onload = function(){Skin.onload();}
		img.src = d[0];
		img2.src = d[1];
	}else{
		$$("stage").style.backgroundImage=d[0]?'url('+d[0]+')':'';
		$$("md").style.backgroundImage=d[1]?'url('+d[1]+')':'';
		$$("next").style.backgroundImage=d[1]?'url('+d[1]+')':'';
	}
	this.hidePanel();
}
Skin.read();
if(Skin.active!='classical'){
	Skin.init();
	Skin.set(Skin.active);
}