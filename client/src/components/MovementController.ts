import { Scene } from 'phaser';
import { ServerPlayer, XYPosition } from '../../../shared/types';
import { gameServer } from '../networking/GameServer';
import { isEqual } from 'lodash';
import { Player } from './Player';
import { KeyboardController } from './input-controllers/KeyboardController';

export class MovementController {
  private existenceTime = 0;

  private baseTimestamp: number | undefined;
  private nextTimestamp: number | undefined;

  private basePosition: XYPosition | undefined;
  private nextPosition: XYPosition | undefined;

  private serverPosition?: ServerPlayer;
  private keyboardController: KeyboardController | undefined;
  private readonly speed = 200;

  constructor(private scene: Scene, private player: Player) {
    if (this.player.isLocalPlayer) {
      this.keyboardController = new KeyboardController(scene);
    }
  }

  public updatePositionFromServer(timestamp: number, position: ServerPlayer) {
    this.serverPosition = position;

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

      this.player.x += (velocityX * delta) / 1000;
      this.player.y += (velocityY * delta) / 1000;

      if (this.nextPosition) {
        const dx = Math.abs(this.player.x - this.nextPosition.x);
        const dy = Math.abs(this.player.y - this.nextPosition.y);
        const maxAllowedShift = 80;

        if (dx > maxAllowedShift || dy > maxAllowedShift) {
          this.player.x = this.nextPosition.x;
          this.player.y = this.nextPosition.y;
        }
      }

      if (!isEqual(this.keyboardController?.movement, this.serverPosition?.move)) {
        gameServer.movePlayer.emit({ movement: this.keyboardController.movement });
      }

      if (this.keyboardController.movement.left || this.keyboardController.movement.right) {
        this.player.flipX = this.keyboardController.movement.left;
      }
      this.player.isMoving = this.keyboardController?.isMoving;
    } else {
      if (this.basePosition && this.nextPosition && this.nextTimestamp && this.baseTimestamp) {
        const fullTimeStep = this.nextTimestamp - this.baseTimestamp;
        const step = Math.min(this.existenceTime, fullTimeStep) / fullTimeStep;
        this.existenceTime += delta;

        this.player.x = Phaser.Math.Linear(this.basePosition.x, this.nextPosition.x, step);
        this.player.y = Phaser.Math.Linear(this.basePosition.y, this.nextPosition.y, step);
      }

      if (this.serverPosition) {
        if (this.serverPosition.move.left || this.serverPosition.move.right) {
          this.player.flipX = this.serverPosition.move.left;
        }

        this.player.isMoving =
          this.serverPosition.move.right ||
          this.serverPosition.move.left ||
          this.serverPosition.move.up ||
          this.serverPosition.move.down;
      }
    }
  }
}
