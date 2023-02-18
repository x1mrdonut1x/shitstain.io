import { Physics, Scene, Types } from 'phaser';

export class Player extends Physics.Arcade.Sprite {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'fireWizard');
  }

  public move() {
    const cursors = this.scene.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.setVelocityX(-160);

      this.anims.play('fire-wizard-walk', true);
      this.flipX = true;
    } else if (cursors.right.isDown) {
      this.setVelocityX(160);

      this.anims.play('fire-wizard-walk', true);
      this.flipX = false;
    } else {
      this.setVelocityX(0);
      this.anims.play('fire-wizard-idle');
    }

    if (cursors.up.isDown) {
      this.setVelocityY(-160);
    } else if (cursors.down.isDown) {
      this.setVelocityY(160);
    } else {
      this.setVelocityY(0);
    }
  }
}
