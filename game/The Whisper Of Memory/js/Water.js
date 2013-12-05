function Water(cfg) {
	merger(this,cfg);
}

Water.prototype = {

	constructor: Water,

	actived: false,

	distance: 25,

	x: 0,
	y: 0,

	width: 400,

	height: 200,

	damp: 0.095,

	coldDown: 1000,
	lastWave : 0,
	init: function(scene) {
		this.scene=scene;
		this.baseX = this.x;
		this.baseY = this.y;

		this.particles = [];
		this.particleCount = Math.floor(this.width / this.distance);
		this.distance = this.width / (this.particleCount - 1);
		var x = 0,
			p;
		for (var i = 0; i < this.particleCount; i++, x += this.distance) {
			var y = 0;
			p = [x, y];
			p.vy = 0;
			p.ay = 0;
			this.particles.push(p);
		}
		p[0] = this.width;
	},
	fall : function(x, vy){
		var idx = Math.floor(this.particleCount * x / this.width);
		idx = idx % this.particleCount;
		var p = this.particles[idx];
		p.vy = 30;	
		p[1]=20;
		var pp = this.particles[idx - 2];
		var np = this.particles[idx + 2];
		pp && (pp[1] = getRandom(-10,0));
		np && (np[1] = getRandom(-10,0));
		this.lastWave=Date.now();
	},
	wave: function(x, vy, y) {
		var idx = Math.floor(this.particleCount * x / this.width);
		idx = idx % this.particleCount;
		var p = this.particles[idx];
		p.vy = vy;
		this.lastWave=Date.now();
	},

	update: function(deltaTime) {
		if (Date.now()-this.lastWave>this.coldDown) {
			for (var i=0;i<3;i++){
				var x = getRandom(this.scene.x, this.scene.x+this.scene.viewWidth);
				var vy = getRandom(2, 4);
				this.wave(x, vy);
			}
			
		} else {
			var prevY = 0;
			for (var i = 0; i < this.particleCount; i++) {
				var p = this.particles[i];
				var currentY = p[1];
				var nextY = i == this.particleCount - 1 ? 0 : this.particles[i + 1][1];

				var fForceY = this.damp * (currentY + currentY - prevY - nextY);

				fForceY += this.damp / 15 * currentY;

				p.ay = -fForceY;
				p.vy += p.ay;
				p[1] += p.vy;
				p.vy /= 1.02;

				prevY = currentY;
			}
		}
	},

	render: function(context, deltaTime) {

		context.save();
		context.lineWidth=4;
		context.strokeStyle = "rgba(80,180,255,0.8)";
		context.fillStyle = "rgba(120,180,255,0.5)";
		context.translate(this.x-this.scene.x, this.y-this.scene.y);
		context.beginPath();

		var p1 = this.particles[0];
		var p2 = this.particles[1];
		context.moveTo(0, p1[1] / 2);
		for (var i = 2; i < this.particleCount; i++) {
			p3 = this.particles[i];
			var midX = (p3[0] + p2[0]) / 2
			var midY = (p3[1] + p2[1]) / 2
			context.quadraticCurveTo(p2[0], p2[1], midX, midY);
			p1 = p2;
			p2 = p3;
		}
		context.quadraticCurveTo(p3[0], p3[1], p3[0], p3[1] / 2);

		context.stroke();

		context.lineTo(this.width, this.height);
		context.lineTo(0, this.height);

		context.closePath();

		context.fill();

		// context.beginPath();
		// var st=context.strokeStyle;
		// context.lineWidth=1;
		// context.strokeStyle="red"
		// var p1 = this.particles[0];
		// context.moveTo(p1[0], p1[1]);
		// for (var i = 1; i < this.particleCount; i++) {
		// 	p2 = this.particles[i];
		// 	context.lineTo(p2[0], p2[1]);
		// 	p1 = p2;
		// }
		// context.stroke();
		// context.strokeStyle=st;
		// context.lineWidth=3;
		// context.closePath();

		

		context.restore()
	}

};