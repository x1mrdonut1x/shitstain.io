import * as PIXI from 'pixi.js';
import { Container } from 'pixi.js';
import { Player } from './Player';

export class PlayerBulletController {
  private readonly stage: Container;
  private readonly player: Player;
  private readonly bullets: { sprite: PIXI.Sprite; velocity: { x: number; y: number } }[] = [];
  private shootingSpeed: number = 100; //ms
  private timeDelta: number = 0; //ms
  private bulletSpeed: number = 7;
  private isShooting: boolean = false;

  private lastMousePosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(stage: Container, player: Player) {
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
    this.bullets.push({ sprite: bullet, velocity: { ...this.player.velocity } });
  }

  public update(_delta: number, elapsed: number) {
    this.timeDelta += elapsed;

    if (this.timeDelta > this.shootingSpeed && this.isShooting) {
      this.timeDelta = 0;
      this.shoot(this.lastMousePosition);
    }

    // update bullet position
    for (const bullet of this.bullets) {
      const { position, rotation } = bullet.sprite;

      position.x += Math.cos(rotation) * this.bulletSpeed + bullet.velocity.x / this.bulletSpeed;
      position.y += Math.sin(rotation) * this.bulletSpeed + bullet.velocity.y / this.bulletSpeed;
    }

    // delete bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const { position } = this.bullets[i].sprite;
      if (
        position.x > document.body.clientWidth ||
        position.x < 0 ||
        position.y > document.body.clientHeight ||
        position.y < 0
      ) {
        this.bullets[i].sprite.destroy();
        this.bullets.splice(i, 1);
      }
    }
  }
}
