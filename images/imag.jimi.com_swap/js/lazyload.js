LazyLoad=function(t){function e(e,n){var s,o=t.createElement(e);for(s in n)n.hasOwnProperty(s)&&o.setAttribute(s,n[s]);return o}function n(t){var e,n,s=h[t];s&&(e=s.callback,n=s.urls,s.processCallback&&s.processCallback.call(s.context,s.obj),n.shift(),g=0,n.length||(e&&e.call(s.context,s.obj),h[t]=null,d[t].length&&o(t)))}function s(){var e=navigator.userAgent;u={async:t.createElement("script").async===!0},(u.webkit=/AppleWebKit/.test(e))||(u.ie=/MSIE/.test(e))||(u.opera=/Opera/.test(e))||(u.gecko=/Gecko/.test(e))||(u.unknown=!0)}function o(o,c,i,g,p,b){if("image"==o)return l(c,i,g,p),void 0;var v,k,m,y,j,C,w=function(){n(o)},x="css"===o,$=[];if(u||s(),c)if(c="string"==typeof c?[c]:c.concat(),x||u.async||u.gecko||u.opera)d[o].push({urls:c,callback:i,obj:g,context:p,processCallback:b});else for(v=0,k=c.length;k>v;++v)d[o].push({urls:[c[v]],callback:v===k-1?i:null,obj:g,context:p,processCallback:b});if(!h[o]&&(y=h[o]=d[o].shift())){for(f||(f=t.head||t.getElementsByTagName("head")[0]),j=y.urls,v=0,k=j.length;k>v;++v)C=j[v],x?m=u.gecko?e("style"):e("link",{href:C,rel:"stylesheet"}):(m=e("script",{src:C}),m.async=!1),m.className="lazyload",m.setAttribute("charset","utf-8"),u.ie&&!x?m.onreadystatechange=function(){/loaded|complete/.test(m.readyState)&&(m.onreadystatechange=null,w())}:x&&(u.gecko||u.webkit)?u.webkit?(y.urls[v]=m.href,r()):(m.innerHTML='@import "'+C+'";',a(m)):m.onload=m.onerror=w,$.push(m);for(v=0,k=$.length;k>v;++v)f.appendChild($[v])}}function a(t){var e;try{e=!!t.sheet.cssRules}catch(s){return g+=1,200>g?setTimeout(function(){a(t)},50):e&&n("css"),void 0}n("css")}function r(){var t,e=h.css;if(e){for(t=p.length;--t>=0;)if(p[t].href===e.urls[0]){n("css");break}g+=1,e&&(200>g?setTimeout(r,50):n("css"))}}function c(t,e,n,s){this.arr=t||[],this.obj=n,this.context=s,this.onComplete=e||function(){}}function l(t,e,n,s){var o=new c(t,e,n,s);o.load()}function i(t){var e=t&&t.length?t[0]:t;return/(\.css$)|(\.css\?.+$)/.test(e)?"css":/(\.js$)|(\.js\?.+$)/.test(e)?"js":/(\.(jpg|png|gif)$)|(\.(jpg|png|gif)\?.+$)/.test(e)?"image":""}var u,f,h={},g=0,d={css:[],js:[]},p=t.styleSheets;return c.prototype={load:function(){var t=this;if(this.arr.length>0){var e=new Image;e.onload=e.onerror=function(){e.loaded||(e.loaded=!0,t.load())},setTimeout(function(){e.loaded||(e.loaded=!0,t.load())},2e4),e.src=this.arr.shift()}else this.onComplete.call(this.context||this,this.obj)}},{loadOne:function(t,e,n,s){var a=i(t);a&&t&&o(a,t,n,null,e,s)},loadAll:function(t,e,n){function s(){if(t.length>0){var e=t.shift();l.loadOne(e,c,function(){s()},function(){this.resCount++,this.onProgress&&this.onProgress.call(c)})}else n&&n.call(c)}for(var o=0,a=0;t.length>a;a++)for(var r=0;t[a].length>r;r++)o++;var c={resCount:0,urls:t,total:o,onProgress:e},l=this;s()},image:function(t,e,n,s){o("image",t,e,n,s)},css:function(t,e,n,s,a){o("css",t,e,n,s,a)},js:function(t,e,n,s,a){o("js",t,e,n,s,a)}}}(this.document);