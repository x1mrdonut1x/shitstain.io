import { Physics, Scene } from 'phaser';
import { ServerMovement } from '../../../types';
import { gameServer } from '../networking/GameServer';
import { isEqual } from 'lodash';

export class Player extends Physics.Arcade.Sprite {
  private movement: ServerMovement = {
    left: false,
    right: false,
    up: false,
    down: false,
    dx: 0,
    dy: 0,
  };

  constructor(scene: Scene, x: number, y: number, public id: string) {
    super(scene, x, y, 'fireWizard');

    scene.physics.add.existing(this);
    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
  }

  public setMovement(movement?: ServerMovement) {
    if (movement) {
      this.movement = movement;
    }
  }

  public move() {
    if (this.movement.left) {
      this.anims.play('fire-wizard-walk', true);
      this.flipX = true;
    } else if (this.movement.right) {
      this.anims.play('fire-wizard-walk', true);
      this.flipX = false;
    } else {
      this.anims.play('fire-wizard-idle');
    }

    this.setVelocityX(this.movement.dx || 0);
    this.setVelocityY(this.movement.dy || 0);

    if (this.id === gameServer.clientId) {
      const cursors = this.scene.input.keyboard.createCursorKeys();
      const movement: ServerMovement = {};

      if (cursors.left.isDown) {
        movement.left = true;
        movement.right = false;
        movement.dx = -160;
      } else if (cursors.right.isDown) {
        movement.left = false;
        movement.right = true;
        movement.dx = 160;
      } else {
        movement.left = false;
        movement.right = false;
        movement.dx = 0;
      }

      if (cursors.up.isDown) {
        movement.up = true;
        movement.down = false;
        movement.dy = -160;
      } else if (cursors.down.isDown) {
        movement.up = false;
        movement.down = true;
        movement.dy = 160;
      } else {
        movement.up = false;
        movement.down = false;
        movement.dy = 0;
      }

      if (!isEqual(movement, this.movement)) {
        // console.log(movement);
        gameServer.movePlayer(movement);
      }
    }
  }
}
