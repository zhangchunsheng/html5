$(function(){
if ($(window).height()>720) { $('body').addClass('iphonex');  }
$('#main').addClass('block');
//$(".g-9").addClass('block');
getImgLoadEd('Loadingimages',function(){
$('.loading').addClass('block');
var percentage = 0;
   var interval = setInterval(function () {
       if (percentage < 100 && sp2) {
           percentage++;
           var widthTemp = (percentage).toFixed(0) + '%';
           $('.l-bg-w').css('width', widthTemp);
           $('.l-bg-3').text(widthTemp);
       } else {
	     	$('.g-1').addClass('block');
		  if (sp2) {
//  $('.l1-btn').animateCss('fadeInUp');
$('.l-bg-4').remove();
$('.loading').animateCss('fadeOut', function() {
$('.loading').removeClass('block');
setTimeout(function () {  $('.g1-btn').animateCss('fadeInUp'); }, 500); 
},1);
		  }else {
		  	sp1=1;
		  }
           clearInterval(interval);  
       }
   },40);
});
//getImgLoadEd('Loadingimg',function(){

//});
// setInterval(function() {
// 	$('.l-bg-2-2').animateCss('flash','',1); 
// }, 3000);
function music() {
  var audio = document.getElementById('music');
  if (audio !== null) {
    if (audio.paused) {
      audio.play();
    } else {
      audio.play();
    }
  }
}
//function g1play() {
// $('.g-1').addClass('block');
//	setTimeout(function () {
//	$('.g-bg-1').animateCss('gbg0',function() {
//			setTimeout(function () { 
//			$('.g-bg-1').removeClass('gbg0').animateCss('gbg2',function() {
//					setTimeout(function () { 
//					$('.g-bg-1').removeClass('gbg2').animateCss('gbg1',function() {
//							$('.g-bg-1').animateCss('none'); 
//							$('.g-1').animateCss('gbg3',function() {
//								setTimeout(function () { 
//								$('.g1-btn').animateCss('fadeInUp');
//								 }, 500); 
//									});
//							});
//							 }, 500); 
//					});
//			 }, 500);
//			 });
//			 }, 1000);
//}
$('.g-9 .p-2').on('click', function(e){  
var thit=$(this);
$('.g-9 .p-2').animateCss('btnbackground', function() {
 $('.g-10').addClass('block fadeIn'); 
},1);
//$.get("http://a3.digoo.cn/06/js/js.php", {v: "3"} );
});
$('.g-10').on('click', function(e){  $('.g-10').removeClass('block'); });
$('.g-9 .p-3').on('click', function(e){ 
//$.get("http://a3.digoo.cn/06/js/js.php", {v: "4"} );
$('.g-9 .p-3').animateCss('btnbackground', function() {
 window.location.href="https://img.yun.01zhuanche.com/frontapp/activity/2018/05/airport_outA.html?channel=mmjyspq2605_1";
},1); });

//$('.g-bg-btn').on('click', function(e){  
//setTimeout(function () { 
//music();
// }, 1000);  
//$(this).removeClass('block').css({opacity:1});
//$('.l1-btn').animateCss('btnbackground', function() {
//g1play();
//$('.loading').animateCss('fadeOut', function() {
//$('.loading').removeClass('block');
//},1);
//$.get("http://a3.digoo.cn/06/js/js.php", {v: "1"} );
//
// $('.g-1').addClass('block');
//},1);  });


//$('.l-bg-w').css({ width:vwidth });
// $('.l-bg-3').html(vwidth); 
});
//随机数   
function diu_Randomize(b,e){   
    if(!b && b!=0 || !e){return "?";}   
    return Math.floor( ( Math.random() * e ) + b );   
} 
//判断 指定要加载的图片 是否加载完成
function getImgLoadEd(loadingBox, callback, index) {
	var imgAll = document.getElementById(loadingBox);
	var imgL = imgAll.children.length;
	var imgStart = 0;
	var isLoad = false;
	function IfLoadImg() {
		var loading = parseInt((imgStart / imgL) * 100);
		// console.log(loading);
		if (index == 1) {
			$('.g-loading .l-4').css({
				width: loading / 100 * 3.04 + 'rem'
			});
			$('.g-loading .l-2').css({
				marginLeft: loading / 100 * 3.08 + 'rem'
			});
		}
		if (imgStart >= imgL) {
			// console.log('图片加载完成，图片总数量：' + imgStart);
			clearInterval(loadTimer);
			if (callback) {
				callback();
			}
			return;
		}
		//        console.log('上张图片是否加载完成：' + isLoad);  console.log('当前加载图片KEY：' + imgStart);
		if (!isLoad && imgStart != 0) {
			return;
		} else {
			isLoad = false
		}
		loadImg(imgStart);

		function loadImg(imgKey) {
			var curImg = imgAll.children[imgKey].src;
			var loadImg = new Image();
			loadImg.src = curImg;
			//            console.log(loadImg.src);
			loadImg.onload = function() {
				isLoad = true;
				imgStart++;
			}
		}
	}
	var loadTimer = setInterval(IfLoadImg, 56);
}
//根据屏幕大小改变根元素字体大小
(function(win, lib) {
	var doc = win.document;
	var docEl = doc.documentElement;
	var metaEl = doc.querySelector('meta[name="viewport"]');
	var flexibleEl = doc.querySelector('meta[name="flexible"]');
	var dpr = 0;
	var scale = 0;
	var tid;
	var flexible = lib.flexible || (lib.flexible = {});
	if (metaEl) {
		//console.warn('将根据已有的meta标签来设置缩放比例');
		var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
		if (match) {
			scale = parseFloat(match[1]);
			dpr = parseInt(1 / scale);
		}
	} else if (flexibleEl) {
		var content = flexibleEl.getAttribute('content');
		if (content) {
			var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
			var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
			if (initialDpr) {
				dpr = parseFloat(initialDpr[1]);
				scale = parseFloat((1 / dpr).toFixed(2));
			}
			if (maximumDpr) {
				dpr = parseFloat(maximumDpr[1]);
				scale = parseFloat((1 / dpr).toFixed(2));
			}
		}
	}

	if (!dpr && !scale) {
		var isAndroid = win.navigator.appVersion.match(/android/gi);
		var isIPhone = win.navigator.appVersion.match(/iphone/gi);
		var devicePixelRatio = win.devicePixelRatio;
		if (isIPhone) {
			// iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
			if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
				dpr = 3;
			} else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
				dpr = 2;
			} else {
				dpr = 1;
			}
		} else {
			// 其他设备下，仍旧使用1倍的方案
			dpr = 1;
		}
		scale = 1 / dpr;
	}

	docEl.setAttribute('data-dpr', dpr);
	if (!metaEl) {
		metaEl = doc.createElement('meta');
		metaEl.setAttribute('name', 'viewport');
		metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
		if (docEl.firstElementChild) {
			docEl.firstElementChild.appendChild(metaEl);
		} else {
			var wrap = doc.createElement('div');
			wrap.appendChild(metaEl);
			doc.write(wrap.innerHTML);
		}
	}

	function refreshRem() {
		var width = docEl.getBoundingClientRect().width;
		if (width / dpr > 750) {
			width = 750 * dpr;
		}
		var rem = width / 750 * 100; // 设计图 750
		docEl.style.fontSize = rem + 'px';
		flexible.rem = win.rem = rem;
	}

	win.addEventListener('resize', function() {
		clearTimeout(tid);
		tid = setTimeout(refreshRem, 300);
	}, false);
	win.addEventListener('pageshow', function(e) {
		if (e.persisted) {
			clearTimeout(tid);
			tid = setTimeout(refreshRem, 300);
		}
	}, false);

	if (doc.readyState === 'complete') {
		doc.body.style.fontSize = 12 * dpr + 'px';
	} else {
		doc.addEventListener('DOMContentLoaded', function(e) {
			doc.body.style.fontSize = 12 * dpr + 'px';
		}, false);
	}
	refreshRem();

	flexible.dpr = win.dpr = dpr;
	flexible.refreshRem = refreshRem;
	flexible.rem2px = function(d) {
		var val = parseFloat(d) * this.rem;
		if (typeof d === 'string' && d.match(/rem$/)) {
			val += 'px';
		}
		return val;
	}
	flexible.px2rem = function(d) {
		var val = parseFloat(d) / this.rem;
		if (typeof d === 'string' && d.match(/px$/)) {
			val += 'rem';
		}
		return val;
	}
})(window, window['lib'] || (window['lib'] = {}));
window.alert = function(name) {
	var iframe = document.createElement("IFRAME");
	iframe.style.display = "none";
	iframe.setAttribute("src", 'data:text/plain,');
	document.documentElement.appendChild(iframe);
	window.frames[0].window.alert(name);
	iframe.parentNode.removeChild(iframe)
};
//$('#yourElement').animateCss('bounce');
//$('#yourElement').animateCss('bounce', function() {
//  // Do somthing after animation
//});
$.fn.extend({
	animateCss: function(animationName, callback,del=0) {
		var animationEnd = (function(el) {
			var animations = {
				animation: 'animationend',
				OAnimation: 'oAnimationEnd',
				MozAnimation: 'mozAnimationEnd',
				WebkitAnimation: 'webkitAnimationEnd',
			};
			for (var t in animations) {
				if (el.style[t] !== undefined) {
					return animations[t]
				}
			}
		})(document.createElement('div'));
//		console.log(del);
		if (del>100) { var thit=this; setTimeout(function () {  thit.removeClass(animationName); }, del);  
		if (typeof callback === 'function') callback()
		}
		this.addClass(animationName).one(animationEnd, function() {
			if(del===1) $(this).removeClass(animationName);
			if (typeof callback === 'function') callback()
		});
		return this
	},
});