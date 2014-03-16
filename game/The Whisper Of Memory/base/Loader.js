;
(function(scope, undefined) {

	scope.ResPool = {
		cache: {},
		_count: 0,
		get: function(id, clone) {
			var res = this.cache[id] || null;
			if (clone && res != null) {
				res = res.cloneNode(true);
			}
			return res;
		},
		add: function(id, res) {
			this.cache[id] = res;
			this._count++;
		},
		remove: function(id) {
			var res = this.cache[id];
			delete this.cache[id];
			if (scope.isDom(res)) {
				scope.removeDom(res);
			}
			this._count--;
		},
		clear: function() {
			for (var id in this.cache) {
				this.remove(id);
			}
			this.cache = {};
			this._count = 0;
		},
		size: function() {
			return this._count;
		}
	};


	scope.ResLoader = function(cfg) {
		scope.merger(this, cfg);
	};

	scope.ResLoader.prototype = {

		constructor: scope.ResLoader,

		autoLoadAudio: true,
		autoLoadImage: true,

		loadAudio: function(src, callback, onError) {
			var audio = document.createElement('audio');
			if (callback) {
				audio.addEventListener("canplaythrough", function(evt) {
					callback.call(this, evt);
					this.removeEventListener("canplaythrough", arguments.callee);
				});
			}
			if (onError) {
				audio.addEventListener("error", function(evt) {
					onError.call(this, evt);
					this.removeEventListener("error", arguments.callee);
				});
			}
			audio.src = src;
			audio.autobuffer = true;
			audio.preload = true;
			audio.volume = 1;

			audio.load();
			return audio;
		},

		loadImage: function(src, callback, onError) {
			var img = document.createElement('img');
			if (callback) {
				img.addEventListener("load", function(evt) {
					callback.call(this, evt);
					this.removeEventListener("load", arguments.callee);
				});
			}
			if (onError) {
				img.addEventListener("error", function(evt) {
					onError.call(this, evt);
					this.removeEventListener("error", arguments.callee);
				});
			}
			img.src = src;
			return img;
		},

		load: function(resList, onloaded, onloading) {
			var Me = this;
			var resCache = {};
			var totalCount = resList.length;
			var loadedCount = 0;
			var loadedList = [];
			var loadErrList = [];

			function _onLoaded(evt) {
				var _res = evt.target;
				_res.loaded = true;
				loadedList.push(_res);
			}

			function _onError(evt) {
				var _res = evt.target;
				_res.err = true;
				loadedList.push(_res);
				loadErrList.push(_res.src);
			}
			console.log(totalCount)
			for (var i = 0; i < totalCount; i++) {
				var res = resList[i];
				res.src = res.src || res.url;
				res.id = res.id || res.src;
				res.type = res.type || (res.fn ? "fn" : "img");

				if (res.fn) {
					var cb = function(obj) {
							loadedList.push(obj);
						}
					res.fn(cb);

				} else if (res.type === "audio") {
					if (this.autoLoadAudio) {
						resCache[res.id] = this.loadAudio(res.src, _onLoaded, _onError);
					} else {
						loadedList.push(res);
					}
				} else {
					// }else if (res.type==="img"){
					resCache[res.id] = this.loadImage(res.src, _onLoaded, _onError);

				}
			}

			function check() {

				if (loadedCount + loadErrList.length >= totalCount) {
					if (onloaded) {
						setTimeout(function() {
							onloaded(totalCount, resCache, loadErrList);
						}, 10);
					}
				} else {
					var _delay = 0;
					var res = loadedList[loadedCount];
					if (res !== null) {
						loadedList[loadedCount] = null;

						loadedCount++;
						if (onloading) {
							_delay = onloading(loadedCount, totalCount, res);
						}
					}
					setTimeout(check, _delay || 10);
				}
			}
			check();

			return resCache;
		}
	};



}(this));