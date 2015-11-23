const { Matter: { Body, Vector } } = require('matter-js');

const rotationForce = 1;
const defaultMoveForce = 0.0025;

export const forceVec = (angle, force) => {
  return Vector.mult({ x: Math.cos(angle), y: Math.sin(angle) }, force);
}

export const forceLeft = (angle, koef = 1) => {
  let forceAngle = angle + Math.PI;
  return Vector.mult(forceVec(forceAngle, rotationForce), koef);
}

export const forceRight = (angle, koef = 1) => {
  let forceAngle = angle;
  return Vector.mult(forceVec(forceAngle, rotationForce), koef);
}

export const forceTop = (angle, force = defaultMoveForce) => {
  let forceAngle = angle - Math.PI / 2;
  return forceVec(forceAngle, force);
}

export const forceBottom = (angle) => {
  let forceAngle = angle + Math.PI / 2;
  return forceVec(forceAngle, 0.0025);
}

export const moveForward = (avatar) =>
  Body.applyForce(avatar, avatar.vertices[1], forceTop(avatar.angle));

export const moveBackward = (avatar) =>
  Body.applyForce(avatar, avatar.vertices[1], forceBottom(avatar.angle));

export const rotateClockWise = (avatar, koef = 1) => {
  Body.applyForce(avatar, avatar.vertices[1], forceRight(avatar.angle, koef));
  Body.applyForce(avatar, avatar.vertices[2], forceLeft(avatar.angle, koef));
}

export const rotateCounterclockwise = (avatar, koef = 1) => {
  Body.applyForce(avatar, avatar.vertices[1], forceLeft(avatar.angle, koef));
  Body.applyForce(avatar, avatar.vertices[0], forceRight(avatar.angle, koef));
}
