import { Scene } from 'phaser';
import { ServerMovement } from '../../../types';
import { gameServer } from '../networking/GameServer';
import { isEqual } from 'lodash';
import { Player } from './Player';

interface Keys {
  [keyCode: string]: {
    key: Phaser.Input.Keyboard.Key;
    onDown: () => void;
    onUp: () => void;
  };
}

const defaultMovement: ServerMovement = {
  left: false,
  right: false,
  up: false,
  down: false,
  dx: 0,
  dy: 0,
};

export class MovementController {
  private localMovement = { ...defaultMovement };
  private serverMovement = { ...defaultMovement };
  private readonly speed = 400;
  private readonly keys: Keys = {};

  constructor(private scene: Scene, private player: Player) {
    if (this.player.id === gameServer.clientId) {
      this.initKeyboard();
    }
  }

  private initKeyboard() {
    this.keys['W'] = {
      key: this.scene.input.keyboard.addKey('W'),
      onDown: () => this.onMoveUp(),
      onUp: () => {
        if (this.keys['S'].key.isDown) {
          this.onMoveDown();
        } else {
          this.localMovement.dy = 0;
        }
      },
    };

    this.keys['S'] = {
      key: this.scene.input.keyboard.addKey('S'),
      onDown: () => this.onMoveDown(),
      onUp: () => {
        if (this.keys['W'].key.isDown) {
          this.onMoveUp();
        } else {
          this.localMovement.dy = 0;
        }
      },
    };

    this.keys['A'] = {
      key: this.scene.input.keyboard.addKey('A'),
      onDown: () => this.onMoveLeft(),
      onUp: () => {
        if (this.keys['D'].key.isDown) {
          this.onMoveRight();
        } else {
          this.localMovement.dx = 0;
        }
      },
    };

    this.keys['D'] = {
      key: this.scene.input.keyboard.addKey('D'),
      onDown: () => this.onMoveRight(),
      onUp: () => {
        if (this.keys['A'].key.isDown) {
          this.onMoveLeft();
        } else {
          this.localMovement.dx = 0;
        }
      },
    };
  }

  private onMoveRight() {
    this.localMovement.left = false;
    this.localMovement.right = true;
    this.localMovement.dx = this.speed;
    this.player.flipX = false;
  }

  private onMoveLeft() {
    this.localMovement.left = true;
    this.localMovement.right = false;
    this.localMovement.dx = -this.speed;
    this.player.flipX = true;
  }

  private onMoveUp() {
    this.localMovement.up = true;
    this.localMovement.down = false;
    this.localMovement.dy = -this.speed;
  }

  private onMoveDown() {
    this.localMovement.up = false;
    this.localMovement.down = true;
    this.localMovement.dy = this.speed;
  }

  public setMovement(movement: ServerMovement) {
    this.serverMovement = movement;
  }

  public update() {
    Object.keys(this.keys).forEach(key => {
      const entry = this.keys[key];

      if (Phaser.Input.Keyboard.JustDown(entry.key)) {
        entry.onDown();
      } else if (Phaser.Input.Keyboard.JustUp(entry.key)) {
        entry.onUp();
      }
    });

    this.player.setVelocityX(this.serverMovement.dx || 0);
    this.player.setVelocityY(this.serverMovement.dy || 0);

    if (this.player.id === gameServer.clientId) {
      if (!isEqual(this.localMovement, this.serverMovement)) {
        gameServer.movePlayer.emit({ movement: this.localMovement });
      }
    }
  }
}
