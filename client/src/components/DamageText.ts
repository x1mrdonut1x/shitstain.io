import * as PIXI from 'pixi.js';
import { Entity } from '../../../engine/entities/Entity';

export class DamageText {
  private text: PIXI.Text;
  private life = 300;
  private elapsed = 0;

  public onDestroy?: () => void;

  constructor(stage: PIXI.Container, private parent: Entity, value: string) {
    this.text = new PIXI.Text(value);
    this.text.style.fontSize = 14;
    stage.addChild(this.text);
  }

  destroy() {
    this.text.destroy(true);
  }

  update(delta: number) {
    this.elapsed += delta;

    const newX = this.parent.x;
    const newY = this.parent.y - 10 - 20 * (this.elapsed / this.life);
    this.text.position.x = newX;
    this.text.position.y = newY;

    if (this.elapsed > this.life) {
      this.onDestroy?.();
    }
  }
}
