import { gameServer } from '@/networking/GameServer';
import { ServerShootData, XYPosition } from '../../../shared/types';
import { Bullet } from './Bullet';
import * as PIXI from 'pixi.js';
import { Player } from './Player';

export class BulletController {
  private bullets: Bullet[] = [];
  private lastShotAt = 0; //ms
  private shootingSpeed = 150; //ms
  private mousePos: XYPosition = { x: 0, y: 0 };

  private serverStep?: ServerShootData;

  public isShooting = false;

  constructor(private stage: PIXI.Container, private player: Player) {
    if (this.player.isLocalPlayer) {
      this.stage.addEventListener('pointerdown', e => {
        this.mousePos = {
          x: e.x - this.player.position.x + stage.pivot.x,
          y: e.y - this.player.position.y + stage.pivot.y,
        };
        this.isShooting = true;
        this.emitShoot();
        this.shoot();
      });

      this.stage.addEventListener('pointermove', e => {
        this.mousePos = {
          x: e.x - this.player.position.x + stage.pivot.x,
          y: e.y - this.player.position.y + stage.pivot.y,
        };

        if (this.isShooting) {
          this.emitShoot();
          this.shoot();
        }
      });

      this.stage.addEventListener('pointerup', () => {
        this.isShooting = false;
        this.emitShoot();
        this.shoot();
      });
    }

    gameServer.shoot.on(data => {
      if (data.clientId !== player.id) return;
      if (!this.player.isLocalPlayer) this.isShooting = data.isShooting;

      this.serverStep = data;
      this.shoot(data.mousePos);
    });
  }

  emitShoot() {
    gameServer.shoot.emit({
      isShooting: this.isShooting,
      playerPos: {
        x: this.player.position.x,
        y: this.player.position.y,
      },
      mousePos: this.mousePos,
    });
  }

  shoot(mouse = this.mousePos) {
    const now = Date.now();
    const delta = now - this.lastShotAt;

    if (delta < this.shootingSpeed) return;

    const bullet = new Bullet(
      this.stage,
      this.player.position.x,
      this.player.position.y,
      this.getVelocity(mouse)
    );

    this.bullets.push(bullet);
    this.stage.addChild(bullet.sprite);

    this.lastShotAt = now;
  }

  private getVelocity(data: XYPosition = this.mousePos) {
    const xRelativeToPlayer = data.x;
    const yRelativeToPlayer = data.y;

    const angle = Math.atan2(yRelativeToPlayer, xRelativeToPlayer);

    const velocityX = Math.cos(angle) * this.player.bulletSpeed;
    const velocityY = Math.sin(angle) * this.player.bulletSpeed;

    return { x: velocityX, y: velocityY };
  }

  update(dt: number) {
    if (this.isShooting) {
      this.shoot(this.serverStep?.mousePos);
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const { position, radius } = this.bullets[i];

      if (
        position.x + radius > this.stage.width ||
        position.x - radius < 0 ||
        position.y + radius > this.stage.height ||
        position.y - radius < 0
      ) {
        this.bullets[i].sprite.destroy();
        this.bullets.splice(i, 1);
      } else {
        this.bullets[i].update(dt);
      }
    }
  }
}
