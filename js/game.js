/* game.js
 Ameb : User navigates creature, Ameb, to catch food
 physics adapted from https://github.com/subprotocol/verlet-js
 * */

var game = (function () {
    var id = 0;
    var evnt;
    var canvas, ctx, width, height;
    var gravity;
    var bugFigures = [];
    var startTime, lastTickTime;
    var ticks = 0;
    var tickInc = 1000;

    function init() {
        evnt = G.EvntFactory.get();
        gravity = new Vector2D(0, 0.1);
        startTime = Date.now();
        lastTickTime = startTime;
        evnt.on("game.reset", reset)
        setDOM()
        makeBugFigures(); // FoodFactory.get()
        ameb.init({"bugFigures": bugFigures, "width": width, "height": height}); // width, height
        loop()
    }

    function loop() {
        game.frame(16);  // TODO private???
        game.draw();
        setTimeout(function () {
            requestAnimFrame(loop);
        }, 100);
    }

    function setDOM() {
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
        ameb.reset();
    }

    function onTick() {
        lastTickTime = Date.now();
        evnt.trigger("tick");  // game.tick
        ticks++;
    }

    function bugCollision(bugFig) {

        // what is the nextPos?
        var possibleNextPos = bugFig.getNextPos();

        var parts = ameb.getParticles();
        for (var i in parts) {
            if (Collide.circlePoint(parts[i], possibleNextPos)) {
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
            var isCollide = Collide.trianglePoint(t, bugFig.pos) || Collide.trianglePoint(t2, bugFig.pos)
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

            // TODO collision ameb
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

    msg.init();
    UserActions.init();
    game.init();

    msg.toggleIntro();

});