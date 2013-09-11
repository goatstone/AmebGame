/* ameb.js */
// AmebFactory TODO

var ameb = (function () {

    var headParticle = null, footParticle = null,
        headConstraint = null, footConstraint = null;
    // allParts allConstraints headPart headConstraint footPart footConstraint
    var amebParticles = [], amebConstraints = []; // parts constraints
    var compConfig = [];
    var maxNeckLength = 100
    var isAlive = true;
    var healthPoints = 15, bugsEaten = 0;

    var incX = 0, incY = 20, amtX = 19, amtY = 20;
    var width = 300, height = 500; // worldWidth gameAreaWidth TODO
    var evnt = null;
    var ticks = 0;
    var midX = 10, midY = 10;
    var bbTick = 0

    var tops = [], rights = [], bottoms = [], rights = [];
    var bBox = {t:0, r:0, b:0, l:0}; // boundingBox

    function init(config) {
        width = config.width;
        height = config.height;
        midX = width / 2;
        midY = 90;
        incY = midY - 19;
        var sizeStart = 15, sizeInc = 1;
        var r = 200, g = 200, b = 80;
        var colorInc = 10;
        var startColor = "rgba(" + r + "," + g + "," + b + ",1.0 )";
        evnt = G.EvntFactory.get();

        var i = 9;
        while (--i) {
            var obj = {
                pos:new Vector2D(midX, incY), lastPos:new Vector2D(midX, incY),
                color:startColor,
                jitter:0, size:sizeStart,
                boundWidth:width, boundHeight:height
            }
            sizeStart -= sizeInc;
            compConfig.push(obj);
            incY += amtY;
//                r += colorInc;
            g += colorInc;
            b += colorInc;
            startColor = "rgba(" + r + "," + g + "," + b + ",1.0 )";
        }
        evnt.on("tick", function () { // .on("game.tick"
            onTick();
        });
        evnt.on("ameb.headConstraintToggle", headConstraintToggle);
        evnt.on("ameb.footConstraintToggle", footConstraintToggle);
        evnt.on("ameb.moveHead", function (data) {
            moveHead(data)
        });
        evnt.on("ameb.eatGrub", function () {
            eatGrub()
        });
        evnt.on("game.reset", function () {
            reset()
        });
        evnt.on("game.frame", function (step) {
            frame(step);
        });
        evnt.on("game.draw", function (ctx) {
            draw(ctx);
        });
        evnt.on("ameb.collidePoint", function (point) {
            var bounceInc = 2;
            if (collidePoint(point)) {
                // grub.resolveHit() TODO
                point.lastPos.x = point.lastPos.x + (point.pos.x - point.lastPos.x ) * bounceInc;
                point.lastPos.y = point.lastPos.y + (point.pos.y - point.lastPos.y ) * bounceInc;
            }

        });

        evnt.on("ameb.isInsideAmebBoundingBox", function (grub) {
//            l(grub)
            if (
                !(grub.pos.y < bBox.t ||
                    grub.pos.x > bBox.r ||
                    grub.pos.x < bBox.l ||
                    grub.pos.y > bBox.b)
                ) {
                l("in bounds")
                grub.color = "#f00";
                // Now check for collision!!!!


            }
//            else{
//                l("in  bounds")
//            }
            if (bbTick % 3000 === 0) {
//                l(bbTick)
//                l(grub)

//                l(bbTick +"x")
            }
            bbTick++;
        });

//        ameb.isInsideAmebBoundingBox

        amebParticles = particleFactory.get(compConfig); // bodyParts TODO
        headParticle = amebParticles[0];
        footParticle = amebParticles[1];

        // DistanceConstraint
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

    }

    function onTick() {
        if (ticks % 3 === 0) {
            healthPoints--;
        }
        if (healthPoints <= 0) {
            die();
        }
        if (isAlive) {
            evnt.trigger("ameb.tick", {"healthPoints":healthPoints, "bugsEaten":bugsEaten});
//            l(ticks)
            ticks++;
        }
    }

    function die() {
        // set state TODO
        removeConstraint(footConstraint);
        removeConstraint(headConstraint);
        isAlive = false;
        // change color TODO
        // set message
        evnt.trigger("ameb.die");
    }

    function headConstraintToggle() {
        if (hasConstraint(headConstraint)) {
            removeConstraint(headConstraint);
        } else {
            var curDist = footParticle.pos.dist(headParticle.pos);
            maxNeckLength = ( curDist > 100 ) ? curDist : 100;
            addHeadConstraint();
        }
    }

    function footConstraintToggle() {
        if (hasConstraint(footConstraint)) {
            removeConstraint(footConstraint);
        } else {
            footConstraint = new PinConstraint(footParticle, footParticle.pos);
            amebConstraints.push(footConstraint);

        }
    }

    function moveHead(config) {
        if (footParticle.pos.dist(headParticle.pos.add(new Vector2D(config[0], config[1])))
            < maxNeckLength && isAlive) {
            headParticle.pos.mutableAdd(new Vector2D(config[0], config[1]));
            headConstraint.pos.mutableAdd(new Vector2D(config[0], config[1]));
        }
    }

    function eatGrub() {
        healthPoints++;
        bugsEaten++;
    }

    function reset() {
        if (isAlive) {
            return;
        }
        isAlive = true;
        healthPoints = 25;
        headParticle.pos = new Vector2D(midX, midY);
        headParticle.lastPos = new Vector2D(midX, midY);
        footParticle.pos = new Vector2D(midX, midY + 5);
        footParticle.lastPos = new Vector2D(midX, midY + 5);

        footConstraint = new PinConstraint(footParticle, footParticle.pos);
        amebConstraints.push(footConstraint);
    }

    function addHeadConstraint() {
        headConstraint = new PinConstraint(headParticle, headParticle.pos);
        amebConstraints.push(headConstraint);
    }

    function removeConstraint(constraint) {
        var indexOf = amebConstraints.indexOf(constraint);
        if (indexOf != -1) {
            amebConstraints.splice(indexOf, 1);
        }
    }

    function hasConstraint(constraint) {
        var indexOf = amebConstraints.indexOf(constraint);
        return (indexOf !== -1) ? true : false; // treturn (indexOf !== -1) TODO
    }

    function frame(step) {
        var top = 0 , right = 0, bottom = 0, left = 0
        var tops = [], rights = [], bottoms = [], lefts = [];

        for (var i in amebParticles) {
            amebParticles[i].frame();

            top = Math.ceil(amebParticles[i].pos.y - amebParticles[i].size)
            tops.push(top);
            bottom = Math.ceil(amebParticles[i].pos.y + amebParticles[i].size)
            bottoms.push(bottom);
            right = Math.ceil(amebParticles[i].pos.x + amebParticles[i].size)
            rights.push(right);
            left = Math.ceil(amebParticles[i].pos.x - amebParticles[i].size)
            lefts.push(left);

        }

        var stepCoef = 1 / step;
        for (var i = 0; i < step; ++i) {
            for (var j in amebConstraints) {
                amebConstraints[j].relax(stepCoef);

                if (amebConstraints[j].cornerPoints) {
                    top = Math.ceil(Math.min(
                        amebConstraints[j].cornerPoints.p1.y,
                        amebConstraints[j].cornerPoints.p2.y,
                        amebConstraints[j].cornerPoints.p3.y,
                        amebConstraints[j].cornerPoints.p4.y)
                    );
                    tops.push(top);
                }
            }
        }
        // calculate bounding box
        bBox.t = Math.min(Math.min.apply(null, tops))
        bBox.r = Math.min(Math.max.apply(null, rights))
        bBox.b = Math.min(Math.max.apply(null, bottoms))
        bBox.l = Math.min(Math.min.apply(null, lefts))
    }

    function draw(ctx) {
        // beginPath optimize draw routine s?? TODO
        for (var i = 0; i < amebParticles.length; ++i) {
            amebParticles[i].draw(ctx);
        }
        for (var i = 0; i < amebConstraints.length; ++i) {
            amebConstraints[i].draw(ctx);
        }

//        boundingBox
        ctx.beginPath();
        ctx.lineTo(bBox.l, bBox.t);
        ctx.lineTo(bBox.r, bBox.t);

        ctx.lineTo(bBox.r, bBox.b);
        ctx.lineTo(bBox.l, bBox.b);

        ctx.lineTo(bBox.l, bBox.t);

        ctx.fillStyle = "#f00";
        ctx.stroke();

    }

    function collidePoint(grub) {

        // what is the nextPos?
        var possibleNextPos = grub.getNextPos();

        var parts = amebParticles;
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

        var partCnstrnts = amebConstraints.slice(0, 7);
        ;
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

    return {
        init:function (config) {
            init(config);
        }
    }

})();