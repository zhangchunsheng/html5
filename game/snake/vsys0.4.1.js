(function () {
	window.vsys = {};
	//vsys.navi moudle
	vsys.navi = function () {
		var userAgent = navigator.userAgent.toLowerCase();
		return {
			"userAgent" : userAgent,
			"IE": /msie/.test(userAgent),
			"opera": /opera/.test(userAgent),
			"moz": /gecko/.test(userAgent),
			"IE5": /msie 5 /.test(userAgent),
			"IE55": /msie 5.5/.test(userAgent),
			"IE6": /msie 6/.test(userAgent),
			"IE7": /msie 7/.test(userAgent),
			"Safari": /safari/.test(userAgent),
			"winVista": /windows nt 6.0/.test(userAgent),
			"winXP": /windows nt 5.1/.test(userAgent),
			"win2000": /windows nt 5.0/.test(userAgent),
			"win2003": /windows nt 5.2/.test(userAgent)
		}
	}();
	
	window.findChilds = function (parentNode, text)
	{
		if(parentNode == undefined)
			parentNode = document.body;
		var childNodes = parentNode.childNodes;
		var results = [];
		if(childNodes.length > 0)
		{
			var length = childNodes.length;
			for(var i=0;i<length;++i)
			{
				switch(text.substr(0, 1))
				{
				case '.':
					if(parentNode.getElementsByClassName)
						return parentNode.getElementsByClassName(text.substr(1));
					if(childNodes[i].className == text.substr(1))
						results.push(childNodes[i]);
					break;
				case '#':
					return [document.getElementById(text.substr(1))];
				default:
					var geted =  parentNode.getElementsByTagName(text);
					if(vsys.navi.IE6 || vsys.navi.IE7)
					{
						var getedLength = geted.length;
						for(var j=0;j<getedLength;++j)
							for(var propertyName in domExtendPropertys)
								geted[j][propertyName] = domExtendPropertys[propertyName];
					}
					return geted;
				}
				results = results.concat(findChilds(childNodes[i], text));	
			}
		}
		return results;
	};
	
	window.g = function (text)
	{
		var values = text.trim().split(" ");
		var length = values.length;
		if(length == 1)
			switch(values[0].substr(0, 1))
			{
			case "#":
				return document.getElementById(values[0].substr(1));
				break;
			case ".":
				if(document.getElementsByClassName)
					return document.getElementsByClassName(values[0].substr(1));
				break;
			default :
				return document.getElementsByTagName(values[0]);
			}
		var parentNodes = [document.body];
		for(var i = 0; i < length; ++i)
		{
			var jlength = parentNodes.length;
			var results = [];
			var tmpValue = values[i].trim();
			if(tmpValue.length <= 0)
				continue;
			for(var j=0;j<jlength;++j)
			{
				var result = findChilds(parentNodes[j], values[i].trim());
				var rlength = result.length;
				for (var k = 0; k < rlength; ++k)
					results.push(result[k]);
			}
			if(results == undefined || results.length <= 0)
				return undefined;
			if (i == length - 1) 
			{
				if (values[i].substr(0, 1) == "#")
					return results[0];
				return results;
			}
			parentNodes = results;
		}
	};
	
	window.fade = function (obj, startAlpha, overAlpha, step, time, callback) {
		vsys.ui.effect.fade(obj, startAlpha, overAlpha, step, time, callback);
	};
	
	window.zooming = function(obj, startSize, overSize, speed, callback){
		ui.effect.zooming(this, startSize, overSize, speed, callback);
	};
	
	window.getPos = function (obj)
	{
		var pos = {
			"x" : 0,
			"y" : 0,
			"width" : obj.offsetWidth,
			"height" : obj.offsetHeight,
			"clientHeight" : obj.clientHeight,
			"clientWidth" : obj.clientWidth
		};
		var offsetParent = obj;
		while(offsetParent)
		{
			pos.x += offsetParent.offsetLeft;
			pos.y += offsetParent.offsetTop;
			offsetParent = offsetParent.offsetParent;
		}
		return pos;
	};
	
	window.intersect = function (e1, e2, level) {
		var e1Pos = getPos(e1);
		var e2Pos = getPos(e2);
		var result = true;
		var width = 0, height = 0;
		var maxWidth = 0, maxHeight = 0;
		if(e1Pos.width >= e2Pos.width)
		{
			//e1比e2宽
			width = e2Pos.width;
			maxWidth = e2Pos.width;
			if(e2Pos.x < e1Pos.x) 
			{
				width = e2Pos.x + e2Pos.width - e1Pos.x;
				result = false;
			}
			if(( e2Pos.x + e2Pos.width ) > ( e1Pos.x + e1Pos.width ))
			{
				width = e1Pos.x + e1Pos.width - e2Pos.x;
				x2 = e1Pos.width + e1Pos.x - e2Pos.x;
				result = false;
			}
		}else 
		{
			//e2比e1宽
			width = e1Pos.width;
			maxWidth = e1Pos.width;
			if(e1Pos.x < e2Pos.x)
			{
				width = e1Pos.x + e1Pos.width - e2Pos.x;
				result = false;
			}
			if(( e1Pos.x + e1Pos.width ) > ( e2Pos.x + e2Pos.width ))
			{
				width = e2Pos.x + e2Pos.width - e1Pos.x;
				result = false;
			}
		}
		//e1比e2高
		if(e1Pos.height >= e2Pos.height)
		{
			height = e2Pos.height;
			maxHeight = e2Pos.height;
			if(e2Pos.y < e1Pos.y)
			{
				height = e2Pos.y + e2Pos.height - e1Pos.y;
				result = false;
			}
			if(( e2Pos.y + e2Pos.height ) > ( e1Pos.y + e1Pos.height ))
			{
				height = e1Pos.y + e1Pos.height - e2Pos.y;
				result = false;
			}
		}else 
		{
			//e2比e1高
			height = e1Pos.height;
			maxHeight = e1Pos.height;
			if(e1Pos.y < e2Pos.y)
			{
				height = e1Pos.y + e1Pos.height - e2Pos.y;
				result = false;
			}
			if(( e1Pos.y + e1Pos.height ) > ( e2Pos.y + e2Pos.height ))
			{
				height = e2Pos.y + e2Pos.height - e1Pos.y;
				result = false;
			}
		}
		if(level)
			if(isNaN(level) == false)
			{
				if(width > 0 & height > 0)
				{
					if(( width * height ) / ( maxWidth + maxHeight ) >= level)
					{
						return true;
					}
					else
					{
						return false;
					}	
				}
				else
				{
					return false;
				}
			}
		return result;
	};

	window.doModal = function (content, config)
	{
		return ui.window.dialog.doModal(content, config);
	};
	
	window.clearChildNodes = function (obj)
	{
		if (obj) 
		{
			var childNodes = obj.childNodes;
			if(childNodes)
			{
				var length = childNodes.length;
				for (var i = length - 1; i >= 0; --i) 
					obj.removeChild(childNodes[i]);
			}
		}
	};
	
	window.c = function (tagName) {
		return document.createElement(tagName);
	};
	
	window.cdf = function () {
		return document.createDocumentFragment();
	};
	
	window.ctn = function (text) {
		return document.createTextNode(text);
	};
	
	String.prototype.trim = function() {
		  return this.replace(/^\s+|\s+$/g, '');
	};
	
	window.extendDom = function(name, fn)
	{
        if(vsys.navi.IE) 
		{
            var _createElement = document.createElement;
            document.createElement = function(tag)
			{
                var elem = _createElement(tag);
                elem[name] = fn;
                return elem;
            };
            var _getElementById = document.getElementById;
            document.getElementById = function(id)
			{
                var elem = _getElementById(id);
                elem[name] = fn;
                return elem;
            };
            var _getElementsByTagName = document.getElementsByTagName;
            document.getElementsByTagName = function(tag)
			{
                var arr = _getElementsByTagName(tag);
				var length = arr.length;
                for (var i = 0; i < length; ++i) 
                    arr[i][name] = fn;
                return arr;
            };
        }
		else
		{
			HTMLElement.prototype[name] = fn;
		}
    };
	
	//dom对象扩展属性列表。
	var domExtendPropertys = {
		"fade" : function (startAlpha, overAlpha, step, time, callback) {
			return ui.effect.fade(this, startAlpha, overAlpha, step, time, callback);
		},
		"zooming" : function(startSize, overSize, speed, callback){
			return ui.effect.zooming(this, startSize, overSize, speed, callback);
		},
		"doModal" : function (config) {
			return ui.window.dialog.doModal(this, config);
		},
		"addListener" : function (eventName, callback, onCapture) {
			return event.addListener(this, eventName, callback, onCapture);
		},
		"setDraggable" : function () {
			return event.setDraggable(this);
		},
		"dropDraggable" : function () {
			return event.dropDraggable(this);
		},
		"removeListener" : function (eventName, callback, onCapture) {
			return event.removeListener(this, eventName, callback, onCapture);
		},
		"intersect" : function (element, level) {
			return intersect(this, element, level);
		},
		"propagation" : function (eventName, propagation) {
			return event.propagation(this, eventName, propagation);
		},
		"slide" : function (speed, targetSize, callback) {
			return ui.effect.slide(this, speed, targetSize, callback);
		}
	};
	
	//扩展dom对象，ie6从document.getElementById等方法扩展。
	for(var propertyName in domExtendPropertys)
		extendDom(propertyName, domExtendPropertys[propertyName]);
	
	//vsys event module
	vsys.event = {};
	var event = vsys.event;
	event.addGlobalListener = function (eventName, callback)
	{
		if(window.addEventListener)
			window.addEventListener(eventName, callback, false);
		else
		{
			window.attachEvent("on" + eventName, callback);
		}	
	};
	
	event.addListener = function (obj, eventName, callback, onCapture)
	{
		if(obj.attachEvent)
			obj.attachEvent("on" + eventName, callback); 
		else if(obj.addEventListener)
			obj.addEventListener(eventName, callback, onCapture);
		return obj;
	};
	
	event.removeListener = function (obj, eventName, callBackHandle, onCapture)
	{
		if(obj.detachEvent)
			obj.detachEvent("on" + eventName, callBackHandle);
		else if(obj.removeEventListener)
			obj.removeEventListener(eventName, callBackHandle, onCapture);
		return obj;
	};
	
	event.propagation = function (obj, eventName, propagation)
	{
		if(propagation)
		{
			if(obj.stopCallBackHandle)
			{
				obj.removeListener(eventName, obj.stopCallBackHandle, true);
				delete obj.stopCallBackHandle;
			}
				
			return obj;
		}
		obj.stopCallBackHandle = function (e) {
			var event = e || window.event;
			if(event.stopPropagation)
				event.stopPropagation();
			else
			{
				event.cancelBubble = true;
			}	
		};
		event.addListener(obj, eventName, obj.stopCallBackHandle, true);
		return obj;
	};
	
	event.addListener(document.documentElement, "mouseup", function () {
		var target = document.dragTarget;
		if(target)
		{
			if(target.onDragOver)
				target.onDragOver.apply(target);
			document.dragTarget = null;
		}
	}, true);
	
	event.addListener(document.documentElement, "mousemove", function (evt) {
		var e = window.event || evt;
		if(document.dragTarget)
		{
			var target = document.dragTarget;
			if(target.onDrag)
				if(target.onDrag.apply(target) == false)
					return false;
			target.style.left = e.clientX - target.offsetX + "px";
			target.style.top = e.clientY - target.offsetY + "px";
			if(target.dragScale)
			{
				var pos = getPos(target.dragScale);
				if(target.dragScale == document.documentElement)
				{
					pos.width = target.dragScale.clientWidth;
					pos.height = target.dragScale.clientHeight;
				}
				if( target.offsetTop <= pos.y )
					target.style.top = pos.y + 1 + "px";
				if( target.offsetLeft <= pos.x )
					target.style.left = pos.x + 1 + "px";
				if(( target.offsetLeft + target.offsetWidth ) >= ( pos.x + pos.width ))
					target.style.left = pos.x + pos.width - 1 - target.offsetWidth + "px";
				if(( target.offsetTop + target.offsetHeight ) >= ( pos.y + pos.height ))
					target.style.top = pos.y+ pos.height- 1 - target.offsetHeight + "px";
			}
		}
	}, true);
	
	event.wnds = [];
	
	event.removeWnd = function (obj) {
		var startIndex = obj.style.zIndex - 1;
		event.wnds.splice(startIndex, 1);
		var length = event.wnds.length;
		for(var i=startIndex;i<length;++i)
			event.wnds[i].style.zIndex = i + 1;
	};
	
	event.setTop = function (obj) {
		var objIndex = obj.style.zIndex - 1;
		event.removeWnd(obj);
		var newLength = event.wnds.push(obj);
		obj.style.zIndex = newLength;
	};
	
	event.setDraggable = function (obj)
	{
		var pos = getPos(obj);
		obj.style.position = "absolute";
		obj.style.top = pos.y + "px";
		obj.style.left = pos.x + "px";
		function onmousedown (evt) {
			var e = evt || window.event;
			if(obj.dragHotspot)
				if(( e.srcElement || e.target ) != obj.dragHotspot)
					return false;
			if(obj.onDragStart) 
				if (obj.onDragStart.apply(obj) == false) 
					return false;
			event.setTop(obj);
			obj.offsetX = e.clientX - obj.offsetLeft;
			obj.offsetY = e.clientY - obj.offsetTop;
			document.dragTarget = obj;
		}
		obj.dragMouseDownHandle = onmousedown;
		event.addListener(obj, "mousedown", onmousedown, true);
		var newLength = event.wnds.push(obj);
		obj.style.zIndex = newLength;
		return obj;
	};
	
	event.dropDraggable = function (obj)
	{
		obj.removeListener("mousedown", obj.dragMouseDownHandle, true);
		event.removeWnd(obj);
		return obj;
	};
	
	//disk module
	vsys.disk = {};
	vsys.disk.remote = {
			createRequest: function() {
		    	var request = null;
			    try {
			        request = new XMLHttpRequest();
			    } catch(trymicrosoft) {
			        try {
			            request = new ActiveXObject("Msxml2.XMLHTTP");
			        } catch(othermicrosoft) {        
			            try {
			                request = ActiveXObject("Microsoft.XMLHTTP");
			            } catch(failed) {}
			        }
			    };
			    if (request == null) {
			
			    } else {
			        return request;
			    }
			},
			request: function(url, option) {
				option = option || {};
				option.onComplete = option.onComplete? option.onComplete: function() {};
				option.onBegin = option.onBegin ? option.onBegin : function () {};
				option.onException = option.onException?option.onException: function() {};
				option.returnType = option.returnType?option.returnType: "json";
				option.method = option.method ?option.method : "post";
				option.data = option.data?option.data: {};
				this.loadData(url, option);
			},
			loadData: function(url, option) {
			    var request = this.createRequest();
			    tmpArr = [];
			    var _url = url;
			    _url.setParam = function(ref, value){
			    	if(typeof(ref)=="undefined" || ref.length==0){
			    		return this;
			    	}
			    	if(this.indexOf('?')<0){
			    		return this.concat("?" + ref + "=" + value);
			    	}else{
			    		return this.concat("&" + ref + "=" + value);
			    	}
			    };
			    if (option.post) {
			    	option.method = "post";
			        for (var postkey in option.post) {
			            var postvalue = option.post[postkey];
			            if (postvalue != null) { 
			                tmpArr.push(postkey + '=' + (typeof postvalue == "string" ? encodeURIComponent(postvalue) : postvalue));
			            }
			        }
			    }
			    var sParameter = tmpArr.join("&") || "";
			    if (option.get) {
			    	option.method = "get";
			        for (var key in option.get) {
			        	var getValue = option.get[key];
			        	if(getValue != null)
			        		_url.setParam(key, (typeof getValue == "string" ? encodeURIComponent(getValue) : getValue));
			        }
			    }
			    request.onreadystatechange = function() {
			    	switch(request.readyState)
			    	{
			    	case 1:
			    		if(request.begin == undefined)
			    		{
			    			option.onBegin();
				    		request.begin = true;
			    		}
			    		break;
			    	case 4:
			    		var response;
			            var type = option.returnType;
			            try {
			                switch (type) {
			                case "txt":
			                    response = request.responseText;
			                    break;
			                case "xml":
			                    if (Core.Base.detect.IE) {
			                        response = request.responseXML;
			                    } else {
			                        var Dparser = new DOMParser();
			                        response = Dparser.parseFromString(request.responseText, "text/xml");
			                    }
			                    break;
			                case "json":
			                    response = eval("(" + request.responseText + ")");
			                    break;
			                }
			                option.onComplete(response);
			            } catch(e) {
			                option.onException(e.message, _url);
			                return false;
			            }
			    		break;
			    	}	
			    };
			    try {
			        if (option.method == "post") 
			        {
			            request.open("POST", _url, true);
			            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			            request.send(sParameter);
			        } else {
			            request.open("GET", _url, true);
			            request.send(null);
			        }
			    } catch(e) {
			        option.onException(e.message, _url);
			        return false;
			    }
			}
		};
	window.remote = vsys.disk.remote;
	//memory module
	vsys.mem = {};
	window.mem = vsys.mem;
	vsys.mem.phymem = new Array();
	vsys.mem.phymem.mapping = {};
	vsys.mem.save = function (obj) {	
		vsys.mem.phymem.push(obj);
		return vsys.mem.phymem.length - 1 + "_" + Object.prototype.toString.apply(obj) + "_" + new Date().getTime();
	};
	
	vsys.mem.mapping = function (key, data)
	{
		mem.phymem.mapping[key] = mem.save(data);
	};
	
	vsys.mem.mapping.get = function (key)
	{
		return mem.get(mem.phymem.mapping[key]);
	};
	
	vsys.mem.get = function (handle) {
		var handle = parseInt(handle);
		if(isNaN(handle))
			return undefined;
		if(handle >= 0 && handle < vsys.mem.phymem.length)
			return vsys.mem.phymem[handle];
		return undefined;
	};
	
	vsys.mem.unmap = function (key)
	{
		var handle = mem.phymem.mapping[key];
		if(handle != undefined)
		{
			mem.del(handle);
			mem.phymem.mapping[key] = undefined;
		}
	};
	
	vsys.mem.del = function (handle) {
		if(handle != undefined)
		{
			handle = parseInt(handle);
			if(isNaN(handle))
				return;
			if(handle >= 0 && handle < vsys.mem.phymem.length)
				vsys.mem.phymem[handle] = null;
		}
	};
	
	//vsys util
	vsys.util = {};
	window.util = vsys.util;
	//util PageInfo
	util.PageInfo = function (pageSize, recordCount) 
	{
		this.recordCount = recordCount;
		this.firstResult = 0;
		this.pageSize = pageSize;
		this.currentPage = 1;
		this.maxPage = recordCount / pageSize;
		var parsedMaxPage = parseInt(this.maxPage);
		this.maxPage = (parsedMaxPage == this.maxPage) ? this.maxPage : parsedMaxPage + 1;
	};
	
	util.PageInfo.prototype.reset = function (pageSize, recordCount) 
	{
		this.recordCount = recordCount;
		this.firstResult = 0;
		this.pageSize = pageSize;
		this.currentPage = 1;
		this.maxPage = recordCount / pageSize;
		var parsedMaxPage = parseInt(this.maxPage);
		this.maxPage = (parsedMaxPage == this.maxPage) ? this.maxPage : parsedMaxPage + 1;
	};
	
	util.PageInfo.prototype.nextPage = function () {
		if(this.currentPage < this.maxPage)
		{
			this.firstResult += this.pageSize;
			++this.currentPage;
			return true;
		}
		return false;
	};
	
	util.PageInfo.prototype.prePage = function () {
		if(this.currentPage > 1)
		{
			this.firstResult -= this.pageSize;
			--this.currentPage;
			return true;
		}
		return false;
	};
	
	util.PageInfo.prototype.setPage = function (page) {
		if(page >= 1 && page <= this.maxPage)
		{
			this.currentPage = page;
			this.firstResult = (this.currentPage -1) * this.pageSize;
			return true;
		}
		return false;
	};
	
	util.PageInfo.prototype.firstPage = function () {
		return this.setPage(1);
	};
	
	util.PageInfo.prototype.lastPage = function () {
		return this.setPage(this.maxPage);
	};
	
	//util.history
	var history = util.history = {};
	history.iframe;
	history.flag = false;
	history.hash;
	
	history.record = function () 
	{
		if (IE)
		{
			if (history.iframe == undefined) 
			{
				history.iframe = c("iframe");
				history.iframe.height = "0px";
				history.iframe.frameborder = "no";
				history.iframe.scrolling = "no";
				history.iframe.id = "_history_hash";
				document.documentElement.appendChild(history.iframe);
				history.iframe = history.iframe.contentWindow.document;
				history.hash = "";
			}
			history.iframe.open();
			history.iframe.close();
			history.hash += "1";
			history.iframe.location.hash = history.hash;
		}
		mem.mapping("_" + location.hash + "_hash", document.body.cloneNode(true));
		history.flag = true;
		if (IE) 
			location.hash = history.iframe.location.hash;
		else 
		{
			location.hash += "1";
		}
		if(history.checkHash == undefined)
		{
			var oldHash = location.hash; 
			history.checkHash = setInterval(function () {
				if(oldHash != location.hash)
				{
					if (history.flag)
					{
						mem.mapping("_" + location.hash + "_hash", document.body.cloneNode(true));
						history.flag = false;
					}
					else 
					{
						oldHash = location.hash;
						history.locate();
					}
				}
			}, 100);
		}
	};
	
	history.locate = function ()
	{
		var node = mem.mapping.get("_" + location.hash + "_hash");
		if(node)
		{
			if (document.body) 
			{
				clearChildNodes(document.body);
				if (document.body.parentNode) 
					document.body.parentNode.removeChild(document.body);
			}
			document.documentElement.appendChild(node.cloneNode(true));
		}
	};
	
	//util LoadBar
	util.LoadingBar = function (params)
	{
		if(!params)
			return;
		this.loadingBar = c("lable");
		this.loadingBar.className = "vsys_loadingBar";
		this.loadingBar.innerHTML = params.text ? params.text : "";
		this.loadingBar.style.fontSize = "12px";
		this.loadingBar.style.display = "none";
		this.loadingBar.style.color = "#000000";
		this.loadingBar.loads = 0;
		this.loadingBar.oldHTML = this.loadingBar.innerHTML;
		this.loadingBar.style.overflow = "hidden";
		this.loadingBar.colorFlag = 0;
		this.followMouse = !params.followMouse ? false : params.followMouse;
		this.mousemove;
		if(params.followMouse)
		{
			var host = this;
			this.loadingBar.style.position = "absolute";
			document.body.appendChild(this.loadingBar);
			this.mousemove = function (event) {
				host.loadingBar.style.left = event.clientX + 16 + document.documentElement.scrollLeft + "px";
				host.loadingBar.style.top = event.clientY + document.documentElement.scrollTop + "px";
			};
			if(window.addEventListener)
				window.addEventListener("mousemove", this.mousemove, false);
			else
			{
				document.body.attachEvent("onmousemove", this.mousemove);
			}
		}
		else if(params.pnode)
			params.pnode.appendChild(this.loadingBar);
	};
	
	util.LoadingBar.prototype.loading = function () {
		var loadingBar = this.loadingBar;
		clearChildNodes(loadingBar);
		loadingBar.innerHTML = loadingBar.oldHTML;
		if(this.followMouse == false)
		{
			if(this.loadingBar.intervalId == undefined)
				this.loadingBar.intervalId = window.setInterval(function () {
					switch(loadingBar.colorFlag)
					{
					case 0:
						loadingBar.style.color = "#ff0000";
						loadingBar.colorFlag = 1;
						break;
					case 1:
						loadingBar.style.color = "#000000";
						loadingBar.colorFlag = 0;
						break;
					}
				}, 200);
		}
		else if(this.followMouse)
		{
			document.body.removeChild(this.loadingBar);
			document.body.appendChild(this.loadingBar);
		}
		this.loadingBar.style.display = "";
		this.loadingBar.loads += 1;
	};
	
	util.LoadingBar.prototype.loadComplete = function () {
		if((this.loadingBar.loads -= 1) <= 0)
		{
			var intervalId = this.loadingBar.intervalId;
			if(intervalId != undefined)
			{
				window.clearInterval(intervalId);
				this.loadingBar.intervalId = undefined;
			}
			this.loadingBar.style.display = "none";
		}
	};
	
	util.LoadingBar.prototype.clearProgress = function (tip, timeout) {
		this.loadingBar.loads = 0;
		var intervalId = this.loadingBar.intervalId;
		if(intervalId != undefined)
		{
			window.clearInterval(intervalId);
			this.loadingBar.intervalId = undefined;
		}
		if(tip != undefined && timeout != undefined)
		{
			var loadingBar = this.loadingBar;
			if(loadingBar.tipTimoutId)
			{
				window.clearTimeout(loadingBar.tipTimeoutId);
				loadingBar.tipTimoutId = undefined;
			}
			loadingBar.style.display = "";
			loadingBar.innerHTML = tip;
			loadingBar.style.color = "#000000";
			loadingBar.tipTimoutId = window.setTimeout(function () {
				loadingBar.innerHTML = loadingBar.oldHTML;
				loadingBar.style.display = "none";
				loadingBar.tipTimoutId = undefined;
			}, timeout);
		}
		else
		{
			this.loadingBar.style.display = "none";
		}
	};
	
	//vsys view module
	vsys.view = {};
	window.view = vsys.view;
	vsys.view.paging = function (pageSize, recordCount, updateMethod)
	{
		if(Object.prototype.toString.apply(updateMethod) == "[object Function]")
		{
			var pageInfo = new util.PageInfo(pageSize, recordCount);
			var nextPage = pageInfo.nextPage;
			pageInfo.nextPage = undefined;
			var prePage = pageInfo.prePage;
			pageInfo.prePage = undefined;
			pageInfo.firstPage = undefined;
			var setPage = pageInfo.setPage;
			pageInfo.setPage = undefined;
			var pages = new Array();
			var div = c("div");
			var renderPageFromBuffer = function (buffer) 
			{
				clearChildNodes(div);
				var length = buffer.length;
				var fragment = cdf();
				for(var i=0;i<length;++i)
					fragment.appendChild(buffer[i]);
				div.appendChild(fragment);
			};
			var handle = {
					"pageInfo" : pageInfo,
					"nextPage" : function () {
						if(nextPage.apply(pageInfo))
							renderingPage();
					},
					"prePage" : function () {
						if(prePage.apply(pageInfo))
							renderingPage();
					},
					"firstPage" : function () {
						if(setPage.call(pageInfo, 1))
							renderingPage();
					},
					"lastPage" : function () {
						if(setPage.call(pageInfo, pageInfo.maxPage))
							renderingPage();
					},
					"setPage" : function (page) {
						var result = setPage.call(pageInfo, page);
						if(result)
							renderingPage();
						return result;
					},
					"saveToBuffer" : function () {
						var fragment = cdf();
						var childNodes = new Array();
						var divChildNodes = div.childNodes;
						var length = divChildNodes.length;
						for(var i=0;i<length;++i)
							childNodes.push(divChildNodes[i]);
						pages[pageInfo.currentPage] = childNodes;
					},
					"clearBuffer" : function () {
						pages = new Array();
					},
					"canvas" : div
			};
			var renderingPage = function ()
			{
				var buffer = pages[pageInfo.currentPage];
				if(buffer == undefined)
					updateMethod.apply(handle);
				else
				{
					renderPageFromBuffer(buffer);
				}	
			};
			return handle;
		}
		return undefined;
	};
	
	//vsys ui moudle
	vsys.ui = {};
	window.ui = vsys.ui;
	ui.window = {};
	ui.window.dialog = {};
	ui.window.dialog.modelCounter = 0;
	ui.window.dialog.doModal = function (content, config)
	{
		var contentPos = getPos(content);
		content.style.display = "inline-block";
		if(vsys.navi.IE6)
			content.style.display = "inline";
		var contentWidth = contentPos.width;
		var contentHeight = contentPos.height;
		content.style.display = "";
		var resize = function (content, mainDiv, maskDiv) {
			var bodyHeight = document.body.scrollHeight;
			var bodyWidth = document.body.scrollWidth;		
			var docHeight = document.documentElement.clientHeight;
			var docWidth = document.documentElement.clientWidth;
			maskDiv.style.height = bodyHeight > docHeight ? bodyHeight + "px" : docHeight + "px";
			maskDiv.style.width = bodyWidth > docWidth  ? bodyWidth  + "px" : docWidth  + "px";
			var screenHeight =  docHeight;
			var screenWidth = docWidth;
			var divHeight = contentHeight;
			var divWidth = contentWidth;
			if(config)
			{
				if(config.x)
					mainDiv.style.left = config.x + "px";
				else
				{
					mainDiv.style.left = (screenWidth >> 1) - (divWidth >> 1)  + "px";
				}
			}
			else
			{
				mainDiv.style.left = (screenWidth >> 1) - (divWidth >> 1)  + "px";
			}
			if(config)
			{
				if(config.y)
					mainDiv.style.top = config.y + "px";
				else
				{
					mainDiv.style.top = (screenHeight >> 1) - (divHeight >> 1) + "px";
				}
			}
			else
			{
				mainDiv.style.top = (screenHeight >> 1) - (divHeight >> 1) + "px";
			}	
		};
		var mainDiv = c("div");
		mainDiv.style.border = "1px solid #cccccc";
		mainDiv.className = "vsys_modal_content";
		var maskDiv = c("div");
		mainDiv.style.position = "absolute";
		mainDiv.style.display = "inline-block";
		var exitDiv = c("div");
		var label = c("label");
		label.innerHTML = "关闭";
		exitDiv.appendChild(label);
		exitDiv.className = "vsys_modal_topBar";
		exitDiv.style.textAlign = "right";
		label.style.cursor = "pointer";
		exitDiv.style.borderBottom = "1px solid #cccccc";
		exitDiv.style.backgroundColor = "white";
		label.style.marginRight = "4px";
		function close() {
			document.body.removeChild(mainDiv);
			document.body.removeChild(maskDiv);
		};
		label.onclick = close;
		exitDiv.style.fontSize = "12px";
		mainDiv.appendChild(exitDiv);
		mainDiv.appendChild(content);
		maskDiv.style.position = "absolute";
		maskDiv.style.left = "0px";
		maskDiv.style.top = "0px";
		resize(content, mainDiv, maskDiv);
		if(window.addEventListener)
			window.addEventListener("resize", function () {resize(content, mainDiv, maskDiv);}, false);
		else
		{
			window.attachEvent("onresize",  function () {resize(content, mainDiv, maskDiv);});
		}
		document.body.appendChild(maskDiv);
		document.body.appendChild(mainDiv);
		maskDiv.style.backgroundColor = "black";
		maskDiv.style.filter="Alpha(Opacity=5)";
		maskDiv.style.opacity = "0.05";
		content["closer"] = close;
		content["cleanStyle"] = function () {
				mainDiv.style.border = "";
				exitDiv.style.backgroundColor = "";
				exitDiv.style.border = "";
			};
		content["window"] = mainDiv;
		content["mask"] = maskDiv;
		return content;
	};
	
	ui.effect = {};
	ui.effect.fade = function (obj, startAlpha, overAlpha, step, time, callback) {
		//var pos = getPos(obj);
		//obj.style.width = pos.clientWidth+ "px";
		//obj.style.height = pos.clientHeight + "px";
		if(vsys.navi.IE)
			obj.style.filter="Alpha(Opacity=" + startAlpha + ")";
		else
		{
			obj.style.opacity = startAlpha / 100;
		}	
		var differ = Math.abs(overAlpha - startAlpha);
		var curAlpha = startAlpha;
		step = ( startAlpha > overAlpha ) ? step * -1 : step;
		var intervalId = setInterval(function(){
			if(vsys.navi.IE)
				obj.style.filter="Alpha(Opacity=" + (curAlpha += step) + ")";
			else
			{
				obj.style.opacity = (curAlpha += step) / 100;
			}
			if ((step >= 0 && curAlpha >= overAlpha) || (step <= 0 && curAlpha <= overAlpha)) 
			{
				clearInterval(intervalId);
				if(callback)
					callback();
			}
		}, ( time / differ ) * Math.abs(step));
		return obj;
	};
	
	ui.effect.zooming = function (obj, startSize, overSize, speed, callback) {
		if(overSize == undefined || overSize.width == undefined || overSize.height == undefined || overSize == 0)
		{
			overSize = {
				"width" : 0,
				"height" : 0
			};
		}
		if(( startSize == null || startSize.width == undefined || startSize.height == undefined ) && startSize != 0)
		{
			var pos = getPos(obj);
			startSize = {
				"width" : pos.width,
				"height" : pos.height
			};
		}
		if(startSize == 0)
			startSize = {
					"width" : 0,
					"height" : 0
				};
		var wdiffer = overSize.width - startSize.width;
		var hdiffer = overSize.height - startSize.height;
		var xd = wdiffer / speed;
		var yd = hdiffer / speed;
		var curWidth = startSize.width;
		var curHeight = startSize.height;
		obj.style.width = curWidth + "px";
		obj.style.height = curHeight + "px";
		var intervalId = setInterval(function(){
			var exitFlag = 0;
			if((xd > 0 && curWidth < overSize.width) || (xd < 0 && curWidth > overSize.width))
			{
				obj.style.width = curWidth + "px";
				curWidth += xd;
			}
			else
			{
				++ exitFlag;
			}
			if((yd > 0 && curHeight < overSize.height) || (yd < 0 && curHeight > overSize.height))
			{
				obj.style.height = curHeight + "px";
				curHeight += yd;
			}
			else
			{
				++ exitFlag;
			}
			if(exitFlag == 2)
			{
				obj.style.width = overSize.width + "px";
				obj.style.height = overSize.height + "px";
				clearInterval(intervalId);
				if(callback)
					callback();
			}
		}, 10);
		return obj;
	};
	
	ui.effect.slide = function (obj, speed, targetSize, callback)
	{
		var pos = getPos(obj);
		obj.style.overflow = "hidden";
		var hasTargetSizeHeight = true, hasTargetSizeWidth = true;
		if(targetSize)
		{
			if(targetSize.width == undefined)
			{
				hasTargetSizeWidth = false;
				targetSize.width = pos.clientWidth;
			}
			if(targetSize.height == undefined)
			{
				hasTargetSizeHeight = false;
				targetSize.height = pos.clientHeight;
			}
			if(targetSize.width == "tomax")
			{
				targetSize.width = pos.clientWidth;
				pos.clientWidth = 0;
				obj.style.width = 0;
			}
			if(targetSize.height == "tomax")
			{
				targetSize.height = pos.clientHeight;
				pos.clientHeight = 0;
				obj.style.height = 0;
			}
		}
		if(speed)
		{
			if(speed.xp == undefined)
				speed.xp = 0;
			if(speed.yp == undefined)
				speed.yp = 0;
		}
		var curWidth = pos.clientWidth, curHeight = pos.clientHeight;
		var intervalId = setInterval(function () {
			var exit = 0;
			if(( speed.xp > 0 && targetSize.width > curWidth )
				|| ( speed.xp < 0 && targetSize.width < curWidth ))
			{
				obj.style.width = curWidth + "px";
				curWidth += speed.xp;
			}
			else
			{
				++ exit;
			}
			if(( speed.yp > 0 && targetSize.height > curHeight )
				|| ( speed.yp < 0 && targetSize.height < curHeight ))
			{
				obj.style.height = curHeight + "px";
				curHeight += speed.yp;
			}
			else
			{
				++ exit;
			}
			if(exit == 2)
			{
				if(hasTargetSizeHeight)
					obj.style.height = targetSize.height + "px";
				if(hasTargetSizeWidth)
					obj.style.width = targetSize.width + "px";
				clearInterval(intervalId);
				if(callback)
					callback();
				return;
			}
		}, 10);
		return obj;
	};
})();
