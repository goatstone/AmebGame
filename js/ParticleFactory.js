/* particleFactory */

var particleFactory = (function() {

    function Particle(pos) {
        this.color = 'rgba( 20, 20, 20, 0.8)';
        this.pos = (new Vector2D()).mutableSet(pos);
        this.lastPos = (new Vector2D()).mutableSet(pos);
        this.size = 15;
        this.boundHeight = 250;
        this.boundWidth = 250;
        this.jitter = 1.06;
        this.gravity = new Vector2D(0, 0.1);
    }
    Particle.prototype.getNextPos = function(ctx) {

        var velocity = this.pos.sub(this.lastPos);
       var possbleNextPos = new Vector2D(this.pos.x, this.pos.y);

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

        return possbleNextPos;

    };
    Particle.prototype.draw = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    };
    // getNexPos
    Particle.prototype.frame = function() {

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

        this.bounds();

    };
    Particle.prototype.bounds = function() {

        if (this.pos.y > this.boundHeight) {
            this.pos.y = this.boundHeight - 2;
        }
        else if (this.pos.y < 0) {
            this.pos.y = 2;

        }
        else if (this.pos.x < 0) {
            this.pos.x = 2;
        }
        else if (this.pos.x > this.boundWidth - 1) {
            this.pos.x = this.boundWidth - 2;
        }

    };
    return {
        get: function(configs) {
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
    };
})();
