import { ServerMovement } from '../../shared/types';
import { Rectangle } from '../entities/Rectangle';

export class Player extends Rectangle {
  public isMoving = false;
  public bulletSpeed = 700;
  public shootingSpeed = 120;
  public speed = 200;
  public movement: ServerMovement = { left: false, right: false, up: false, down: false };

  constructor(x: number, y: number, public id: string) {
    super(x, y, 40, 60);
  }

  public setVelocityFromMovement(movement: ServerMovement) {
    this.movement = { ...movement };
    const { left, right, up, down } = this.movement;
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
