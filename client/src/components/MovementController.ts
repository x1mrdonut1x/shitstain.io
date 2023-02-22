import { Scene } from 'phaser';
import { ServerPlayer } from '../../../types';
import { gameServer } from '../networking/GameServer';
import { cloneDeep, isEqual } from 'lodash';
import { Player } from './Player';
import { KeyboardController } from './KeyboardController';

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
  private serverPosition = cloneDeep(defaultMovement);
  private keyboardController: KeyboardController | undefined;
  private readonly speed = 4;

  constructor(private scene: Scene, private player: Player) {
    if (this.player.id === gameServer.clientId) {
      this.keyboardController = new KeyboardController(scene);
    }

    this.serverPosition.x = this.player.x;
    this.serverPosition.y = this.player.y;
  }

  public updatePositionFromServer(position: Omit<ServerPlayer, 'clientId'>) {
    this.serverPosition = position;
  }

  public update() {
    this.keyboardController?.update();

    if (this.keyboardController) {
      const { left, right, up, down } = this.keyboardController.movement;
      let velocityY = 0;
      let velocityX = 0;

      if (up) {
        velocityY = -this.speed;
      }
      if (down) {
        velocityY = this.speed;
      }
      if (left) {
        velocityX = -this.speed;
      }
      if (right) {
        velocityX = this.speed;
      }

      this.player.x += velocityX;
      this.player.y += velocityY;
    }

    // TODO this should only by run on remote players. In order to do this, we need the exact same tick rate on client and server
    this.player.x = Phaser.Math.Linear(this.player.x, this.serverPosition.x, 0.2);
    this.player.y = Phaser.Math.Linear(this.player.y, this.serverPosition.y, 0.2);

    if (!isEqual(this.keyboardController?.movement, this.serverPosition.move)) {
      this.player.flipX = this.keyboardController?.movement.left ?? this.serverPosition.move.left;
    }

    this.player.isMoving =
      this.keyboardController?.isMoving ??
      (this.serverPosition.move.right ||
        this.serverPosition.move.left ||
        this.serverPosition.move.up ||
        this.serverPosition.move.down);

    if (this.player.id === gameServer.clientId && this.keyboardController) {
      if (!isEqual(this.keyboardController?.movement, this.serverPosition.move)) {
        gameServer.movePlayer.emit({ movement: this.keyboardController.movement });
      }
    }
  }
}
