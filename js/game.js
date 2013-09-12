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
    var startTime, lastTickTime;
    var ticks = 0;
    var tickInc = 1000;

    window.addEventListener("load", function load1() {
        window.removeEventListener("load", load1, false);
        init();
    });

    function init() {
        evnt = G.EvntFactory.get();
        gravity = new Vector2D(0, 0.1);
        startTime = Date.now();
        lastTickTime = startTime;

        setDOM();

        grubs = GrubFactory.get({ "width":width, "height":height});
        ameb.init({ "width":width, "height":height});

        UserActions.init();
        evnt.trigger("UserActions.addAmebAction");
//        evnt.trigger("UserActions.removeAmebAction");

        ActionScript.init();
//        evnt.trigger("ActionScript.addTick");
//        evnt.trigger("ActionScript.removeTick");

        Messages.init();

        loop()
    }

    function loop() {
        frame(16);
        draw();
        setTimeout(function () {
            requestAnimFrame(loop);
       }, 40);
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

    function onTick() {
        lastTickTime = Date.now();
        evnt.trigger("tick", ticks);  // game.tick    TODO
        ticks++;
    }

    function frame(step) {
        if (lastTickTime < Date.now() - tickInc) {
            onTick();
        }

        evnt.trigger("game.frame", step)

        // TODO collision ameb

        for (var b in grubs) {
            grubs[b].frame();
            // Is the grub in the bounding box???
            // if it is then it will check the collision with the object
            evnt.trigger("ameb.isInsideAmebBoundingBox", grubs[b]);
        }
    }

    function draw() {
//            ctx.clearRect(0, 0, width, height);   TODO drawEnviornment() OR env.on(draw, )
        // optimize draw routine : TODO
        ctx.fillStyle = "rgba(255,255,254, 0.9  )";
        ctx.rect(0, 0, width, height);
        ctx.fill();

        for (var i in grubs) {
            grubs[i].draw(ctx);
        }

        evnt.trigger("game.draw", ctx);

    }

})();