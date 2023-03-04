import * as PIXI from 'pixi.js';
import { Rectangle } from '../../../engine/entities/Rectangle';

export class DamageText {
  private text: PIXI.Text;
  private life = 300;
  private elapsed = 0;

  public onDestroy?: () => void;

  constructor(stage: PIXI.Container, private parent: Rectangle, value: string) {
    this.text = new PIXI.Text(value);
    this.text.style = {
      fontSize: 14,
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 3,
    };

    stage.addChild(this.text);
  }

  destroy() {
    this.text.destroy(true);
  }

  update(delta: number) {
    this.elapsed += delta;

    const newX = this.parent.x + this.parent.width / 2 - 10;
    const newY = this.parent.y - 10 - 20 * (this.elapsed / this.life);
    this.text.position.x = newX;
    this.text.position.y = newY;

    const newScale = 1 + (0.15 * this.elapsed) / this.life;
    this.text.scale.x = newScale;
    this.text.scale.y = newScale;

    if (this.elapsed > this.life) {
      this.onDestroy?.();
    }
  }
}
