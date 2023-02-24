import { Bodies } from 'matter-js';

function createPlayerEntity(x: number, y: number) {
  const body = Bodies.rectangle(x, y, 20, 60, {
    isSensor: true,
    friction: 0,
    frictionAir: 0,
    restitution: 0,
  });

  return body;
}

const config: Matter.IBodyDefinition = {
  isSensor: true,
  friction: 0,
  frictionAir: 0,
  restitution: 0,
};

const PlayerEntity = {
  create: createPlayerEntity,
  config,
};

export { PlayerEntity };
