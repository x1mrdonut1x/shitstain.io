import { DamageText } from './DamageText';
import * as PIXI from 'pixi.js';
import { Rectangle } from '../../../engine/entities/Rectangle';

export class Enemy extends Rectangle {
  private health = 100;
  private damageTexts: DamageText[] = [];
  public sprite = new PIXI.Sprite(PIXI.Texture.WHITE);

  constructor(private stage: PIXI.Container, x: number, y: number) {
    super(x, y, 50, 50);

    this.sprite.position.set(x, y);
    this.sprite.width = this.width;
    this.sprite.height = this.height;
    this.sprite.tint = 0xff0000;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.onCollide = () => {
      this.damageTexts.push(new DamageText(stage, this, '10'));
    };
  }

  update(delta: number) {
    this.damageTexts.forEach(text => text.update(delta));
  }
}
