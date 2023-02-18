import { gameServer } from '@/networking/GameServer';
import { Scene } from 'phaser';
import { Bullet } from './Bullet';
import { Player } from './Player';

export class BulletController {
  private bullets;
  private timeDelta: number = 0; //ms
  private shootingSpeed: number = 100; //ms

  private isShooting = false;
  private lastMousePosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(private scene: Scene, private player: Player) {
    this.bullets = scene.add.group({ classType: Bullet, runChildUpdate: true });

    if (this.player.id === gameServer.clientId) {
      this.scene.input.on('pointerdown', (pointer: PointerEvent) => {
        this.lastMousePosition = { x: pointer.x, y: pointer.y };
        this.isShooting = true;
      });

      this.scene.input.on('pointermove', (pointer: PointerEvent) => {
        this.lastMousePosition = { x: pointer.x, y: pointer.y };
      });

      this.scene.input.on('pointerup', (pointer: PointerEvent) => {
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

  updateBullets(delta: number): void {
    this.timeDelta += delta;
    if (this.timeDelta > this.shootingSpeed && this.isShooting) {
      this.timeDelta = 0;
      this.shoot();
    }
  }
}
