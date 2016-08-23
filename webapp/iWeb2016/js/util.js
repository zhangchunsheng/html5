(function(){
    window.gg= window.gg || {};
    gg.util={
        extend:function(){
            var args=Array.prototype.slice.call(arguments);
            var deep=false;
            var length=args.length;
            if(typeof args[length-1]==='boolean'){
                deep=args[length-1];
                length--;
            }
            var newObj={};
            for(var i= 0;i<length;i++){
                for(var key in args[i]){
                    var v=args[i][key];
                    if(deep && typeof v==='object'){
                        if(v instanceof Array){
                            var arr=[];
                            for(var j=0;j< v.length;j++){
                                if(typeof v[j]==='object'){
                                    arr.push(gg.extend(v[j],true));
                                }else{
                                    arr.push(v[j]);
                                }
                            }
                            v=arr;
                        }else{
                            v=gg.extend(v,true);
                        }
                    }
                    newObj[key]=v;
                }
            }
            return newObj;
        },
        copy:function(obj){
            return JSON.parse(JSON.stringify(obj));
        },
        create:function(superClass){
            if(typeof superClass==='function'){
                var args=Array.prototype.slice.call(arguments);
                function NewF(){
                    superClass.apply(this,args)
                }
                var f=function(){};
                f.prototype=superClass.prototype;
                NewF.prototype=new f();
                NewF.prototype.constructor=NewF;
                return NewF;
            }else{
                return function(){};
            }
        },
        ajax:function(config){
            var con=this.extend({
                type:'GET',
                async:false,
                dataType:'string'
            },config);
            var xhr=new XMLHttpRequest();
            xhr.open(con.type.toUpperCase(),con.url,con.async);
            xhr.onreadystatechange=function(res){
                if (xhr.readyState == 4) {
                    if(xhr.status >= 400){
                        con.error(res);
                    }else{
                        con.success(con.dataType.toUpperCase()==='JSON'?JSON.parse(res.currentTarget.responseText):res.currentTarget.responseText);
                    }
                }
            };
            xhr.send();
        },
        setCache:function(key,value,type){
            if(typeof value==='object'){
                value=JSON.stringify(value);
            }
            switch(type){
                case 'sessionStorage':sessionStorage.setItem(key,value);break;
                case 'localStorage':localStorage.setItem(key,value);break;
                default:sessionStorage.setItem(key,value);
            }
        },
        getCache:function(key){
            var value=sessionStorage.getItem(key) || localStorage.getItem(key);
            try{
                return JSON.parse(value);
            }catch(e){
                return value;
            }
        },
        clearCache:function(){
            sessionStorage.clear();
            localStorage.clear();
        },
        pageScroll:function(){
            var times=setInterval(function(){
                window.scrollBy(0,-50);
                if(document.documentElement.scrollTop==0 && document.body.scrollTop==0){
                    clearInterval(times);
                }
            },20);
        },
        getUrlParam:function(){
            var obj={};
            var paramStr=location.search.split('?')[1];
            if(paramStr){
                var params=paramStr.split('&');
                for(var i= 0,j=params.length;i<j;i++){
                    var arr=params[i].split('=');
                    obj[arr[0]]=arr[1];
                }
            }
            return obj;
        },
        formatDate:function(date,sp){
            var month=date.getMonth()+1;
            month=month<10?('0'+month):month;
            if(sp){
                return date.getFullYear()+sp+month+sp+date.getDate();
            }else{
                return ''+date.getFullYear()+month+date.getDate();
            }
        },
        browserVersion:function(){

            var u = navigator.userAgent || navigator.appVersion;
            return {//移动终端浏览器版本信息
                trident: navigator.userAgent.indexOf('Trident') > -1, //IE内核
                presto: navigator.userAgent.indexOf('Presto') > -1, //opera内核
                webKit: navigator.userAgent.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1, //火狐内核
                mobile: !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: navigator.userAgent.indexOf('iPad') > -1, //是否iPad
                webApp: navigator.userAgent.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        util:{
            splitWhite:function(str){
                return str.match(/\S+/g) || [];
            }
        }
    }
})();
