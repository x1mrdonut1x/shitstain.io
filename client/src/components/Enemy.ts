import { DamageText } from './DamageText';
import * as PIXI from 'pixi.js';
import { Enemy as EngineEnemy } from '../../../engine/components/Enemy';
import { GameEngine } from '../../../engine/GameEngine';

export class Enemy extends EngineEnemy {
  private damageTexts: Set<DamageText> = new Set();
  public sprite = new PIXI.Sprite(PIXI.Texture.WHITE);

  constructor(private stage: PIXI.Container, engine: GameEngine, x: number, y: number) {
    super(engine, x, y);

    this.sprite.position.set(x, y);
    this.sprite.width = this.width;
    this.sprite.height = this.height;
    this.sprite.tint = 0xff0000;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    const idText = new PIXI.Text(this.id);
    idText.position.x = this.x + this.width / 2;
    idText.position.y = this.y - this.height + 12;
    idText.style.fontSize = 12;
    stage.addChild(idText);

    this.onCollide = () => {
      const text = new DamageText(stage, this, 'hit');
      text.onDestroy = () => {
        this.damageTexts.delete(text);
        text.destroy();
      };
      this.damageTexts.add(text);
    };
  }

  update(delta: number) {
    this.damageTexts.forEach(text => text.update(delta));
    super.update(delta);
  }
}
