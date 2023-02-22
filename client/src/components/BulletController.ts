import { gameServer } from '@/networking/GameServer';
import { Scene } from 'phaser';
import { XYPosition } from '../../../types';
import { Bullet } from './Bullet';
import { Player } from './Player';

export class BulletController {
  private bullets: Bullet[] = [];
  private timeDelta = 0; //ms
  private shootingSpeed = 100; //ms
  private bulletSpeed = 10;

  private serverVelocity: XYPosition = { x: 0, y: 0 };

  public isShooting = false;

  constructor(
    private scene: Scene,
    private world: Phaser.Physics.Matter.World,
    private player: Player
  ) {
    if (this.player.id === gameServer.clientId) {
      this.scene.input.on('pointerdown', () => {
        this.isShooting = true;
        this.emitShoot(true);
      });

      this.scene.input.on('pointermove', () => {
        if (this.isShooting) this.emitShoot(true);
      });

      this.scene.input.on('pointerup', () => {
        this.isShooting = false;
        this.emitShoot(false);
      });
    }

    gameServer.shoot.on(data => {
      if (data.playerId === player.id) {
        this.isShooting = data.isShooting;
        this.serverVelocity = data.velocity;
      }
    });
  }

  private tryFlipX(x: number) {
    if (this.isShooting) {
      if (x > this.player.x) {
        this.player.flipX = false;
      } else {
        this.player.flipX = true;
      }
    }
  }

  emitShoot(isShooting: boolean) {
    gameServer.shoot.emit({
      playerId: this.player.id,
      isShooting,
      playerPos: {
        x: Math.round(this.player.x),
        y: Math.round(this.player.y),
      },
      velocity: this.getVelocity(),
    });
  }

  shoot(velocity: XYPosition) {
    this.tryFlipX(this.scene.input.mousePointer.worldX);

    const bullet = new Bullet(this.world, this.player.x, this.player.y, velocity);
    this.bullets.push(bullet);

    this.scene.add.existing(bullet);
  }

  private getVelocity() {
    const angle = Math.atan2(
      Math.round(this.scene.input.mousePointer.worldY - this.player.y),
      Math.round(this.scene.input.mousePointer.worldX - this.player.x)
    );

    const velocityX = Math.cos(angle) * this.bulletSpeed;
    const velocityY = Math.sin(angle) * this.bulletSpeed;

    return { x: velocityX, y: velocityY };
  }

  update(delta: number): void {
    this.timeDelta += delta;
    if (this.isShooting && this.timeDelta > this.shootingSpeed) {
      this.timeDelta = 0;

      this.shoot(this.serverVelocity ?? this.getVelocity());
    }

    this.bullets.forEach(bullet => {
      if (!bullet.active) return;
      bullet.update();
    });
  }
}
