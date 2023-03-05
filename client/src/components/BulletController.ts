import { gameServer } from '@/networking/GameServer';
import { ServerShootData } from '../../../shared/types';
import { Bullet } from './Bullet';
import * as PIXI from 'pixi.js';
import { Player } from './Player';
import { PointerController } from './input-controllers/PointerController';
import { Vector2 } from '../../../engine/entities/Vector2';

export class BulletController {
  private mousePos: Vector2 = { x: 0, y: 0 };
  private pointerController?: PointerController;
  private serverStep?: ServerShootData;
  public isShooting = false;

  constructor(private stage: PIXI.Container, private player: Player) {
    if (this.player.isLocalPlayer) {
      this.pointerController = new PointerController(stage, player);
      this.pointerController.setOnChange((isShooting, position) => {
        this.mousePos = position;

        if (isShooting || (this.isShooting && !isShooting)) this.emitShoot(isShooting);
        this.isShooting = isShooting;
      });
    }

    gameServer.shoot.on(data => {
      if (data.clientId !== player.id) return;

      if (!this.player.isLocalPlayer) {
        console.log(data);
        this.isShooting = data.isShooting;
      }

      this.serverStep = data;
    });
  }

  emitShoot(isShooting: boolean) {
    gameServer.shoot.emit({
      isShooting: isShooting,
      playerPos: {
        x: this.player.x,
        y: this.player.y,
      },
      mousePos: this.mousePos,
    });
  }

  shoot() {
    const velocity = this.getVelocity(this.serverStep?.mousePos);

    //TODO this should not be created if player cannot shoot
    const bullet = new Bullet(
      this.player.x,
      this.player.y,
      velocity,
      velocity.angle,
      `${this.player.id}_${this.player.bullets.size + 1}_${Math.random() * 100}`
    );

    if (this.player.shoot(bullet) && bullet.sprite) {
      this.stage.addChild(bullet.sprite);
    }
  }

  private getVelocity(data: Vector2 = this.mousePos) {
    const xRelativeToPlayer = data.x;
    const yRelativeToPlayer = data.y;

    const angle = Math.atan2(yRelativeToPlayer, xRelativeToPlayer);

    const velocityX = Math.cos(angle) * this.player.bulletSpeed;
    const velocityY = Math.sin(angle) * this.player.bulletSpeed;

    return { x: velocityX, y: velocityY, angle };
  }

  update() {
    if (this.isShooting) {
      this.shoot();
    }
  }
}
