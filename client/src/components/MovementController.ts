import { Scene } from 'phaser';
import { ServerPlayer } from '../../../types';
import { gameServer } from '../networking/GameServer';
import { cloneDeep, isEqual } from 'lodash';
import { Player } from './Player';

interface Keys {
  [keyCode: string]: {
    key: Phaser.Input.Keyboard.Key;
    onDown: () => void;
    onUp: () => void;
  };
}

const defaultMovement: Omit<ServerPlayer, 'clientId'> = {
  x: 0,
  y: 0,
  speed: 4,
  move: {
    left: false,
    right: false,
    up: false,
    down: false,
  },
};

export class MovementController {
  private localPosition = cloneDeep(defaultMovement);
  private serverPosition = cloneDeep(defaultMovement);
  private readonly speed = 4;
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
          this.localPosition.move.up = false;
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
          this.localPosition.move.down = false;
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
          this.localPosition.move.left = false;
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
          this.localPosition.move.right = false;
        }
      },
    };
  }

  private onMoveRight() {
    this.localPosition.move.left = false;
    this.localPosition.move.right = true;
    this.player.flipX = false;
  }

  private onMoveLeft() {
    this.localPosition.move.left = true;
    this.localPosition.move.right = false;
    this.player.flipX = true;
  }

  private onMoveUp() {
    this.localPosition.move.up = true;
    this.localPosition.move.down = false;
  }

  private onMoveDown() {
    this.localPosition.move.up = false;
    this.localPosition.move.down = true;
  }

  public updatePositionFromServer(position: Omit<ServerPlayer, 'clientId'>) {
    this.serverPosition = position;

    // TODO this makes the player lag
    // this.player.x = Phaser.Math.Linear(this.player.x, position.x, 0.8);
    // this.player.y = Phaser.Math.Linear(this.player.y, position.y, 0.8);
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

    this.player.setVelocityX(
      this.serverPosition.move.right ? this.speed : this.serverPosition.move.left ? -this.speed : 0
    );
    this.player.setVelocityY(
      this.serverPosition.move.up ? -this.speed : this.serverPosition.move.down ? this.speed : 0
    );

    if (!isEqual(this.localPosition.move, this.serverPosition.move)) {
      this.player.flipX = this.localPosition.move.left || this.serverPosition.move.left;
    }

    this.player.isMoving = this.player.body.velocity.y !== 0 || this.player.body.velocity.x !== 0;

    if (this.player.id === gameServer.clientId) {
      if (!isEqual(this.localPosition.move, this.serverPosition.move)) {
        gameServer.movePlayer.emit({ movement: this.localPosition.move });
      }
    }
  }
}
