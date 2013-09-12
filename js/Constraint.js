/* Constraints.js
 physics adapted from https://github.com/subprotocol/verlet-js
 * */

function DistanceConstraint(a, b, stiffness, distance /*optional*/) {
    this.a = a;  // particle
    this.b = b;  // particle
    this.distance = typeof distance != "undefined" ? distance : a.pos.sub(b.pos).length();
    this.stiffness = stiffness;
    this.cornerPoints = [];

}
DistanceConstraint.prototype.relax = function (stepCoef) {
    var normal = this.a.pos.sub(this.b.pos);
    var m = normal.length2();
    normal.mutableScale(((this.distance * this.distance - m) / m) * this.stiffness * stepCoef);
    this.a.pos.mutableAdd(normal);
    this.b.pos.mutableSub(normal);

    this.setCornerPoints();
}

DistanceConstraint.prototype.setCornerPoints = function () {
    rad = 10;
    var rmCos = (  this.b.pos.x - this.a.pos.x   ) /
        Math.sqrt(Math.pow(this.a.pos.x - this.b.pos.x, 2) + Math.pow(this.a.pos.y - this.b.pos.y, 2));    // cos
    var rmSin = (  this.b.pos.y - this.a.pos.y   ) /
        Math.sqrt(Math.pow(this.a.pos.x - this.b.pos.x, 2) + Math.pow(this.a.pos.y - this.b.pos.y, 2));    // sin

    var newX = this.a.pos.x + rad * (rmCos  );
    var newY = this.a.pos.y + rad * (rmSin   );
    var xDiff = (  this.a.pos.x - newX  );
    var yDiff = (  this.a.pos.y - newY  );

    this.cornerPoints = {
        p1: {x: this.b.pos.x - yDiff, y: this.b.pos.y + xDiff},
        p2: {x: this.b.pos.x + yDiff, y: this.b.pos.y - xDiff},
        p3: {x: this.a.pos.x + yDiff, y: this.a.pos.y - xDiff},
        p4: {x: this.a.pos.x - yDiff, y: this.a.pos.y + xDiff}
    };
}

DistanceConstraint.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.a.pos.x, this.a.pos.y);
    ctx.lineTo(this.b.pos.x, this.b.pos.y);


    ctx.lineWidth = 3;
    ctx.strokeStyle = "#aa0";
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 250 , .2)";

    for (var i in this.cornerPoints) {
        ctx.lineTo(this.cornerPoints[i].x, this.cornerPoints[i].y);
    }
    ctx.closePath()
    ctx.fill();

}

function PinConstraint(a, pos) {
    this.a = a;   // particle
    this.pos = (new Vector2D()).mutableSet(pos);
}
PinConstraint.prototype.relax = function (stepCoef) {
    this.a.pos.mutableSet(this.pos);
}
PinConstraint.prototype.draw = function (ctx) {
//    ctx.beginPath();
//    ctx.arc(this.pos.x, this.pos.y, 16, 0, 2 * Math.PI);
//    ctx.fillStyle = "rgba(0,153,255,0.1)";
//    ctx.fill();
}
