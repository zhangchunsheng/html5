var canvas = document.getElementsByTagName('canvas')[0];
var boby = document.body;
var context = canvas.getContext('2d');
data = [];
h = [];
canvasWidth = canvas.width = innerWidth;
canvasHeight = canvas.height = innerHeight;
v = 32;
random = Math.random;
cos = Math.cos;
Y = 6.3;

for (i = 0; i < Y; i += 0.2) {
	h.push([
		canvasWidth / 2 + 180 * Math.pow(Math.sin(i), 3),
		canvasHeight / 2 + 10 * -(15 * cos(i) - 5 * cos(2 * i) - 2 * cos(3 * i) - cos(4 * i))
	]);
}
    
for (i = 0; i < v; ) {
    x = random() * canvasWidth;
    y = random() * canvasHeight;
    H = 80 * (i / v) + 280;
    S = 40 * random() + 60;
    B = 60 * random() + 20;
    point = [];
    for (k = 0; k < v; )
        point[k++] = {
            x: x,
            y: y,
            X: 0,
            Y: 0,
            R: 1 - k / v + 1,
            S: random() + 1,
            q: ~~(random() * v),
            D: 2 * (i % 2) - 1,
            F: 0.2 * random() + 0.7,
            point: "hsla(" + ~~H + "," + ~~S + "%," + ~~B + "%,.1)"
        };
    data[i++] = point
}

function draw(d) {
    context.fillStyle = d.point;
    context.beginPath();
    context.arc(d.x, d.y, d.R, 0, Y, 1);
    context.closePath();
    context.fill()
}
setInterval(function() {
    context.fillStyle = "rgba(0,0,0,.2)";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    for (i = v; i--; ) {
        point = data[i];
        u = point[0];
        q = h[u.q];
        D = u.x - q[0];
        E = u.y - q[1];
        G = Math.sqrt(D * D + E * E);
        10 > G && (0.95 < random() ? u.q = ~~(random() * v) : (0.99 < random() && (u.D *= -1),
        u.q += u.D,
        u.q %= v,
        0 > u.q && (u.q += v)));
        u.X += -D / G * u.S;
        u.Y += -E / G * u.S;
        u.x += u.X;
        u.y += u.Y;
        draw(u);
        u.X *= u.F;
        u.Y *= u.F;
        for (k = 0; k < v - 1; )
            T = point[k],
            N = point[++k],
            N.x -= 0.7 * (N.x - T.x),
            N.y -= 0.7 * (N.y - T.y),
            draw(N)
    }
}, 25);