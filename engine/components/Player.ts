import { BulletController } from '../../client/src/components/BulletController';
import { MovementController } from '../../client/src/components/MovementController';
import { Rectangle } from '../entities/Rectangle';

export class Player extends Rectangle {
  protected bulletController?: BulletController;
  protected movementController?: MovementController;
  public isMoving = false;
  public bulletSpeed = 10;

  constructor(x: number, y: number, public id: string) {
    super(x, y, 60, 60);
  }
}
