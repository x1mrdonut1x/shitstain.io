import { BulletController } from '../../client/src/components/BulletController';
import { MovementController } from '../../client/src/components/MovementController';
import { ServerMovement } from '../../shared/types';
import { Rectangle } from '../entities/Rectangle';

export class Player extends Rectangle {
  protected bulletController?: BulletController;
  protected movementController?: MovementController;
  public isMoving = false;
  public bulletSpeed = 10;
  public speed = 200;

  constructor(x: number, y: number, public id: string) {
    super(x, y, 60, 60);
  }

  public setVelocityFromMovement(movement: ServerMovement) {
    const { left, right, up, down } = movement;
    let velocityY = 0;
    let velocityX = 0;

    if (up) {
      velocityY = -this.speed;
    }
    if (down) {
      velocityY = this.speed;
    }
    if (left) {
      velocityX = -this.speed;
    }
    if (right) {
      velocityX = this.speed;
    }

    this.velocity.x = velocityX;
    this.velocity.y = velocityY;
  }
}
