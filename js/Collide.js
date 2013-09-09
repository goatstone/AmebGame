/* Collide.js
 Collide.trianglePoint(Triangle ta, Point p);
 Collide.circlePoint(Circle c, Point p);
 * */

var Collide = function () {

    //Collide.trianglePoint(Triangle ta, Point p);
    function trianglePoint(ta, dot) {

        var alpha = ((ta.p2.y - ta.p3.y) * (dot.x - ta.p3.x) + (ta.p3.x - ta.p2.x) * (dot.y - ta.p3.y)) /
            ((ta.p2.y - ta.p3.y) * (ta.p1.x - ta.p3.x) + (ta.p3.x - ta.p2.x) * (ta.p1.y - ta.p3.y));

        var beta = ((ta.p3.y - ta.p1.y) * (dot.x - ta.p3.x) + (ta.p1.x - ta.p3.x) * (dot.y - ta.p3.y)) /
            ((ta.p2.y - ta.p3.y) * (ta.p1.x - ta.p3.x) + (ta.p3.x - ta.p2.x) * (ta.p1.y - ta.p3.y));

        var gamma = 1.0 - alpha - beta;

        return (alpha > 0 && beta > 0 && gamma > 0);
    }

    //Collide.circlePoint(Circle c, Point p);
    function circlePoint(c, p) {

        var distR = Math.sqrt(Math.pow(p.x - c.pos.x, 2) + Math.pow(p.y - c.pos.y, 2))

        return distR < c.size;
    }

    return{
        circlePoint: function (c, p) {
            return circlePoint(c, p);
        },
        trianglePoint: function (ta, p) {
            return trianglePoint(ta, p);
        }
    }
}();
