import * as PIXI from 'pixi.js';
import { Vector2 } from '../../../engine/entities/Vector2';
import { Bullet as EngineBullet } from '../../../engine/components/Bullet';

export class Bullet extends EngineBullet {
  public sprite: PIXI.Graphics;

  constructor(x: number, y: number, velocity: Vector2) {
    super(x, y, velocity);

    this.sprite = new PIXI.Graphics();
    this.sprite.lineStyle(1, 0xffffff);
    this.sprite.drawCircle(0, 0, 10);
    this.sprite.endFill();

    this.sprite.position.set(x, y);
  }

  update(dt: number) {
    super.update(dt);

    this.sprite.position.set(this.x, this.y);
  }
}
