import { gameServer } from '@/networking/GameServer';
import { Scene } from 'phaser';
import { ServerShootData, XYPosition } from '../../../types';
import { Bullet } from './Bullet';
import { Player } from './Player';

export class BulletController {
  private bullets: Bullet[] = [];
  private lastShotAt = 0; //ms
  private shootingSpeed = 150; //ms
  private mousePos: XYPosition = { x: 0, y: 0 };

  private serverStep?: ServerShootData;

  public isShooting = false;

  constructor(
    private scene: Scene,
    private world: Phaser.Physics.Matter.World,
    private player: Player
  ) {
    if (this.player.isLocalPlayer) {
      this.scene.input.on('pointerdown', (event: Phaser.Input.Pointer) => {
        console.log('mouse', event.worldX, event.worldY);
        console.log('player', this.player.x, this.player.y);
        console.log('parsed', event.worldX - this.player.x, event.worldY - this.player.y);

        this.mousePos = { x: event.worldX - this.player.x, y: event.worldY - this.player.y };
        this.isShooting = true;
        this.emitShoot();
        this.shoot();
      });

      this.scene.input.on('pointermove', (event: Phaser.Input.Pointer) => {
        this.mousePos = { x: event.worldX - this.player.x, y: event.worldY - this.player.y };
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
      if (!this.player.isLocalPlayer) this.isShooting = data.isShooting;

      this.serverStep = data;
      // TODO the first argument should be data.playerPos to have the correct starting point
      this.shoot(this.player, this.getVelocity(data.mousePos));
    });
  }

  private tryFlipX() {
    if (this.isShooting) {
      if (this.player.isLocalPlayer) {
        this.player.flipX = this.mousePos.x < 0;
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
      mousePos: this.mousePos,
    });
  }

  shoot(startPos: XYPosition = this.player, velocity: XYPosition = this.getVelocity()) {
    const now = Date.now();
    const delta = now - this.lastShotAt;

    if (delta < this.shootingSpeed) return;

    this.tryFlipX();

    const bullet = new Bullet(this.world, startPos.x, startPos.y, velocity);
    this.bullets.push(bullet);

    this.scene.add.existing(bullet);
    this.lastShotAt = Date.now();
  }

  private getVelocity(data: XYPosition = this.mousePos) {
    const xRelativeToPlayer = data.x;
    const yRelativeToPlayer = data.y;

    const angle = Math.atan2(yRelativeToPlayer, xRelativeToPlayer);

    const velocityX = Math.cos(angle) * this.player.bulletSpeed;
    const velocityY = Math.sin(angle) * this.player.bulletSpeed;

    return { x: velocityX, y: velocityY };
  }

  update() {
    if (this.isShooting) {
      this.shoot(this.player, this.getVelocity(this.serverStep?.mousePos));
    }

    this.bullets.forEach(bullet => {
      if (!bullet.active) return;
      bullet.update();
    });
  }
}
