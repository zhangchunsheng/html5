(function(){
	var obIdarr = {};
	var keyList = [];
	var ID_SEQ_KEY = "ID_SEQ_KEY";

	var get = function (key) {
		var value = localStorage.getItem(key);
		if(value == 'null' || value == null) return null;
		return JSON.decode(value);
	}
	var  set = function (key ,data) {
		localStorage.setItem(key, JSON.encode(data));
	}
	window.storage = {
		get : function (key) {
			var data = get(key);
			return data ? data.data : null;
		},
        set : function (key ,data) {
			keyList.push(key);
			var id = get(ID_SEQ_KEY) || 1 ;
			var newData = {id : ++id ,data : data};
			set(ID_SEQ_KEY,id);
			//if(key=="WinKey001"){alert(key+JSON.encode(newData))}
			localStorage.setItem(key, JSON.encode(newData));
		},
        remove : function (key) {
			localStorage.removeItem(key);
		},
        ob : function(key,callback) {
			setInterval(function(){
				var data = get(key);
				if(data.id == obIdarr[key]){
					return ;
				}
				obIdarr[key] = data.id;
				callback(data.data);
			},10);
		},
		reset : function() {
			for(var i=0;i<keyList.length;i++) {
				storage.remove(keyList[i]);
			}
		}
	};
	var WinKey = 'WinKey001';
	var genertorId = function(arr) {
		var i=1;
		while(arr[i] == 1){i++;}
		arr[i] = 1 ;
		return i;		
	}
	var winList = storage.get(WinKey) || [];
	window.pageId = genertorId(winList) ;
	storage.set(WinKey, winList) ;
    window.addEvent('unload',function() {
		winList[pageId] = 0;
		storage.set(WinKey, winList) ;
	});
})();
