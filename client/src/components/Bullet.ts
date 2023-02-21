import { Physics } from 'phaser';
import { XYPosition } from '../../../types';

export class Bullet extends Physics.Matter.Sprite {
  private speed = 10;
  id = 1;
  constructor(world: Phaser.Physics.Matter.World, x: number, y: number, velocity: XYPosition) {
    super(world, x, y, 'fire-ball');
    const angle = Math.atan2(velocity.y, velocity.x);

    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;
    this.setFriction(0);
    this.setFrictionAir(0);
    this.setBounce(0);

    this.setVelocity(velocityX, velocityY);

    this.setRotation(angle);

    this.anims.play('fire-ball', true);
    this.setCollisionGroup(-1);

    this.setOnCollide(() => {
      this.anims.play('fire-ball-explode', true);
      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.destroy(true);
      });
    });

    world.add(this);
  }

  // update(): void {
  //   this.x += this.velocity.x;
  //   this.y += this.velocity.y;

  //   if (
  //     this.x > this.scene.game.config.width ||
  //     this.x < 0 ||
  //     this.y > this.scene.game.config.height ||
  //     this.y < 0
  //   ) {
  //     console.log('destruction');
  //     this.destroy(true);
  //   }
  // }
}
