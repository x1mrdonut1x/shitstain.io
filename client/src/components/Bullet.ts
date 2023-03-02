import * as PIXI from 'pixi.js';
import { Vector2 } from '../../../engine/entities/Vector2';
import { Bullet as EngineBullet } from '../../../engine/components/Bullet';
import attack from '../assets/wizards/fire-wizard/Charge/charge.json?url';

export class Bullet extends EngineBullet {
  public sprite?: PIXI.AnimatedSprite;

  constructor(x: number, y: number, velocity: Vector2, angle: number) {
    super(x, y, velocity);

    this.animate(x, y, angle);
  }

  private animate(x: number, y: number, angle: number) {
    const { animations } = PIXI.Assets.cache.get(attack);
    this.sprite = new PIXI.AnimatedSprite(animations['Charge'].slice(0, 5));

    this.sprite.animationSpeed = 1 / 4;
    this.sprite.position.set(x, y);
    this.sprite.anchor.set(0.9, 0.5);
    this.sprite.rotation = angle;
    this.sprite.play();

    this.onCollide = () => {
      this.isStatic = true;
      this.isActive = false;

      if (!this.sprite) return;

      this.sprite.textures = animations['Charge'].slice(5);
      this.sprite.gotoAndPlay(0);
      this.sprite.loop = false;
      this.sprite.onComplete = () => {
        this.sprite?.destroy();
      };
    };
  }

  destroy() {
    //
  }

  update(dt: number) {
    super.update(dt);

    this.sprite?.position.set(this.x, this.y);
  }
}
