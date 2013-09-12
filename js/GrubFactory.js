/* GrubFactory.js  */

var GrubFactory = (function () {

    var width, height;
    var grubs = [];

    function setGrubs() {
        var bugFigConfig = [];
        var j = 170; // TODO make num proportional to canvas size
        while (--j) {
            // all coming from outside
            // never get made inside Ameb
            var rn = rand(0, width);
            var rn2 = rand(0, height);
            var obj = {
                pos:new Vector2D(rn, rn2), lastPos:new Vector2D(rn, rn2),
                color:"rgba(55," + rand(20, 150) + ", " + rand(20, 150) + ", 0.7)",
                size:5,
                boundWidth:width, boundHeight:height,
                gravity:new Vector2D(0.03, 0.00)
            }
            bugFigConfig.push(obj);
        }
        grubs = particleFactory.get(bugFigConfig);

    }

    return {
        get:function (configs) {
            if (grubs.length < 1) {
                width = configs.width;
                height = configs.height
                setGrubs()
            }
            return grubs;
        }
    }
})();