!function() {
    function e(e) {
        e === o && (o.style.width = window.innerWidth + "px", o.style.zIndex = "1"),
        e.style.display = "block"
    }
    function n(e) {
        e === o && (o.style.width = "1px", o.style.height = "1px", o.style.zIndex = "-1"),
        e.style.display = "none"
    }
    function t() {
        function t() {
            o.pause(),
            o.removeEventListener("playing", t)
        }
        function i() {
//            n(s),
//            e(l),
            p && (clearTimeout(p), p = null)
        }
        function a(e) {
            var n = e.buffered.length > 0 ? e.buffered.end(0) : 0;
            return n = parseInt(1e3 * n + 1) / 1e3
        }
        function d() {
            var e = a(o),
            n = o.duration; + new Date - c > u || e >= n || y === e ? i() : (y = e, p = setTimeout(function() {
                d()
            },
            500))
        }
        o.src = r;
        var c = +new Date,
        u = 4e3,
        p = null;
//		o.controls = 'controls';
//		o.controlsList='nofullscreen nodownload noremote footbar';
        o.play(),
        o.addEventListener("playing", t);
        var y = -1;
        d()
    }
    var i = document.getElementById.bind(document),
    o = i("video"),
    s = i("loading"),
    a = i("content"),
    l = i("play"),
    r = "./movie06043.mp4";
    if ( - 1 !== navigator.userAgent.indexOf("MiuiBrowser")) t(),
    o.className = "miui";
    else {
        var c = new XMLHttpRequest;
        c.open("GET", r, !0),
        c.responseType = "blob",
        c.onload = function() {
            if (200 === this.status && "video/mp4" === this.response.type) {
                var i = this.response,
                a = (window.URL || window.webkitURL || window || {}).createObjectURL(i);
//                n(s),
//                e(l),
//                o.controls='controls',
//				o.controlsList='nofullscreen nodownload noremote footbar',
                o.src = a
            } else t()
        },
        c.onerror = function(e) {
            console.log(e),
            t()
        },
		c.onprogress=function(e)
        {
             if (e.lengthComputable)
             { 
			 	var vwidth=Math.round(e.loaded / e.total * 100) + "%";
			$('.l-bg-w').css({ width:vwidth });
			$('.l-bg-3').html(vwidth);  
			if (e.loaded / e.total==1 ) {
			$('.g-1').addClass('block');
			if (sp1) {
//					$('.l1-btn').animateCss('fadeInUp');
$('.l-bg-4').remove();
$('.loading').animateCss('fadeOut', function() {
$('.loading').removeClass('block');
setTimeout(function () {  $('.g1-btn').animateCss('fadeInUp'); }, 500); 
},1);
			}else {
				sp2=1;
			}
			}
             } 
        },
        c.send()
    }
	$("#play").on('click', function(e){ 
	$("#play").css({ backgroundColor: '#f92929'});
//	$("#play").animateCss('btnbackground', function() {
//    
//	},1);
	setTimeout(function () { 
	 $(".g1-btn").addClass('none');
	 o.play();
	 }, 1000); 
//$.get("http://a3.digoo.cn/06/js/js.php", {v: "2"} );
	});
//    l.addEventListener("click",
//    function() {
//        n(document.getElementsByClassName("all")[0]),
//        o.play()
//    }),
    o.addEventListener("timeupdate",
    function() { ! o.isPlayed && this.currentTime > .1 && (e(o), o.isPlayed = !0)
    }),
    o.addEventListener("ended",
    function(){
$('.g-1').removeClass('block');
$(".g-9").addClass('block');
//        n(o),
//    a.style.opacity = "1"
//a.style.display = "block"
    })
} ();