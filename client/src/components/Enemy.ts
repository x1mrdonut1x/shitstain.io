import { DamageText } from './DamageText';
import * as PIXI from 'pixi.js';
import { Enemy as EngineEnemy } from '../../../engine/components/Enemy';

export class Enemy extends EngineEnemy {
  private damageTexts: DamageText[] = [];
  public sprite = new PIXI.Sprite(PIXI.Texture.WHITE);

  constructor(private stage: PIXI.Container, x: number, y: number) {
    super(x, y);

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
    super.update(delta);
  }
}
