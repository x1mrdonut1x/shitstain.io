import { Circle } from '../entities/Circle';
import { Vector2 } from '../entities/Vector2';

export class Bullet extends Circle {
  constructor(x: number, y: number, velocity: Vector2) {
    super(x, y, 6);

    this.setVelocity(velocity);
    this.collisionGroup = 'player';
  }
}
