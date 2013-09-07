/* game.js
 Ameb : User navigates creature, Ameb, to catch food
 physics adapted from https://github.com/subprotocol/verlet-js
 * */

var game = (function () {
    var id = 0, canvas;
    var constraints = [];
    var width, height;
    var ctx;
    var highlightColor = "#f00";
    var gravity = new Vector2D(0, 0.1);
    var bugFigures = [];
    var moveDist = 5;
    var startTime = Date.now();
    var lastTickTime = startTime;
    var count = 0;

    var evnt = G.EvntFactory.get();

    var moves = {
        37: [-moveDist, 0], 38: [ 0, -moveDist],
        39: [moveDist, 0], 40: [0, moveDist]
    };

    window.addEventListener("load", function load() {
        window.removeEventListener("load", load, false);
        init();
    });

    function init() {
        canvas = document.getElementById("board");
        var body = document.getElementsByTagName("body")[0];
        var viewportHeight = document.documentElement.clientHeight;
        var viewportWidth = document.documentElement.clientWidth;
        canvas.style.backgroundColor = "#cff";
        body.style.backgroundColor = "#000";
        body.style.margin = "2px";

        width = viewportWidth - 15;
        height = viewportHeight - 15;

        var dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.getContext("2d").scale(dpr, dpr);
        ctx = canvas.getContext("2d");

        setEvents();
        makeBugFigures(); // FoodFactory.get()
        ameb.init({"bugFigures": bugFigures, "width": width, "height": height}); // width, height
    }

    function makeBugFigures() {
        var bugFigConfig = [];
        var j = 20;
        while (--j) {
            var rn = rand(0, width);
            var rn2 = rand(0, height);
            var obj = {
                pos: new Vector2D(rn, rn2), lastPos: new Vector2D(rn, rn2),
                color: "rgba(55," + rand(20, 150) + ", " + rand(20, 150) + ", 0.7)",
                size: 5,
                boundWidth: width, boundHeight: height,
                gravity: new Vector2D(0.03, 0.00)
            }
            bugFigConfig.push(obj);
        }
        bugFigures = particleFactory.get(bugFigConfig);
    }

    function reset() {
        l("reset")
        ameb.reset();
        evnt.trigger("game.reset");
    }

    function setEvents() {
        addEventListener("keydown", function (e) {
//            l(e.which);
            if (e.which === 82) {     // r
                reset();
            }
            if (e.which === 73) {     // i
                msg.toggleIntro();
            }
            if (e.which === 191) {     // ?
                msg.toggleDescription();
            }
            if (e.which === 67) {     // c
                ameb.headConstraintToggle(); // evt.trigger("ameb.headConstraintToggle")
            }
            if (e.which === 32) {    // [space bar]
                ameb.footConstraintToggle(); // evt.trigger("ameb.headConstraintToggle")
            }
            if (e.which >= 37 && e.which <= 40) {
                var moveKey = e.which;
                ameb.moveHead(moves[moveKey]);  // evt.trigger("ameb.moveHead", {move:moves[moveKey]} )
            }
        });
    }

    var ticks = 0;
    var tickInc = 1000;

    function onTick() {
        lastTickTime = Date.now();
        evnt.trigger("tick");  // game.tick
        ticks++;
    }

    function bugCollision(bugFig) {

        // what is the nextPos?
        var possibleNextPos = bugFig.getNextPos();

        var parts = ameb.getPaticles();
        var isHit = false;
        for (var i in parts) {
            var distR = Math.sqrt(Math.pow(possibleNextPos.x - parts[i].pos.x, 2) + Math.pow(possibleNextPos.y - parts[i].pos.y, 2))
            if (distR < parts[i].size) {
                isHit = true;
                break;
            }
        }
        var partCnstrnts = ameb.getConstraints();
        for (var j in partCnstrnts) {
            // check for polygon TODO !!!
            if (
                possibleNextPos.x < partCnstrnts[j].cornerPoints[0].x
                    || possibleNextPos.x > partCnstrnts[j].cornerPoints[1].x
                    || possibleNextPos.y < partCnstrnts[j].cornerPoints[0].y
                    || possibleNextPos.y > partCnstrnts[j].cornerPoints[3].y
                ) {
            } else {
                isHit = true;
            }
        }
        return isHit;
    }

    return {
        draw: function () {
//            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "rgba(255,255,254, 0.9  )";
            ctx.rect(0, 0, width, height);
            ctx.fill();

            ameb.draw(ctx);
            for (var b in bugFigures) {
                bugFigures[b].draw(ctx);
            }
            if (msg.hasMessages()) {
                msg.draw(ctx);
            }
        },
        frame: function (step) {
            if (lastTickTime < Date.now() - tickInc) {
                onTick();
            }

            ameb.frame(step);

            for (var b in bugFigures) {
                bugFigures[b].frame();

                // collision? if yes resolve
                if (bugCollision(bugFigures[b])) {  // if it is a hit then swap dirs
                    bugFigures[b].color = "#00f";
                    bugFigures[b].size = 6;
                    var bounceInc = 2;
                    bugFigures[b].lastPos.x = bugFigures[b].lastPos.x + (bugFigures[b].pos.x - bugFigures[b].lastPos.x ) * bounceInc;
                    bugFigures[b].lastPos.y = bugFigures[b].lastPos.y + (bugFigures[b].pos.y - bugFigures[b].lastPos.y ) * bounceInc;
                }
            }
        } };
})();

window.addEventListener("load", function load1() {
        window.removeEventListener("load", load1, false);
        var loop = function () {
            game.frame(16);
            game.draw();
            setTimeout(function () {
                requestAnimFrame(loop);
            }, 100);
        };
        loop()
        //  msg.init();
        // msg.toggleIntro();
    }

);

window.requestAnimFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (callback) {
    window.setTimeout(callback, 1000 / 60);
};

//                var str = " - " +
//                    (possibleNextPos.x > partCnstrnts[j].cornerPoints[0].x) + " : " +
//                    (possibleNextPos.x > partCnstrnts[j].cornerPoints[1].x) + " : " +
//                    (possibleNextPos.y < partCnstrnts[j].cornerPoints[0].y)
//                    + " : " + (possibleNextPos.y > partCnstrnts[j].cornerPoints[3].y)
//                }

//                if (count % 30 === 0) {
//                var str = j+ " - " +
//                    (possibleNextPos.x > partCnstrnts[j].cornerPoints[0].x) + " : " +
//                    (possibleNextPos.x > partCnstrnts[j].cornerPoints[1].x) + " : " +
//                    (possibleNextPos.y < partCnstrnts[j].cornerPoints[0].y) + " : " +
//                    (possibleNextPos.y > partCnstrnts[j].cornerPoints[3].y)
//                console.log(str);
//                console.log((possibleNextPos.x > partCnstrnts[j].cornerPoints[1].x));
//                console.log(j + ": " + partCnstrnts[j].cornerPoints[0].x + " : " + ": " + partCnstrnts[j].cornerPoints[1].x + ": " + partCnstrnts[j].cornerPoints[2].x
//                    + ": " + partCnstrnts[j].cornerPoints[3].x)
//                console.log(" a hit!!!")
