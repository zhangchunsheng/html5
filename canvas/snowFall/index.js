window.onload = function() {
    // control snow
    function snowFall(snow) {
        // config
        snow = snow || {};
        this.maxFlake = snow.maxFlake || 200; // max flake num
        this.flakeSize = snow.flakeSize || 10; // snow shape
        this.fallSpeed = snow.fallSpeed || 1; // snow speed
        this.status = 0;
    }

    // loop
    requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {
            setTimeout(callback, 1000 / 60);
        };

    cancelAnimationFrame = window.cancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame;

    // start snow
    snowFall.prototype.start = function() {
        if(this.status == 1 || this.status == 4) {
            //already snow
            return false;
        }
        this.status = 1;

        // create canvas
        snowCanvas.apply(this);

        // create flake
        createFlakes.apply(this);

        // draw snow
        drawSnow.apply(this);
    }

    // stop snow
    snowFall.prototype.stop = function() {
        if(this.status == 2 || this.status == 0 || !this.canvas) {
            return false;
        }

        // pause loop
        this.pause();

        this.status = 2;

        //delete canvas
        this.canvas.parentNode.removeChild(this.canvas);
        this.canvas = null;
    }

    // pause snow
    snowFall.prototype.pause = function() {
        if(this.status == 3) {
            return false;
        }

        this.status = 3;

        cancelAnimationFrame(this.loop);
    }

    // resume snow
    snowFall.prototype.resume = function() {
        if(this.status == 3 && this.canvas) {
            this.status = 4;
            // loop
            this.loop = requestAnimationFrame(function() {
                drawSnow.apply(that);
            });
        }
    }

    // create canvas
    function snowCanvas() {
        // add dom
        var canvas = document.createElement("canvas");
        canvas.id = "snowfall";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.setAttribute("style", "position: fixed; top: 0; left: 0; z-index: 2999; pointer-events: none;");
        document.getElementsByTagName("body")[0].appendChild(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        // window size
        window.onresize = function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        //todo device rotate

        var myaudio = new Audio('heart with love.mp4');
        myaudio.autoplay = "autoplay";
        myaudio.preload = "auto";
        myaudio.loop = true;
    }

    // flake move
    function flakeMove(canvasWidth, canvasHeight, flakeSize, fallSpeed) {
        this.x = Math.floor(Math.random() * canvasWidth); // x point
        this.y = Math.floor(Math.random() * canvasHeight);// y point
        this.size = Math.random() * flakeSize + 2; //shape
        this.maxSize = flakeSize;
        this.speed = Math.random() * 1 + fallSpeed;
        this.fallSpeed = fallSpeed;
        this.velX = 0; // x direction speed
        this.velY = this.speed; //y direction speed
        this.stepSize = Math.random() / 30;// step size
        this.step = 0;
    }

    flakeMove.prototype.update = function() {
        var x = this.x,
            y = this.y;

        // cos
        this.velX *= 0.98;
        if(this.velY < this.speed) {
            this.velY = this.speed;
        }
        this.velX += Math.cos(this.step += .05) * this.stepSize;

        this.y += this.velY;
        this.x += this.velX;

        //console.log("x:" + this.x + " y:" + this.y);

        // out edge
        if(this.x >= canvas.width || this.x <= 0 ||
            this.y >= canvas.height || this.y <= 0) {
            this.reset(canvas.width, canvas.height);
        }
    }

    flakeMove.prototype.reset = function(width, height) {
        this.x = Math.floor(Math.random() * width);
        this.y = 0;

        this.size = Math.random() * this.maxSize + 2;
        this.speed = Math.random() * 1 + this.fallSpeed;
        this.velY = this.speed;
        this.velX = 0;
    }

    // render
    flakeMove.prototype.render = function() {
        var snowFlake = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        snowFlake.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        snowFlake.addColorStop(.5, "rgba(255, 255, 255, 0.5)");
        snowFlake.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.save();
        ctx.fillStyle = snowFlake;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function createFlakes() {
        var maxFlake = this.maxFlake,
            flakes = this.flakes = [],
            canvas = this.canvas;
        for(var i = 0 ; i < maxFlake ; i++) {
            flakes.push(new flakeMove(canvas.width, canvas.height, this.flakeSize, this.fallSpeed));
        }
    }

    function drawSnow() {
        var maxFlake = this.maxFlake,
            flakes = this.flakes;
        ctx = this.ctx, canvas = this.canvas, that = this;
        // clean flake
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var e = 0 ; e < maxFlake ; e++) {
            flakes[e].update();
            flakes[e].render(ctx);
        }
        //frame
        this.loop = requestAnimationFrame(function() {
            drawSnow.apply(that);
        });
    }

    var snow = new snowFall({maxFlake: 200});

    snow.start();
}