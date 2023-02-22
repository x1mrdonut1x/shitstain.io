import { Scene } from 'phaser';
import { ServerPlayer, XYPosition } from '../../../types';
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
  private existenceTime = 0;

  private baseTimestamp: number | undefined;
  private nextTimestamp: number | undefined;

  private basePosition: XYPosition | undefined;
  private nextPosition: XYPosition | undefined;

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

  public updatePositionFromServer(timestamp: number, position: Omit<ServerPlayer, 'clientId'>) {
    if (!this.baseTimestamp) {
      this.baseTimestamp = timestamp;
      this.basePosition = position;
    } else {
      this.baseTimestamp = this.nextTimestamp;
      this.basePosition = this.nextPosition;

      this.nextTimestamp = timestamp;
      this.nextPosition = position;

      this.existenceTime = 0;
    }
  }

  public update(delta: number) {
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
    } else {
      // TODO this should only by run on remote players. In order to do this, we need the exact same tick rate on client and server

      if (this.basePosition && this.nextPosition && this.nextTimestamp && this.baseTimestamp) {
        const fullTimeStep = this.nextTimestamp - this.baseTimestamp;
        const step = Math.max(this.existenceTime, fullTimeStep) / fullTimeStep;
        this.existenceTime += delta;

        this.player.x = Phaser.Math.Linear(this.basePosition.x, this.nextPosition.x, step);
        this.player.y = Phaser.Math.Linear(this.basePosition.y, this.nextPosition.y, step);
      }
    }

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
