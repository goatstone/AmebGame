/* Vec2.js
 physics adapted from https://github.com/subprotocol/verlet-js
* */

function Vector2D(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}
Vector2D.prototype.add = function (v) {
    return new Vector2D(this.x + v.x, this.y + v.y);
}
Vector2D.prototype.sub = function (v) {
    return new Vector2D(this.x - v.x, this.y - v.y);
}
Vector2D.prototype.mul = function (v) {
    return new Vector2D(this.x * v.x, this.y * v.y);
}
Vector2D.prototype.div = function (v) {
    return new Vector2D(this.x / v.x, this.y / v.y);
}
Vector2D.prototype.scale = function (coef) {
    return new Vector2D(this.x * coef, this.y * coef);
}
Vector2D.prototype.mutableSet = function (v) {
    this.x = v.x;
    this.y = v.y;
    return this;
}
Vector2D.prototype.mutableAdd = function (v) {
    this.x += v.x;
    this.y += v.y;
    return this;
}
Vector2D.prototype.mutableSub = function (v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
}
Vector2D.prototype.mutableMul = function (v) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
}
Vector2D.prototype.mutableDiv = function (v) {
    this.x /= v.x;
    this.y /= v.y;
    return this;
}
Vector2D.prototype.mutableScale = function (coef) {
    this.x *= coef;
    this.y *= coef;
    return this;
}
Vector2D.prototype.equals = function (v) {
    return this.x == v.x && this.y == v.y;
}
Vector2D.prototype.length = function (v) {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector2D.prototype.length2 = function (v) {
    return this.x * this.x + this.y * this.y;
}

Vector2D.prototype.dist = function (v) {
    return Math.floor(Math.sqrt(this.dist2(v)));
}

Vector2D.prototype.dist2 = function (v) {
    var x = v.x - this.x;
    var y = v.y - this.y;
    return x * x + y * y;
}
