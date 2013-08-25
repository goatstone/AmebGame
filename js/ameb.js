/* ameb.js */

var ameb = (function () {

    var constrainMod = false, probeMode = true;

    var headParticle = null, footParticle = null,
        headConstraint = null, footConstraint = null;

    var amebParticles = [], amebConstraints = [];

    var maxNeckLength = 100
    var compConfig = [];
    var incX = 0, incY = 20;
    var amtX = 19, amtY = 20;

    var bugFigures = [];
    var width = 300, height = 500;

    var healthPoints = 20;
    var bugsEaten = 0;
    var evnt = null;
    var ticks = 0;
    var isAlive = true;

    function onTick() {
        if (ticks % 3 === 0) {
            healthPoints--;
        }
        if(healthPoints <=0 ){
            die();
        }
        if(isAlive){
            evnt.trigger("ameb.tick", {"healthPoints":healthPoints, "bugsEaten": bugsEaten});
            ticks++;
        }
    }
     function die(){
         removeConstraint(footConstraint);
         removeConstraint(headConstraint);
         isAlive = false;
         evnt.remove("ameb.tick") ;
         // set message
         evnt.trigger("ameb.die");
     }
    return {
        init: function (config) {

            bugFigures = config.bugFigures;
            width = config.width;
            height = config.height;
            var midX = width / 2;
            var midY = height / 2;
            incY = midY - 10;
            var sizeStart = 16, sizeInc = 1;
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
        getHealthPoints: function () {
            return healthPoints;
        },
        getBugsEaten: function () {
            return bugsEaten;
        },
        reduceHealthPoints: function () {
            healthPoints--;
        },
        footConstraintToggle: function () {
            if (probeMode) {
                removeConstraint(footConstraint);
            } else {
                footConstraint = new PinConstraint(footParticle, footParticle.pos);
                amebConstraints.push(footConstraint);

            }
            probeMode = (probeMode === true) ? false : true;

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
                < maxNeckLength) {
                headParticle.pos.mutableAdd(new Vector2D(config[0], config[1]));
                headConstraint.pos.mutableAdd(new Vector2D(config[0], config[1]));
            }
        },
        frame: function (step) {
            var offset = 10;
            for (var p in bugFigures) {
                if ((headConstraint.pos.y > bugFigures[p].pos.y - offset) &&
                    (headConstraint.pos.y < bugFigures[p].pos.y + offset) &&
                    (headConstraint.pos.x > bugFigures[p].pos.x - offset) &&
                    (headConstraint.pos.x < bugFigures[p].pos.x + offset)) {
                    bugFigures.splice(p, 1);
                }
            }
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
    function removeConstraint(constraint) {
        var indexOf = amebConstraints.indexOf(constraint);
        if (indexOf != -1) {
            amebConstraints.splice(indexOf, 1);
        }
    }
})();

function rand(low, high) {
    var num = 0;
    num = (Math.random() * (high - low) );
    num = num + low;
    return Math.floor(num);
}