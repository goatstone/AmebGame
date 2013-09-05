/* particleFactory */

var particleFactory = (function () {

    function Particle(pos) {
        this.color = "rgba( 20, 20, 20, 0.8)";
        this.pos = (new Vector2D()).mutableSet(pos);
        this.lastPos = (new Vector2D()).mutableSet(pos);
        this.size = 15;
        this.boundHeight = 250;
        this.boundWidth = 250;
        this.jitter = 1.2;
        this.gravity = new Vector2D(0, 0.1);
        this.frameCallBack = null;
    }
//    Particle.prototype.setFrameCallBack = function (callBack) {
//        this.frameCallBack = callBack;
//    }
    Particle.prototype.getNextPos = function (ctx) {
        var velocity = this.pos.sub(this.lastPos);
       var possbleNextPos = new Vector2D(this.pos.x, this.pos.y );

        // save last good state
//        this.lastPos.mutableSet(this.pos);
//        velocity = velocity * 2;
        // inertia               // addInertia
        possbleNextPos = possbleNextPos.add(velocity);
        // gravity
        // addGravity() return new Vect
        possbleNextPos = possbleNextPos.add(this.gravity);
        // jitter
        // jitter();  addJitter()
        var ran = Math.floor(Math.random() * this.jitter);
        ran = (Math.random() > .5) ? ran : ran * -1;
        possbleNextPos = possbleNextPos.add(new Vector2D(ran, ran));
//        possbleNextPos.mutableScale(1.05)
//                              l(possbleNextPos)
//        possbleNextPos.x = (possbleNextPos.x>0)? possbleNextPos.x + 10 : possbleNextPos.x -10;
//        possbleNextPos.x = (possbleNextPos.x>0)? possbleNextPos.x + 10 : possbleNextPos.x -10;
//        possbleNextPos.y = (possbleNextPos.y>0)? possbleNextPos.y + 10 : possbleNextPos.y -10 ;
        return possbleNextPos;

    }
    Particle.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    // getNexPos
    Particle.prototype.frame = function () {

        var velocity = this.pos.sub(this.lastPos);

        // save last good state
        this.lastPos.mutableSet(this.pos);
        // inertia               // addInertia
        this.pos.mutableAdd(velocity);
        // gravity
        // addGravity() return new Vect
        this.pos.mutableAdd(this.gravity);
        // jitter
        // jitter();  addJitter()
        var ran = Math.floor(Math.random() * this.jitter);
        ran = (Math.random() > .5) ? ran : ran * -1;
        this.pos.mutableAdd(new Vector2D(ran, ran));

        // what is the new position?

        // Is there somethng there?
       // move to the edge and boune
        // this.solver this.hasCollision this.checkCollision
        // does this particle need to check if it is colliding?
        if(this.checkCollision){
              this.checkCollision();
        }
        this.bounds();

    }
    Particle.prototype.bounds = function () {
        if (this.pos.y > this.boundHeight )
            this.pos.y = this.boundHeight - 1;
        else if (this.pos.y < 0)
            this.pos.y = 1;
        else if (this.pos.x < 0)
            this.pos.x = 1;
        else if (this.pos.x > this.boundWidth - 1)
            this.pos.x = this.boundWidth - 1;
    }
    return {
        get: function (configs) {
            var particles = [];
            for (var i in configs) {    // G.u.merge(obj1, obj2);
                var p = new Particle(configs[i].pos);
                for (var j in configs[i]) {
                    p[j] = configs[i][j];
                }
                particles.push(p);
            }
            return particles;

        }
    }
})();