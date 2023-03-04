import { DamageText } from './DamageText';
import * as PIXI from 'pixi.js';
import { Enemy as EngineEnemy } from '../../../engine/components/Enemy';
import { GameEngine } from '../../../engine/GameEngine';
import { Bullet } from './Bullet';
import { Entity } from '../../../engine/entities/Entity';

export class Enemy extends EngineEnemy {
  private damageTexts: Set<DamageText> = new Set();
  public spritesContainer = new PIXI.Container();

  constructor(private stage: PIXI.Container, engine: GameEngine, x: number, y: number) {
    super(engine, x, y);

    // DEBUG
    const idText = new PIXI.Text(this.id);
    idText.position.x = this.x;
    idText.position.y = this.y;
    idText.style.fontSize = 12;
    this.spritesContainer.addChild(idText);

    stage.addChild(this.spritesContainer);
  }

  public onCollide(entity: Entity) {
    if (entity instanceof Bullet) {
      const text = new DamageText(this.stage, this, entity.damage.toString());

      text.onDestroy = () => {
        this.damageTexts.delete(text);
        text.destroy();
      };
      this.damageTexts.add(text);
    }

    super.onCollide(entity);
  }

  public destroy(): void {
    this.spritesContainer.destroy();
    super.destroy();
  }

  update(delta: number) {
    this.damageTexts.forEach(text => text.update(delta));
    super.update(delta);
  }
}
