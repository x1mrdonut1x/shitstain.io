import * as PIXI from 'pixi.js';
import { Vector2 } from '../../../engine/entities/Vector2';
import { Bullet as EngineBullet } from '../../../engine/components/Bullet';
import attack from '../assets/wizards/fire-wizard/Charge/charge.json?url';

export class Bullet extends EngineBullet {
  public sprite: PIXI.Sprite;

  constructor(x: number, y: number, velocity: Vector2, angle: number) {
    super(x, y, velocity);

    const animations = PIXI.Assets.cache.get(attack).data.animations;
    const firingAnimation = PIXI.AnimatedSprite.fromFrames(animations['Charge'].slice(0, 5));

    firingAnimation.animationSpeed = 1 / 4; // 6 fps
    firingAnimation.position.set(x, y);
    firingAnimation.anchor.set(0.9, 0.5);
    firingAnimation.rotation = angle;
    firingAnimation.play();
    this.sprite = firingAnimation;
  }

  update(dt: number) {
    super.update(dt);

    this.sprite.position.set(this.x, this.y);
  }
}
