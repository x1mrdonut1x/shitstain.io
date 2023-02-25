import { Circle } from '../../../engine/entities/Circle';
import * as PIXI from 'pixi.js';
import { Vector2 } from '../../../engine/entities/Vector2';

export class Bullet extends Circle {
  public sprite: PIXI.Graphics;

  constructor(stage: PIXI.Container, x: number, y: number, velocity: Vector2) {
    super(x, y, 6);

    this.setVelocity(velocity);

    this.sprite = new PIXI.Graphics();
    this.sprite.lineStyle(1, 0xffffff);
    this.sprite.drawCircle(0, 0, 10);
    this.sprite.endFill();

    this.sprite.position.set(x, y);
  }

  update(dt: number) {
    super.update(dt);
    this.sprite.position.set(this.position.x, this.position.y);
  }
}
