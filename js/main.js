/* main.js */

var isGravityRandOn = true;
var count = 0;
var booksByNixon = richarNixonData.property["/book/author/works_written"].values;
var nameRNixon = richarNixonData.property["/type/object/name"].values[0].value

var world;
var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var fixDef, bodyDef, ctx, bodyList;

function init() {

    world = new b2World(
        new b2Vec2(0, 1)    //gravity
        , true                 //allow sleep
    );

    ctx = document.getElementById("canvas").getContext("2d");

    fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    bodyDef = new b2BodyDef;

    setBackground();
    makeStar();

    loop();

};

function loop() {
    update();
//    frame(16);
//    draw();
    console.log(1)
    setTimeout(function () {
        requestAnimFrame(loop);
    }, 40);
}

function frame(step) {
//    if (lastTickTime < Date.now() - tickInc) {
//        onTick();
//    }
//
//    evnt.trigger('game.frame', step);
//
//    // TODO collision ameb
//
//    for (var b in grubs) {
//        grubs[b].frame();
//        // Is the grub in the bounding box???
//        // if it is then it will check the collision with the object
//        evnt.trigger('ameb.isInsideAmebBoundingBox', grubs[b]);
//    }
}

function makeStar() {
    var head;
    var xCent = 10;
    var yCent = 5;
    var newBody;
    var joint;

    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = xCent;
    bodyDef.position.y = yCent;
    fixDef.shape = new b2CircleShape(0.5);
    head = world.CreateBody(bodyDef).CreateFixture(fixDef);

    var yPos = 1;
    var xPos = 2;
    var steps = 12;
    var radius = 1;
    for (var i = 0; i < steps; ++i) {

        var xPos2 = xCent + radius * Math.cos(Math.PI * 2 * i / steps);
        var yPos2 = yCent + radius * Math.sin(Math.PI * 2 * i / steps);

        bodyDef.position.x = xPos2;
        bodyDef.position.y = yPos2;
        fixDef.shape = new b2CircleShape(0.25);
        newBody = world.CreateBody(bodyDef).CreateFixture(fixDef);
        joint = new b2RevoluteJointDef();
        joint.Initialize(head.m_body, newBody.m_body, head.m_body.GetWorldCenter());
        world.CreateJoint(joint);
        radius = radius + .4;
    }

}

function drawToCanvas() {
    var drawScale = 30;
    var bCount = 0;
    var xf;
    bodyList = world.GetBodyList();
    jointList = world.GetJointList();

    ctx.clearRect(0, 0, 600, 400)

    for (var j = jointList; j; j = j.m_next) {
        var ba = j.GetBodyA()
        var pos = ba.GetPosition();
        var bBody = j.GetBodyB();
        var bBodyPos = bBody.GetPosition();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(150,175,0,1)"//this._color(color.color, this.m_alpha);
        ctx.lineTo(pos.x * drawScale, pos.y * drawScale);
        ctx.lineTo(bBodyPos.x * drawScale, bBodyPos.y * drawScale);
        ctx.stroke();
    }

    for (var b = bodyList; b; b = b.m_next) {
        xf = b.m_xf;
        var x = xf.position.x * 30;
        var y = xf.position.y * 30;

        ctx.font = "28px Arial";
        ctx.fillStyle = "rgba(250,50,0, 0.75)"//this._color(color.color, this.m_alpha);
        if (bCount === 12) {
            ctx.fillText(nameRNixon, x, y);  //booksByNixon
        }
        ctx.font = "13px Arial";
        ctx.fillStyle = "rgba(10,10,0, 1.0)"//this._color(color.color, this.m_alpha);
        if (bCount < 12) {
            ctx.fillText(booksByNixon[bCount].text, x, y);  //booksByNixon
        }
        ctx.color = "rgba(250,20,20,1.0)";
        ctx.closePath();
        ctx.stroke();
        ctx.fill()

        bCount++;
    }
    count++;
}

function update() {

    world.Step(
        1 / 80   //frame-rate
        , 10       //velocity iterations
        , 10       //position iterations
    );
    if (isGravityRandOn) {
        var ranA = Math.random() * 15;
        ranA = (Math.random() > .5) ? ranA * -1 : ranA;
        var ranB = Math.random() * 10;
        ranB = (Math.random() > .5) ? ranA * -1 : ranA;
        world.SetGravity(new b2Vec2(ranA, ranB));
    }
    world.ClearForces();

    drawToCanvas();

}

function setBackground() {
    //create ground
    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(20, 2);
    bodyDef.position.Set(10, 400 / 30 + 1.8);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(10, -1.8);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    fixDef.shape.SetAsBox(2, 14);
    bodyDef.position.Set(1.8, 13);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(16, 13);
    world.CreateBody(bodyDef).CreateFixture(fixDef);

}

init();