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
    var ticks = 0;
    var tickInc = 1000;

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

        evnt.on("game.reset", reset)

        makeBugFigures(); // FoodFactory.get()
        ameb.init({"bugFigures": bugFigures, "width": width, "height": height}); // width, height
    }

    function makeBugFigures() {
        var bugFigConfig = [];
        var j = 200;
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
    }

    function onTick() {
        lastTickTime = Date.now();
        evnt.trigger("tick");  // game.tick
        ticks++;
    }

    // bool checkTriangleCollision( Triangle  t, Point dot )
    function checkTriangleCollision(t, dot) {

        var alpha = ((t.p2.y - t.p3.y) * (dot.x - t.p3.x) + (t.p3.x - t.p2.x) * (dot.y - t.p3.y)) /
            ((t.p2.y - t.p3.y) * (t.p1.x - t.p3.x) + (t.p3.x - t.p2.x) * (t.p1.y - t.p3.y));

        var beta = ((t.p3.y - t.p1.y) * (dot.x - t.p3.x) + (t.p1.x - t.p3.x) * (dot.y - t.p3.y)) /
            ((t.p2.y - t.p3.y) * (t.p1.x - t.p3.x) + (t.p3.x - t.p2.x) * (t.p1.y - t.p3.y));

        var gamma = 1.0 - alpha - beta;

        return (alpha > 0 && beta > 0 && gamma > 0);
    }

    function bugCollision(bugFig) {

        // what is the nextPos?
        var possibleNextPos = bugFig.getNextPos();

        var parts = ameb.getParticles();
        for (var i in parts) {
            var distR = Math.sqrt(Math.pow(possibleNextPos.x - parts[i].pos.x, 2) + Math.pow(possibleNextPos.y - parts[i].pos.y, 2))
            if (distR < parts[i].size) {
                if (i === "0") {
                    // ameb.eatBug()
                    // evt.trigger.("ameb.eatBug")
                    ameb.addHealthPoints() //healthPoints++;
                    var be = ameb.addBugsEaten();
                    bugFig.pos = new Vector2D(Math.random * 30, 10);
                    bugFig.lastPos = new Vector2D(10, 10);
                    isHit = false;
                    break;
                }
                return true
            }
        }

        var partCnstrnts = ameb.getConstraints();
        for (var j in partCnstrnts) {
            var t = {}
            t.p1 = partCnstrnts[j].cornerPoints["p1"];
            t.p2 = partCnstrnts[j].cornerPoints["p3"];
            t.p3 = partCnstrnts[j].cornerPoints["p4"];
            var t2 = {}
            t2.p1 = partCnstrnts[j].cornerPoints["p1"];
            t2.p2 = partCnstrnts[j].cornerPoints["p2"];
            t2.p3 = partCnstrnts[j].cornerPoints["p3"];
            var isCollide = checkTriangleCollision(t, bugFig.pos) || checkTriangleCollision(t2, bugFig.pos)
            if (isCollide) {
                return true
            }
        }
        return false;
    }

    return {
        init: init,
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
            count++;
        } };
})();

window.addEventListener("load", function load1() {
        window.removeEventListener("load", load1, false);

        game.init();

        var loop = function () {
            game.frame(16);
            game.draw();

            setTimeout(function () {
                requestAnimFrame(loop);
            }, 100);
        };
        loop()
        msg.init();
        msg.toggleIntro();
        UserActions.init();
    }

);