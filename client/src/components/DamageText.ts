import * as PIXI from 'pixi.js';
import { Entity } from '../../../engine/entities/Entity';

export class DamageText {
  private text: PIXI.Text;
  private life = 300;
  private elapsed = 0;

  constructor(stage: PIXI.Container, private parent: Entity, value: string) {
    this.text = new PIXI.Text(value);
    stage.addChild(this.text);
  }

  update(delta: number) {
    this.elapsed += delta;

    const newX = this.parent.position.x;
    const newY = this.parent.position.y - 30 - 20 * (this.elapsed / this.life);
    this.text.position.x = newX;
    this.text.position.y = newY;

    if (this.elapsed > this.life) {
      this.text.destroy(true);
    }
  }
}
