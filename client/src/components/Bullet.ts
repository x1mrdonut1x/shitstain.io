import { Physics, Scene } from 'phaser';

export class Bullet extends Physics.Arcade.Sprite {
  private speed = 10;
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'fire-ball');
    scene.physics.add.existing(this);
  }

  fire(x: number, y: number, rotation: number) {
    this.setPosition(x, y);
    this.setRotation(rotation);
    this.anims.play('fire-ball', true);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy(true);
    });
  }

  // TODO this is currently fucked up because it takes the game delta, not tick rate. Will shoot faster/slower depending on FPS
  update(): void {
    this.x += Math.cos(this.rotation) * this.speed;
    this.y += Math.sin(this.rotation) * this.speed;

    if (
      this.x > this.scene.game.config.width ||
      this.x < 0 ||
      this.y > this.scene.game.config.height ||
      this.y < 0
    ) {
      this.destroy(true);
    }
  }
}
