
;(function(scope,undefined){
	

var Animation=scope.Animation=function(cfg){
	scope.merger(this,cfg);
	this.init();
}


Animation.prototype = {

	constructor: Animation,

	// Animation 包含的Frame, 类型:数组
	frames: null,
	// 包含的Frame数目
	frameCount: -1,
	// 所使用的图片id(在ns.ResPool.getRes(存放的Key),)字符串类型. 
	currentFrame: null,
	currentFrameIndex: -1,
	currentFramePlayed: -1,

	startFrameIndex : 0,
	
	baseX: 0,
	baseY: 0,

	loop: true,
	paused: false,

	img : null ,

	init: function() {
		this.frames = this.getFramesConfig() || this.frames || [];
		var Me=this;
		this.frames.forEach(function(frame){
			frame.img=frame.img||Me.img;
			frame.width=frame.width||Me.width;
			frame.height=frame.height||Me.height;
		});
		this.frameCount = this.frames.length;
		this.setFrame(0);
	},
	getFramesConfig: function() {

	},

	setFrame: function(index) {
		this.currentFrameIndex = index;
		this.currentFrame = this.frames[index];
		this.currentFramePlayed = 0;
	},
	onEnd: function(deltaTime) {

	},
	update: function(deltaTime) {
		if (this.paused) {
			return;
		}
		if (this.currentFramePlayed >= this.currentFrame.duration) {
			if (this.currentFrameIndex == this.frameCount - 1) {
				if (this.loop) {
					this.currentFrameIndex = this.startFrameIndex;
				}
				this.onEnd(deltaTime);
			} else {
				this.currentFrameIndex++;
			}
			this.setFrame(this.currentFrameIndex);

		} else {
			this.currentFramePlayed += deltaTime;
		}
	}
	// ,
	// render : function(context){
	// 	var f=this.currentFrame;
	// 	var img=f.img || this.img;
	// 	context.drawImage(img, f.x, f.y, f.w, f.h,  0,0, f.w, f.h);
	// }
};


}(this));
