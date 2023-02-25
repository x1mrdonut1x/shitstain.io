import { Rectangle } from '../entities/Rectangle';

export class Enemy extends Rectangle {
  private health = 100;

  constructor(x: number, y: number) {
    super(x, y, 50, 50);
  }
}
