import { gameServer } from '@/networking/GameServer';
import { Scene } from 'phaser';
import { Bullet } from './Bullet';
import { Player } from './Player';

export class BulletController {
  private bullets;
  private timeDelta = 0; //ms
  private shootingSpeed = 100; //ms

  public isShooting = false;
  private lastMousePosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(private scene: Scene, private player: Player) {
    this.bullets = scene.add.group({ classType: Bullet, runChildUpdate: true });

    if (this.player.id === gameServer.clientId) {
      this.scene.input.on('pointerdown', (pointer: PointerEvent) => {
        this.lastMousePosition = { x: pointer.x, y: pointer.y };
        this.isShooting = true;

        this.tryFlipX(pointer.x);
      });

      this.scene.input.on('pointermove', (pointer: PointerEvent) => {
        this.lastMousePosition = { x: pointer.x, y: pointer.y };

        this.tryFlipX(pointer.x);
      });

      this.scene.input.on('pointerup', () => {
        this.isShooting = false;
      });
    }

    gameServer.shoot.on(data => {
      if (data.playerId === this.player.id) {
        const bullet = this.bullets.get();

        bullet?.fire(data.x, data.y, data.rotation);
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
    const rotation = Math.atan2(
      this.lastMousePosition.y - this.player.y,
      this.lastMousePosition.x - this.player.x
    );

    gameServer.shoot.emit({
      playerId: this.player.id,
      x: Math.round(this.player.x),
      y: Math.round(this.player.y),
      rotation: rotation,
    });
  }

  update(delta: number): void {
    this.timeDelta += delta;
    if (this.timeDelta > this.shootingSpeed && this.isShooting) {
      this.timeDelta = 0;
      this.shoot();
    }
  }
}
