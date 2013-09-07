/* Minkowsky Sum Collision Detection */

var t = {
    p1: {x: 200, y: 10},
    p2: {x: 50, y: 300},
    p3: {x: 350, y: 300}
}
// Shape s
var s = {
    p1: {x: 250, y: 100},
    p2: {x: 300, y: 100},
    p3: {x: 300, y: 300},
    p4: {x: 50, y: 300}
}
// Point dot
var dot = {x: 20, y: 20, w: 20, h: 20};
// MinkowskyShape ms
var ms;

var isDotHit = false;
var msg = "Herman Minkowsky";
var canvas, ctx;
var width, height;

function checkTriangleCollision() {
    // t, dot
    var alpha = ((t.p2.y - t.p3.y) * (dot.x - t.p3.x) + (t.p3.x - t.p2.x) * (dot.y - t.p3.y)) /
        ((t.p2.y - t.p3.y) * (t.p1.x - t.p3.x) + (t.p3.x - t.p2.x) * (t.p1.y - t.p3.y));

    var beta = ((t.p3.y - t.p1.y) * (dot.x - t.p3.x) + (t.p1.x - t.p3.x) * (dot.y - t.p3.y)) /
        ((t.p2.y - t.p3.y) * (t.p1.x - t.p3.x) + (t.p3.x - t.p2.x) * (t.p1.y - t.p3.y));

    var gamma = 1.0 - alpha - beta;

    if (alpha > 0 && beta > 0 && gamma > 0) {
        msg = "inside";
    }else{
        msg = "outside";
    }
}

function init() {
    setCanvas();
    setEvents();
    var loop = function () {
        tick();
//        setTimeout(
//            function () {
                requestAnimFrame(loop);
//            }, 100
//        )
    };
    loop();
}

function tick() {
    //detectCollisions();
    checkTriangleCollision();
    draw(ctx);
}

function detectCollisions(event, ui) {

    // rightMostPoint, leftMostPoint, topMostPoint, bottomMostPoint
    var rMost, lMost, tMost, bMost;

    // MinkowskiSum ms  : shape derived by Minkowsky Sum
    ms = {
        p1: {
            x: s.p1.x - dot.x,
            y: s.p1.y - dot.y
        },
        p2: {
            x: s.p2.x - dot.x,
            y: s.p2.y - dot.y
        },
        p3: {
            x: s.p3.x - dot.x,
            y: s.p3.y - dot.y
        },
        p4: {
            x: s.p4.x - dot.x,
            y: s.p4.y - dot.y
        }
    };

    rMost = Math.max(ms.p1.x, ms.p2.x, ms.p3.x, ms.p4.x);
    lMost = Math.min(ms.p1.x, ms.p2.x, ms.p3.x, ms.p4.x);
    tMost = Math.min(ms.p1.y, ms.p2.y, ms.p3.y, ms.p4.y);
    bMost = Math.max(ms.p1.y, ms.p2.y, ms.p3.y, ms.p4.y);

    if (lMost <= 0 && rMost >= 0 && tMost <= 0 && bMost >= 0) {
        msg = "hit"
    }
    else {
        msg = "miss"
    }
}
function setCanvas() {
    // set canvas
    canvas = document.getElementById("board");
    var viewportHeight = document.documentElement.clientHeight;
    var viewportWidth = document.documentElement.clientWidth;
    canvas.style.backgroundColor = "#cff";
    width = viewportWidth - 15;
    height = viewportHeight - 15;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.getContext("2d").scale(dpr, dpr);
    ctx = canvas.getContext("2d");

}
function setEvents() {
    // setEvents
    canvas.addEventListener("mousedown", function (e) {
        if (e.x < dot.x || e.x > dot.x + dot.w || e.y < dot.y || e.y > dot.y + dot.h) {
        } else {
            isDotHit = true
        }
    })
    canvas.addEventListener("mousemove", function (e) {
        if (!isDotHit) {
            return false;
        }
        dot.x = e.x;
        dot.y = e.y;
    })
    canvas.addEventListener("mouseup", function (e) {
        isDotHit = false
    })

}
function draw(ctx) {
    ctx.clearRect(0, 0, width, height);
    ctx.font = "14pt Arial";
    ctx.fillText(msg, 20, 20)

    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.fillStyle = "rgba(100,0,25, .5)";
    ctx.moveTo(s.p1.x, s.p1.y)
    ctx.lineTo(s.p2.x, s.p2.y);
    ctx.lineTo(s.p3.x, s.p3.y);
    ctx.lineTo(s.p4.x, s.p4.y);
    ctx.closePath();
    ctx.fill();


    ctx.beginPath();
    ctx.fillStyle = "rgba(250,0, 0, 1)";
    ctx.rect(dot.x, dot.y, dot.w, dot.h);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0, 0, 1)";
    for (var i in ms) {
        ctx.rect(ms[i].x, ms[i].y, 5, 5);
    }
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0, 200, 1)";
    for (var i in t) {
        ctx.rect(t[i].x, t[i].y, 15, 15);
    }
    ctx.fill();

}

window.addEventListener("load", function load() {
    init();
});

window.requestAnimFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (callback) {
    window.setTimeout(callback, 1000 / 60);
};