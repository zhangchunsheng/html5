
// 初始化所有小球.参赛选手可修改的函数,不可改变函数名, 不能改变函数的输入输出:无参数, 无返回值.  
function initBallList() {
	/*context.drawImage(ImgCache["text"], 5, 50);
	pixels_text = context.getImageData(5, 50, ImgCache["text"].width, ImgCache["text"].height);
	context.drawImage(ImgCache["logo"], 225, 30);
	pixels_logo = context.getImageData(225, 30, ImgCache["logo"].width, ImgCache["logo"].height);*/
	
	var local_canvas = document.createElement("canvas");
	local_canvas.style.position = "absolute";
	local_canvas.style.left = 0;
	local_canvas.style.top = 0;
	local_canvas.style.zIndex = -1;
	local_canvas.width = canvas.width;
	local_canvas.height = canvas.height;
	$("box").appendChild(local_canvas);
	var local_context = local_canvas.getContext("2d");
	var local_ImgCache = ImgCache;
	local_context.fillStyle = bgColor;
	local_context.fillRect(0, 0, local_canvas.width, local_canvas.height);
	local_context.drawImage(local_ImgCache["text"], 5, 50);
	local_context.drawImage(local_ImgCache["logo"], 225, 30);
	
	ballList = [];
	// 小球上的icon对应的图片
	var img = ImgCache["icon"];
	
	for (var i = 0 ; i < ballNum ; i++) {
		var ball = {
			img : img ,
			
			//初始坐标
			x : ballRadius,
			y : ballRadius,

			//现代移动区域
			minX : ballRadius,
			minY : ballRadius,
			maxX : canvas.width-ballRadius,
			maxY : canvas.height-ballRadius,
			
			// 必须使用模板提供的 getNewSpeed 来取得新的速度
			speedX : getNewSpeed(),
			speedY : getNewSpeed(),
			
			update : function(deltaTime) {
				this.x = this.x + this.speedX * deltaTime;
				this.y = this.y + this.speedY * deltaTime;

				if (this.x < this.minX) {
					this.x = this.minX;
					this.speedX = getNewSpeed();
				} else if (this.x > this.maxX) {
					this.x = this.maxX;
					this.speedX = -getNewSpeed();
				}
				if (this.y < this.minY) {
					this.y = this.minY;
					this.speedY = getNewSpeed();
				} else if (this.y > this.maxY) {
					this.y = this.maxY;
					this.speedY = -getNewSpeed();
				}			

			}
		};
		ballList.push(ball);
	}
}

// 动画测试的核心函数.参赛选手可修改的函数,不可改变函数名, 不能改变函数的输入输出:参数deltaTime, 无返回值. 
function testCore(deltaTime) {
	var local_context = context;
	local_context.clearRect(0, 0, canvas.width, canvas.height);
	//local_context.putImageData(pixels_text, 5, 50);
	//local_context.putImageData(pixels_logo, 225, 30);
	
	var local_ballList = ballList;
	var local_iconRadius = iconRadius;
	var local_ballColor = ballColor;
	for (var i = 0 ; i < ballNum ; i++) {
		var ball = local_ballList[i];
		ball.update(deltaTime);
		
		local_context.beginPath();
		local_context.arc(ball.x, ball.y, ballRadius, 0, 2 * Math.PI, false);
		local_context.fillStyle = local_ballColor;
		local_context.fill();
		local_context.stroke();
		local_context.closePath();
		local_context.drawImage(ball.img, ball.x - local_iconRadius, ball.y - local_iconRadius);
	}	
}

