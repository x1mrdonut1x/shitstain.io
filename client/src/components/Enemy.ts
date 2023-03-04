import { DamageText } from './DamageText';
import { Enemy as EngineEnemy } from '../../../engine/components/Enemy';
import { GameEngine } from '../../../engine/GameEngine';
import { Bullet } from './Bullet';
import { Entity } from '../../../engine/entities/Entity';
import { Container, Text } from 'pixi.js';

export class Enemy extends EngineEnemy {
  public spritesContainer = new Container();
  private damageTexts: Set<DamageText> = new Set();

  constructor(private stage: Container, engine: GameEngine, x: number, y: number) {
    super(engine, x, y);

    // DEBUG
    const idText = new Text(this.id);
    idText.style.fontSize = 12;
    this.spritesContainer.addChild(idText);
    this.spritesContainer.position.x = this.x;
    this.spritesContainer.position.y = this.y;

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
    this.damageTexts.forEach(text => text.destroy());
    super.destroy();
  }

  update(delta: number) {
    this.spritesContainer.position.x = this.x;
    this.spritesContainer.position.y = this.y;
    this.damageTexts.forEach(text => text.update(delta));
    super.update(delta);
  }
}
