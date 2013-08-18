/* game.js
 Ameb : User navigates creature, Ameb, to catch food
 physics adapted from https://github.com/subprotocol/verlet-js
 * */

var game = (function () {
    var id = 0, canvas;
    var particles = [];
    var constraints = [];
    var width, height;
    var draggedEntity = null;
    var mouse = new Vector2D(0, 0);
    var mouseDown = false;
    var ctx;
    var highlightColor = "#f00";
    var gravity = new Vector2D(0, 0.1);

    var headParticle = null;
    var headConstraint = null;
    var footConstraint = null;
    var probeMode = true;
    var maxNeckLength = 90;

    window.addEventListener("load", function load() {
        window.removeEventListener("load", load, false);
        init();
    });

    function init() {
        canvas = document.getElementById("board");
        width = parseInt(canvas.offsetWidth);
        height = parseInt(canvas.offsetHeight);

        var dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.getContext("2d").scale(dpr, dpr);
        ctx = canvas.getContext("2d");

        setEvents();
        makePegs();
        makeBugFigures();
    }

    var pegs = [];

    function makePegs() {
        pegs = [];
        var pegsConfig = [
            {pos: new Vector2D(10, 10), lastPos: new Vector2D(10, 10), color: "rgba(200, 0, 200, 0.05)",
                size: 15}
        ];
        var i = 35;
        while (--i) {
            var rn = rand(70, 1000);
            var rn2 = rand(40, 200);
            var obj = {
                pos: new Vector2D(rn, rn2), lastPos: new Vector2D(rn, rn2),
                color: "rgba(" + rand(0, 25) + "," + rand(20, 150) + ", " + rand(220, 250) + ", 0.9)",
                size: 15, boundWidth: width,
                gravity: new Vector2D(0.0, 1.0)

            }
            pegsConfig.push(obj);
        }
        pegs = particleFactory.get(pegsConfig);
        for (var f in pegs) {
            constraints.push(new PinConstraint(pegs[f], pegs[f].pos));
        }
        particles = particles.concat(pegs);
        //pegs = null;
    }

    // AmebFactory.get();
    var ameb = (function () {

        var headParticle = null;
        var footParticle = null;
        var headConstraint = null;
        var footConstraint = null;
        var foot = null;
        var amebParticles = [];
        var compConfig = [];
        var i = 9;
        var incX = 19;
        var incY = 50;
        var amtX = 19;
        var amtY = 20;

        while (--i) {
            var obj = {
                pos: new Vector2D(100, incY), lastPos: new Vector2D(100, incY),
                color: "rgba(" + rand(0, 250) + "," + rand(0, 150) + ", " + rand(0, 150) + ", 1.0)",
                jitter: 0, size: 10, boundWidth: width
            }
            compConfig.push(obj);
            incY += amtY
        }
        amebParticles = particleFactory.get(compConfig);
        headParticle = amebParticles[0];
        footParticle = amebParticles[1];
        //  DistanceConstraint
        for (var i in amebParticles) {
            if (i > 0) {
                constraints.push(new DistanceConstraint(amebParticles[i], amebParticles[i - 1], 0.02, 30));
            }
        }
        // PinConstraint
        headParticle.size = 10;
        headParticle.color = "rgba( 255, 90, 0, 0.9)";
        footParticle.color = "rgba( 200, 200, 0, 0.9)";

        headConstraint = new PinConstraint(headParticle, headParticle.pos);
        constraints.push(headConstraint);

        amebParticles[1].size = 20
        footConstraint = new PinConstraint(amebParticles[1], amebParticles[1].pos);
        constraints.push(footConstraint);
        particles = particles.concat(amebParticles);
        var maxNeckLength = 70;
        return {
            seStepMode: function () {
                removeConstraint(footConstraint);
            },
            setProbeMode: function () {
                footConstraint = new PinConstraint(footParticle, footParticle.pos);
                constraints.push(footConstraint);
            },
            moveHead: function (config) {
                if (footParticle.pos.dist(headParticle.pos.add(new Vector2D(config[0], config[1])))
                    < maxNeckLength) {
                    headConstraint.pos.mutableAdd(new Vector2D(config[0], config[1]));
                }
            },
            frame: function () {
            },
            draw: function () {
            }
        }
    })();

    function makeBugFigures() {
        var bugFigures = [];
        var bugFigConfig = [];
        var j = 9;
        while (--j) {
            var rn = rand(0, 200);
            var rn2 = rand(0, 100);
            var obj = {
                pos: new Vector2D(rn, rn2), lastPos: new Vector2D(rn, rn2),
                color: "rgba(255," + rand(20, 50) + ", " + rand(20, 50) + ", 0.7)",
                size: 5, boundWidth: width,
                gravity: new Vector2D(0.0, -0.1)
                //jitter: 1
            }
            bugFigConfig.push(obj);
        }
        bugFigures = particleFactory.get(bugFigConfig);
        particles = particles.concat(bugFigures);
    }

    function setEvents() {
        // events
        canvas.onmousedown = function (e) {
            mouseDown = true;
            var nearest = nearestEntity();
            if (nearest) {
                draggedEntity = nearest;
            }
        };
        canvas.onmouseup = function (e) {
            mouseDown = false;
            draggedEntity = null;
        };

        canvas.onmousemove = function (e) {
            var rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        addEventListener("keydown", function (e) {
            if (e.which === 32) {
                if (probeMode) {
                    ameb.seStepMode();
                } else {
                    ameb.setProbeMode()
                }
                probeMode = (probeMode === true) ? false : true;
            }
            if (!probeMode) return;
            var moveDist = 5;
            var moves = {
                37: [-moveDist, 0], 38: [ 0, -moveDist],
                39: [moveDist, 0], 40: [0, moveDist]
            };
            if (e.which >= 37 && e.which <= 40) {
                var moveKey = e.which;
                ameb.moveHead(moves[moveKey]);
            }
        });
    }

    function removeConstraint(constraint) {
        var indexOf = constraints.indexOf(constraint);
        if (indexOf != -1) {
            constraints.splice(indexOf, 1);
        }
    }

    function nearestEntity() {
        var c, i;
        var d2Nearest = 0;
        var entity = null;
        var constraintsNearest = null;
        var selectionRadius = 20;

        for (i in particles) {
            var d2 = particles[i].pos.dist2(mouse);
            if (d2 <= selectionRadius * selectionRadius && (entity == null || d2 < d2Nearest)) {
                entity = particles[i];
                constraintsNearest = constraints;
                d2Nearest = d2;
            }
        }

        // search for pinned constraints for this entity
        for (i in constraintsNearest)
            if (constraintsNearest[i] instanceof PinConstraint && constraintsNearest[i].a == entity) {
                entity = constraintsNearest[i];
            }
        return entity;
    }

    function rand(low, high) {
        var num = 0;
        num = (Math.random() * (high - low) );
        num = num + low;
        return Math.floor(num);
    }

    return {
        draw: function () {
            ctx.clearRect(0, 0, width, height);
            for (var i = 0; i < particles.length; i++) {
                particles[i].draw(ctx);
            }
            for (var i = 0; i < constraints.length; i++) {
                constraints[i].draw(ctx);
            }
            // highlight nearest / dragged entity
            var nearest = draggedEntity || nearestEntity();
            if (nearest) {
                ctx.beginPath();
                ctx.arc(nearest.pos.x, nearest.pos.y, 8, 0, 2 * Math.PI);
                ctx.strokeStyle = highlightColor;
                ctx.stroke();
            }
        },
        frame: function (step) {
            for (var i in particles) {
                particles[i].frame();
            }
            // handle dragging of entities
            if (draggedEntity) {
                console.log("draggedEntity")
                draggedEntity.pos.mutableSet(mouse);
            }
            // relax
            var stepCoef = 1 / step;
            for (var i = 0; i < step; ++i) {
                for (var j in constraints) {
                    constraints[j].relax(stepCoef);
                }
            }
        } };
})();

window.addEventListener("load", function load1() {
        window.removeEventListener("load", load1, false); //remove listener, no longer needed
        var loop = function () {
            game.frame(16);
            game.draw();
            setTimeout(function () {
                requestAnimFrame(loop);
            }, 50);
        };
        loop();
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

