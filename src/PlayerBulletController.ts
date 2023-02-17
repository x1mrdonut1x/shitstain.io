import * as PIXI from 'pixi.js';
import { Container } from 'pixi.js';

export class PlayerBulletController {
  private readonly stage: Container;
  private readonly player: PIXI.Sprite;
  private readonly bullets: Set<PIXI.Sprite> = new Set();
  private shootingSpeed: number = 200; //ms
  private timeDelta: number = 0; //ms
  private bulletSpeed: number = 5;
  private isShooting: boolean = false;

  private lastMousePosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(stage: Container, player: PIXI.Sprite) {
    this.stage = stage;
    this.player = player;

    this.stage.addEventListener('mousedown', e => {
      this.setIsShooting.bind(this)(true);
      this.lastMousePosition = { x: e.global.x, y: e.global.y };
    });

    this.stage.addEventListener('mouseup', () => {
      this.setIsShooting.bind(this)(false);
    });

    this.stage.addEventListener('mousemove', e => {
      this.lastMousePosition = { x: e.global.x, y: e.global.y };
    });
  }

  private setIsShooting(isShooting: boolean) {
    this.isShooting = isShooting;
  }

  private shoot(position: { x: number; y: number }) {
    const bullet = new PIXI.Sprite(PIXI.Texture.WHITE);
    const playerPos = this.player.position;
    bullet.width = 10;
    bullet.height = 10;
    bullet.position.x = playerPos.x;
    bullet.position.y = playerPos.y;

    const temp = Math.atan2(position.y - playerPos.y, position.x - playerPos.x);

    bullet.rotation = temp;
    this.stage?.addChild(bullet);
    this.bullets.add(bullet);
  }

  public update(_delta: number, elapsed: number) {
    this.timeDelta += elapsed;

    if (this.timeDelta > this.shootingSpeed && this.isShooting) {
      this.timeDelta = 0;
      this.shoot(this.lastMousePosition);
    }

    for (const bullet of this.bullets) {
      bullet.position.x += Math.cos(bullet.rotation) * this.bulletSpeed;
      bullet.position.y += Math.sin(bullet.rotation) * this.bulletSpeed;
    }

    for (const bullet of this.bullets) {
      if (
        bullet.position.x > document.body.clientWidth ||
        bullet.position.x < 0 ||
        bullet.position.y > document.body.clientHeight ||
        bullet.position.y < 0
      ) {
        bullet.destroy();
        this.bullets.delete(bullet);
      }
    }
  }
}
