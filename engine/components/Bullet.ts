import { EntityId } from '../../shared/types';
import { Circle } from '../entities/Circle';
import { Vector2 } from '../entities/Vector2';

export class Bullet extends Circle {
  public readonly damage = 10;

  constructor(x: number, y: number, velocity: Vector2, id: EntityId) {
    super(x, y, 6, id);

    this.setVelocity(velocity);
    this.collisionGroup = 'player';
  }

  public onCollide() {
    this.destroy();
    this.isStatic = true;
    this.collisionGroup = undefined;
  }
}
