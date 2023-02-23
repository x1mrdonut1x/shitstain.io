import { gameServer } from '@/networking/GameServer';
import { Scene } from 'phaser';
import { ServerShootData, XYPosition } from '../../../types';
import { Bullet } from './Bullet';
import { Player } from './Player';

export class BulletController {
  private bullets: Bullet[] = [];
  private lastShotAt = 0; //ms
  private shootingSpeed = 150; //ms

  private serverStep?: ServerShootData;

  public isShooting = false;

  constructor(
    private scene: Scene,
    private world: Phaser.Physics.Matter.World,
    private player: Player
  ) {
    if (this.player.isLocalPlayer) {
      this.scene.input.on('pointerdown', () => {
        this.isShooting = true;
        this.emitShoot();
        this.shoot();
      });

      this.scene.input.on('pointermove', () => {
        if (this.isShooting) {
          this.emitShoot();
          this.shoot();
        }
      });

      this.scene.input.on('pointerup', () => {
        this.isShooting = false;
        this.emitShoot();
        this.shoot();
      });
    }

    gameServer.shoot.on(data => {
      if (data.clientId !== player.id) return;

      this.isShooting = data.isShooting;
      this.serverStep = data;
      // TODO the first argument should be data.playerPos to have the correct starting point
      this.shoot(this.player, this.getVelocity(data.mousePos));
    });
  }

  private tryFlipX() {
    if (this.isShooting) {
      if (this.player.isLocalPlayer) {
        this.player.flipX = this.scene.input.mousePointer.worldX < 0;
      } else {
        this.player.flipX =
          (this.serverStep?.mousePos.x || 0) > (this.serverStep?.playerPos.x || 0);
      }
    }
  }

  emitShoot() {
    gameServer.shoot.emit({
      isShooting: this.isShooting,
      playerPos: {
        x: this.player.x,
        y: this.player.y,
      },
      mousePos: {
        x: this.scene.input.mousePointer.worldX,
        y: this.scene.input.mousePointer.worldY,
      },
    });
  }

  shoot(
    startPos: XYPosition = this.player,
    velocity: XYPosition = this.getVelocity({
      x: this.scene.input.mousePointer.worldX,
      y: this.scene.input.mousePointer.worldY,
    })
  ) {
    const now = Date.now();
    const delta = now - this.lastShotAt;

    if (delta < this.shootingSpeed) return;

    this.tryFlipX();

    const bullet = new Bullet(this.world, startPos.x, startPos.y, velocity);
    this.bullets.push(bullet);

    this.scene.add.existing(bullet);
    this.lastShotAt = Date.now();
  }

  private getVelocity(
    data: XYPosition = {
      x: this.scene.input.mousePointer.worldX,
      y: this.scene.input.mousePointer.worldY,
    }
  ) {
    const angle = Math.atan2(
      Math.round(data.y - this.player.y),
      Math.round(data.x - this.player.x)
    );

    const velocityX = Math.cos(angle) * this.player.bulletSpeed;
    const velocityY = Math.sin(angle) * this.player.bulletSpeed;

    return { x: velocityX, y: velocityY };
  }

  update() {
    if (this.isShooting) {
      this.shoot(
        {
          x: this.player.x,
          y: this.player.y,
        },
        this.getVelocity(this.serverStep?.mousePos)
      );
    }

    this.bullets.forEach(bullet => {
      if (!bullet.active) return;
      bullet.update();
    });
  }
}
