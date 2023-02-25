import * as PIXI from 'pixi.js';
import { Vector2 } from '../../../../engine/entities/Vector2';
import { Player } from '../Player';

export class PointerController {
  public isShooting = false;
  public mousePos: Vector2 = { x: 0, y: 0 };
  private onMoveCallback?: (isShooting: boolean, mousePosition: Vector2) => void;

  constructor(private stage: PIXI.Container, private player: Player) {
    this.stage.addEventListener('pointerdown', e => {
      this.mousePos = {
        x: e.x - this.player.position.x + stage.pivot.x,
        y: e.y - this.player.position.y + stage.pivot.y,
      };
      this.isShooting = true;
      this.onMoveCallback?.(this.isShooting, this.mousePos);
    });

    this.stage.addEventListener('pointermove', e => {
      this.mousePos = {
        x: e.x - this.player.position.x + stage.pivot.x,
        y: e.y - this.player.position.y + stage.pivot.y,
      };
      this.onMoveCallback?.(this.isShooting, this.mousePos);
    });

    this.stage.addEventListener('pointerup', () => {
      this.isShooting = false;
      this.onMoveCallback?.(this.isShooting, this.mousePos);
    });
  }

  public onMove(callback: (isShooting: boolean, mousePosition: Vector2) => void) {
    this.onMoveCallback = callback;
  }
}
