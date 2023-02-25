import { MovementInput, ShootInput, Vector } from '../../types/objects';

export function useInput() {
  const getMovementFromInput = (input: MovementInput, speed = 0) => {
    const movement: Vector = {
      x: 0,
      y: 0,
    };

    if (input.up) {
      movement.y = -speed;
    }
    if (input.down) {
      movement.y = speed;
    }
    if (input.left) {
      movement.x = -speed;
    }
    if (input.right) {
      movement.x = speed;
    }

    return movement;
  };

  const getMovementTowardsPoint = (input: ShootInput, speed = 0) => {
    const movement: Vector = {
      x: 0,
      y: 0,
    };

    const angle = Math.atan2(input.y, input.x);

    movement.x = Math.cos(angle) * speed;
    movement.y = Math.sin(angle) * speed;

    return movement;
  };

  return { getMovementFromInput, getMovementTowardsPoint };
}
