import { XYPosition } from '../../../shared/types';
import { KeyboardController } from './input-controllers/KeyboardController';
import { gameServer } from '@/networking/GameServer';
import { Player } from './Player';

export class MovementController {
  private existenceTime = 0;

  private baseTimestamp?: number;
  private nextTimestamp?: number;

  private basePosition?: XYPosition;
  private nextPosition?: XYPosition;

  private keyboardController?: KeyboardController;

  constructor(private player: Player) {
    if (this.player.isLocalPlayer)
      this.keyboardController = new KeyboardController(movement => {
        this.player.setVelocityFromMovement(movement);
        gameServer.movePlayer.emit({ movement });
      });
  }

  public updatePositionFromServer(timestamp: number, position: XYPosition) {
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
    if (this.keyboardController) {
      if (this.nextPosition) {
        const dx = Math.abs(this.player.position.x - this.nextPosition.x);
        const dy = Math.abs(this.player.position.y - this.nextPosition.y);
        const maxAllowedShift = 80;

        if (dx > maxAllowedShift || dy > maxAllowedShift) {
          this.player.position.x = this.nextPosition.x;
          this.player.position.y = this.nextPosition.y;
        }
      }

      this.player.isMoving = this.keyboardController?.isMoving;
    } else {
      if (this.basePosition && this.nextPosition && this.nextTimestamp && this.baseTimestamp) {
        const fullTimeStep = this.nextTimestamp - this.baseTimestamp;
        const step = Math.min(this.existenceTime, fullTimeStep) / fullTimeStep;
        this.existenceTime += delta;

        this.player.position.x = lerp(this.basePosition.x, this.nextPosition.x, step);
        this.player.position.y = lerp(this.basePosition.y, this.nextPosition.y, step);
      }
    }
  }
}
const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
