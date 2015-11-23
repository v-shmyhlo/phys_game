const { Matter: { Events, Engine, World, Bodies, Body, Vector } } = require('matter-js');
const { $window, scheduledKeyStream, windowEvent } = require('./event_streams');
const { forceVec, forceTop, moveForward, moveBackward, rotateClockWise, rotateCounterclockwise } = require('./avatar');

let mousePos = { x: 0, y: 0 };

const LEFT  = 37,
      UP    = 38,
      DOWN  = 40,
      RIGHT = 39,
      SPACE = 32,
      frameRate = 1000/60

// create a Matter.js engine
const engine = Engine.create(document.body, {
  render: {
    element: document.body,
    // controller: Matter.RenderPixi,
    options: {
      width: 800,
      height: 600,
      background: '#fafafa',
      wireframeBackground: '#222',
      hasBounds: false,
      enabled: true,
      wireframes: true,
      showSleeping: true,
      showDebug: true,
      showBroadphase: true,
      showBounds: true,
      showVelocity: true,
      showCollisions: true,
      showAxes: true,
      showPositions: true,
      showAngleIndicator: true,
      showIds: false,
      showShadows: true
    }
  }
});

const resize = (width, height) => {
  engine.world.bounds.max = { x: width, y: height };
  engine.render.canvas.width = width;
  engine.render.canvas.height = height;
  engine.render.canvas.style.width = width + 'px';
  engine.render.canvas.style.height = height + 'px';
}

windowEvent('resize')
.startWith(1)
.map($window)
.subscribe($window => resize($window.width(), $window.height()))

windowEvent('mousemove')
.map(e => { return {x: e.pageX, y: e.pageY} })
.subscribe(mouseVec => mousePos = mouseVec);

// create two boxes and a ground
let avatar = Bodies.polygon(400, 200, 3, 30, {
  restitution: 0.25,
  // angle: -0.5 * Math.PI,
  vertices: [{ x: 0, y: 0 }, { x: 25, y: -50 }, { x: 50, y: 0 }]
});
let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

Events.on(engine, 'beforeTick', e => {
  let avatarAngle  = Vector.angle(avatar.position, avatar.vertices[1]);
  let toMouseAngle = Vector.angle(avatar.position, mousePos);
  let diff = toMouseAngle - avatarAngle;

  if (diff > Math.PI) diff = -Math.PI + (diff - Math.PI);
  if (diff < -Math.PI) diff = Math.PI - (-diff - Math.PI);

  rotateClockWise(avatar, diff);
  rotateCounterclockwise(avatar, avatar.angularSpeed / diff);

  // if (diff > 0) {
  //   // rotateClockWise(avatar, force);
  // } else if (diff < 0) {
  //   // rotateCounterclockwise(avatar, force);
  // }
});

let ups    = scheduledKeyStream(UP, frameRate);
let downs  = scheduledKeyStream(DOWN, frameRate);
let lefts  = scheduledKeyStream(LEFT, frameRate);
let rights = scheduledKeyStream(RIGHT, frameRate);
let spaces = scheduledKeyStream(SPACE, 100);

spaces.subscribe(() => {
  let angle = avatar.angle - Math.PI / 2;
  let pos = Vector.add(avatar.position, forceVec(angle, 50));
  World.add(engine.world, Bodies.circle(pos.x, pos.y, 5, {
    restitution: 0.75,
    angle: avatar.angle,
    force: forceTop(avatar.angle, 0.005)
  }));
})
ups.subscribe(() => moveForward(avatar));
downs.subscribe(() => moveBackward(avatar));
lefts.subscribe(() => rotateCounterclockwise(avatar));
rights.subscribe(() => rotateClockWise(avatar));

// add all of the bodies to the world
World.add(engine.world, [avatar, ground]);
engine.world.gravity.y = 0;

// run the engine
Engine.run(engine);

//////////
// var mainCircleCenter = { 'x': window.innerWidth/2, 'y': window.innerHeight/2 };

//  mouse = Bodies.circle(window.innerWidth/2, window.innerHeight/2-150, 30);

//  mainAnchor = Bodies.circle(window.innerWidth/2, window.innerHeight/2, 5);
//  mainAnchor.isStatic = true;
//  mainAnchor.groupId = 8;

// createBalls();

// // function createConstrainteObjObj( ba, bb, stiffness ){
// //  return Constraint.create({ bodyA: ba, bodyB: bb, stiffness: stiffness||0.05 })
// // }

// // function createConstrainteObjPts( ba, pa, stiffness ){
// //  return Constraint.create({ bodyA: ba, pointB: pa, stiffness: stiffness||0.05 })
// // }
