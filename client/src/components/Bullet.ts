import * as PIXI from 'pixi.js';
import { Vector2 } from '../../../engine/entities/Vector2';
import { Bullet as EngineBullet } from '../../../engine/components/Bullet';

export class Bullet extends EngineBullet {
  public sprite: PIXI.Sprite;

  constructor(x: number, y: number, velocity: Vector2, angle: number) {
    super(x, y, velocity);

    const animations = PIXI.Assets.cache.get('src/assets/wizards/fire-wizard/Charge/charge.json')
      .data.animations;
    const firingAnimation = PIXI.AnimatedSprite.fromFrames(animations['Charge'].slice(0, 5));

    firingAnimation.animationSpeed = 1 / 4; // 6 fps
    firingAnimation.position.set(x, y);
    firingAnimation.rotation = angle;
    firingAnimation.play();
    this.sprite = firingAnimation;

    // this.onCollide = () => {
    //   const explodingAnimation = PIXI.AnimatedSprite.fromFrames(animations['Charge'].slice(5));
    // };
  }

  update(dt: number) {
    super.update(dt);

    this.sprite.position.set(this.x, this.y);
  }
}
