/* ameb.js */

var ameb = (function () {

    var constrainMod = false;
    var headParticle = null, footParticle = null,
        headConstraint = null, footConstraint = null;

    var amebParticles = [], amebConstraints = [];

    var maxNeckLength = 100
    var compConfig = [];
    var incX = 0, incY = 20;
    var amtX = 19, amtY = 20;

    var width = 300, height = 500;

    var healthPoints = 150;
    var bugsEaten = 0;
    var evnt = null;
    var ticks = 0;
    var isAlive = true;
    var midX = 10;
    var midY = 10;

    function onTick() {
        if (ticks % 3 === 0) {
            healthPoints--;
        }
        if (healthPoints <= 0) {
            die();
        }
        if (isAlive) {
            evnt.trigger("ameb.tick", {"healthPoints": healthPoints, "bugsEaten": bugsEaten});
            ticks++;
        }
    }

    function die() {
        // set state TODO
        removeConstraint(footConstraint);
        removeConstraint(headConstraint);
        isAlive = false;
        // change color TODO
//        evnt.remove("ameb.tick");
        // set message
        evnt.trigger("ameb.die");
    }

    return {
        reset: function () {
            if (isAlive) {
                return;
            }
            isAlive = true;
            healthPoints = 5;
            headParticle.pos = new Vector2D(midX, midY);
            headParticle.lastPos = new Vector2D(midX, midY);
            footParticle.pos = new Vector2D(midX, midY + 5);
            footParticle.lastPos = new Vector2D(midX, midY + 5);

            footConstraint = new PinConstraint(footParticle, footParticle.pos);
            amebConstraints.push(footConstraint);
        },
        init: function (config) {
            width = config.width;
            height = config.height;
            midX = width / 2;
            midY =  90;
            incY = midY - 19;
            var sizeStart = 15, sizeInc = 1;
            var r = 200, g = 200, b = 80;
            var colorInc = 10;
            var startColor = "rgba(" + r + "," + g + "," + b + ",1.0 )";
            evnt = G.EvntFactory.get();

            var i = 9;
            while (--i) {
                var obj = {
                    pos: new Vector2D(midX, incY), lastPos: new Vector2D(midX, incY),
                    color: startColor,
                    jitter: 0, size: sizeStart,
                    boundWidth: width, boundHeight: height
                }
                sizeStart -= sizeInc;
                compConfig.push(obj);
                incY += amtY;
//                r += colorInc;
                g += colorInc;
                b += colorInc;
                startColor = "rgba(" + r + "," + g + "," + b + ",1.0 )";
            }
            evnt.on("tick", function () {
                onTick();

            })
            amebParticles = particleFactory.get(compConfig);
            headParticle = amebParticles[0];
            footParticle = amebParticles[1];

            //  DistanceConstraint
            for (var i in amebParticles) {
                if (i > 0) {
                    amebConstraints.push(new DistanceConstraint(amebParticles[i], amebParticles[i - 1], 0.02, 30));
                }
            }
            headParticle.size = 10;
            headParticle.color = "rgba( 255, 90, 0, 0.9)";
            footParticle.color = "rgba( 200, 200, 0, 0.9)";

            headConstraint = new PinConstraint(headParticle, headParticle.pos);

            amebParticles[1].size = 20
            footConstraint = new PinConstraint(amebParticles[1], amebParticles[1].pos);
            amebConstraints.push(footConstraint);

        },
        getParticles: function () {
            return amebParticles;
        },
        getConstraints: function(){
          return  amebConstraints.slice(0,7);
        },
        addHealthPoints: function () {
            healthPoints++;
        },
        getHealthPoints: function () {
            return healthPoints;
        },
        addBugsEaten: function () {
             bugsEaten++;
        },
        getBugsEaten: function () {
            return bugsEaten;
        },
        reduceHealthPoints: function () {
            healthPoints--;
        },
        footConstraintToggle: function () {
            footConstraintToggle()
        },
        headConstraintToggle: function () {
            if (constrainMod) {
                removeConstraint(headConstraint);
            } else {
                var curDist = footParticle.pos.dist(headParticle.pos);
                maxNeckLength = ( curDist > 100 ) ? curDist : 100;
                ameb.addHeadConstraint();
            }
            constrainMod = (constrainMod === true) ? false : true;
        },
        addHeadConstraint: function () {
            headConstraint = new PinConstraint(headParticle, headParticle.pos);
            amebConstraints.push(headConstraint);
        },
        moveHead: function (config) {
            if (footParticle.pos.dist(headParticle.pos.add(new Vector2D(config[0], config[1])))
                < maxNeckLength && isAlive) {
                headParticle.pos.mutableAdd(new Vector2D(config[0], config[1]));
                headConstraint.pos.mutableAdd(new Vector2D(config[0], config[1]));
            }
        },
        frame: function (step) {
            var offset = 10;
            for (var i in amebParticles) {
                amebParticles[i].frame();
            }
            var stepCoef = 1 / step;
            for (var i = 0; i < step; ++i) {
                for (var j in amebConstraints) {
                    amebConstraints[j].relax(stepCoef);
                }
            }
        },
        draw: function (ctx) {
            for (var i = 0; i < amebParticles.length; i++) {
                amebParticles[i].draw(ctx);
            }
            for (var i = 0; i < amebConstraints.length; i++) {
                amebConstraints[i].draw(ctx);
            }

        }
    }
    function calcHealtPoints() {
        healthPoints = healthPoints + bugsEaten * 2;
    }

    function footConstraintToggle() {
        if (hasConstriaint(footConstraint)) {
            removeConstraint(footConstraint);
        } else {
            footConstraint = new PinConstraint(footParticle, footParticle.pos);
            amebConstraints.push(footConstraint);

        }
    }

    function removeConstraint(constraint) {
        var indexOf = amebConstraints.indexOf(constraint);
        if (indexOf != -1) {
            amebConstraints.splice(indexOf, 1);
        }
    }

    function hasConstriaint(constraint) {
        var indexOf = amebConstraints.indexOf(constraint);
        return (indexOf !== -1) ? true : false;
    }
})();

function rand(low, high) {
    var num = 0;
    num = (Math.random() * (high - low) );
    num = num + low;
    return Math.floor(num);
}