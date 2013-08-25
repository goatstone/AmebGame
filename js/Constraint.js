/* Constraints.js
 physics adapted from https://github.com/subprotocol/verlet-js
* */

function DistanceConstraint(a, b, stiffness, distance /*optional*/) {
    this.a = a;  // particle
    this.b = b;  // particle
    this.distance = typeof distance != "undefined" ? distance : a.pos.sub(b.pos).length();
    this.stiffness = stiffness;
}
DistanceConstraint.prototype.relax = function (stepCoef) {
    var normal = this.a.pos.sub(this.b.pos);
    var m = normal.length2();
    normal.mutableScale(((this.distance * this.distance - m) / m) * this.stiffness * stepCoef);
    this.a.pos.mutableAdd(normal);
    this.b.pos.mutableSub(normal);
}
DistanceConstraint.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.a.pos.x, this.a.pos.y);
    ctx.lineTo(this.b.pos.x, this.b.pos.y);
//    ctc.
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#aa0";
    ctx.stroke();
}

function PinConstraint(a, pos) {
    this.a = a;   // particle
    this.pos = (new Vector2D()).mutableSet(pos);
}
PinConstraint.prototype.relax = function (stepCoef) {
    this.a.pos.mutableSet(this.pos);
}
PinConstraint.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 16, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0,153,255,0.1)";
    ctx.fill();
}