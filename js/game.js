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
        var j = 19;
        while (--j) {
            var rn = rand(0, width);
            var rn2 = rand(0, height);
            var obj = {
                pos: new Vector2D(rn, rn2), lastPos: new Vector2D(rn, rn2),
                color: "rgba(55," + rand(20, 150) + ", " + rand(20, 150) + ", 0.7)",
                size: 5, boundWidth: width,
                gravity: new Vector2D(0.0, -0.1)
                //jitter: 1
            }
            bugFigConfig.push(obj);
        }
        bugFigures = particleFactory.get(bugFigConfig);
    }

    function setEvents() {
        addEventListener("keydown", function (e) {
//            l(e.which);
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
    function onTick(){
        lastTickTime = Date.now();
        evnt.trigger("tick");  // game.tick
        ticks++;
    }
    return {
        draw: function () {
            ctx.clearRect(0, 0, width, height);
            ameb.draw(ctx);
            for (var b in bugFigures) {
                bugFigures[b].draw(ctx);
            }
            if (msg.hasMessages()) {
                msg.draw(ctx);
            }
        },
        frame: function (step) {
            if(lastTickTime < Date.now() - tickInc ){
                onTick();
            }
            ameb.frame(step);
            for (var b in bugFigures) {
                bugFigures[b].frame();
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
            }, 50);
        };
        loop();
        msg.init();
        msg.toggleIntro();
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

