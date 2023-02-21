import { gameServer } from '@/networking/GameServer';
import { Scene } from 'phaser';
import { Bullet } from './Bullet';
import { Player } from './Player';

export class BulletController {
  private bullets: Bullet[] = [];
  private timeDelta = 0; //ms
  private shootingSpeed = 100; //ms

  public isShooting = false;

  constructor(
    private scene: Scene,
    world: Phaser.Physics.Matter.World,
    private player: Player
  ) {
    if (this.player.id === gameServer.clientId) {
      this.scene.input.on('pointerdown', () => {
        this.isShooting = true;
      });

      this.scene.input.on('pointerup', () => {
        this.isShooting = false;
      });
    }

    gameServer.shoot.on(data => {
      if (data.playerId === player.id) {
        const bullet = new Bullet(world, player.x, player.y, data.velocity);
        this.bullets.push(bullet);

        this.scene.add.existing(bullet);
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

  shoot() {
    this.tryFlipX(this.scene.input.mousePointer.worldX);

    gameServer.shoot.emit({
      playerId: this.player.id,
      x: Math.round(this.player.x),
      y: Math.round(this.player.y),
      velocity: {
        x: Math.round(this.scene.input.mousePointer.worldX - this.player.x),
        y: Math.round(this.scene.input.mousePointer.worldY - this.player.y),
      },
    });
  }

  update(delta: number): void {
    this.timeDelta += delta;
    if (this.timeDelta > this.shootingSpeed && this.isShooting) {
      this.timeDelta = 0;
      this.shoot();
    }

    this.bullets.forEach(bullet => {
      if (!bullet.active) return;
      bullet.update();
    });
  }
}
