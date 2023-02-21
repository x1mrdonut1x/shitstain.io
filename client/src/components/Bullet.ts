import { Physics } from 'phaser';
import { XYPosition } from '../../../types';

export class Bullet extends Physics.Matter.Sprite {
  private speed = 10;
  private velocity: XYPosition = { x: 0, y: 0 };

  constructor(world: Phaser.Physics.Matter.World, x: number, y: number, velocity: XYPosition) {
    super(world, x, y, 'fire-ball');
    const angle = Math.atan2(velocity.y, velocity.x);

    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    this.velocity = { x: velocityX, y: velocityY };

    this.setRotation(angle);

    world.add(this);
    this.anims.play('fire-ball', true);
    this.setCollisionGroup(-1);

    // this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
    //   this.destroy(true);
    // });
  }

  update(): void {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (
      this.x > this.scene.game.config.width ||
      this.x < 0 ||
      this.y > this.scene.game.config.height ||
      this.y < 0
    ) {
      console.log('destruction');
      this.destroy(true);
    }
  }
}
