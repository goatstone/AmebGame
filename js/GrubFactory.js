/* GrubFactory.js  */

var GrubFactory = (function() {

    var width, height;
    var grubs = [];

    function setGrubs() {
        var bugFigConfig = [];
        var j = 170; // TODO make num proportional to canvas size
        while (--j) {
            // all coming from outside
            // never get made inside Ameb
            var rn = rand(10, width - 10);  // x
            var rn2 = rand(0, height); // y
            var obj = {
                pos: new Vector2D(rn, 2), lastPos: new Vector2D(rn, 2),
//                lastPos:new Vector2D(rn, 1), lastPos:new Vector2D(rn, 1),
                color: 'rgba(55,' + rand(20, 150) + ', ' +
                    rand(20, 150) + ', 0.7)',
                size: 5,
                boundWidth: width, boundHeight: height,
                gravity: new Vector2D(0.0, -0.003),
                eatGrub: function() {
//                    l("eat g")
                    var randN = rand(10, width - 10);

                    this.pos = new Vector2D(randN, 1); // grub.eaten
                    this.lastPos = new Vector2D(randN, 0);

                }
            };
            bugFigConfig.push(obj);
        }
        grubs = particleFactory.get(bugFigConfig);

    }

    return {
        get: function(configs) {
            if (grubs.length < 1) {
                width = configs.width;
                height = configs.height;
                setGrubs();
            }
            return grubs;
        }
    };
})();
