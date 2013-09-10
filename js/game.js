/* game.js

 Ameb : User navigates creature, Ameb, to catch food and stay alive.

 require:  Messages UserActions, GrubFactory, ParticleFactory, ameb
 Collide, Constraint, Vector2D, EvntFactory

 physics adapted from https://github.com/subprotocol/verlet-js
 * */

var game = (function () {
    var id = 0;
    var evnt;
    var canvas, ctx, width, height;
    var gravity;
    var grubs = [];
    // var ameb; TODO
    var startTime, lastTickTime;
    var ticks = 0;
    var tickInc = 1000;
//    var parts = ameb.getParticles();
//    var partCnstrnts = ameb.getConstraints();

    window.addEventListener("load", function load1() {
        window.removeEventListener("load", load1, false);
        init();
    });

    function init() {
        evnt = G.EvntFactory.get();
        gravity = new Vector2D(0, 0.1);
        startTime = Date.now();
        lastTickTime = startTime;

        Messages.init(); // msgs = Messages.init();
        UserActions.init();

        evnt.on("game.reset", reset);

        setDOM();

        grubs = GrubFactory.get({ "width":width, "height":height});
        ameb.init({ "width":width, "height":height});

        loop()
    }

    function loop() {
        frame(16);
        draw();
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

    function reset() {
        evnt.trigger("ameb.reset")
    }

    function onTick() {
        lastTickTime = Date.now();
        evnt.trigger("tick");  // game.tick
        ticks++;
    }

    function grubCollision(grub) {

        // what is the nextPos?
        var possibleNextPos = grub.getNextPos();

        var parts = ameb.getParticles();
        for (var i in parts) {
            if (Collide.circlePoint(parts[i], possibleNextPos)) {
                if (i === "0") { // if this is the head of the Ameb
                    evnt.trigger("ameb.eatGrub");
                    grub.pos = new Vector2D(Math.random * 30, 10); // grub.eaten
                    grub.lastPos = new Vector2D(10, 10);
                    return false;
                }
                return true;
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
            var isCollide = Collide.trianglePoint(t, grub.pos) || Collide.trianglePoint(t2, grub.pos)
            if (isCollide) {
                return true
            }
        }
        return false;
    }

    function frame(step) {
        if (lastTickTime < Date.now() - tickInc) {
            onTick();
        }

        ameb.frame(step);  // evnt.trigger("game.frame", step)

        // TODO collision ameb
        for (var b in grubs) {
            grubs[b].frame();

            // collision? if yes resolve
            if (grubCollision(grubs[b])) {  // if it is a hit then swap dirs
                // resolve TODO
                // evnt.trigger("grub.hit")
                grubs[b].color = "#00f";
                grubs[b].size = 6;
                var bounceInc = 2;
                grubs[b].lastPos.x = grubs[b].lastPos.x + (grubs[b].pos.x - grubs[b].lastPos.x ) * bounceInc;
                grubs[b].lastPos.y = grubs[b].lastPos.y + (grubs[b].pos.y - grubs[b].lastPos.y ) * bounceInc;
            }
        }
    }

    function draw() {
//            ctx.clearRect(0, 0, width, height);   TODO drawEnviornment() OR env.on(draw, )
        ctx.fillStyle = "rgba(255,255,254, 0.9  )";
        ctx.rect(0, 0, width, height);
        ctx.fill();
        // optimize draw routine : TODO
        ameb.draw(ctx); // evnt.trigger("game.draw", ctx)

        for (var i in grubs) {
            grubs[i].draw(ctx);
        }

        if (Messages.hasMessages()) {
            Messages.draw(ctx); // evnt.trigger("game.draw", ctx) // This 2nd one would not be needed TODO
        }
    }

})();