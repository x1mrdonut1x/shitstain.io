import { Physics, Scene } from 'phaser';
import { XYPosition } from '../../../types';

export class Bullet extends Physics.Arcade.Sprite {
  private speed = 400;
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'fire-ball');
    scene.physics.add.existing(this);
  }

  fire(x: number, y: number, velocity: XYPosition) {
    const angle = Math.atan2(velocity.y, velocity.x);

    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    this.setPosition(x, y);
    this.setRotation(angle);
    this.setVelocity(velocityX, velocityY);

    this.anims.play('fire-ball', true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy(true);
    });
  }
}
