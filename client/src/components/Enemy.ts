import { DamageText } from './DamageText';
import { Enemy as EngineEnemy } from '../../../engine/components/Enemy';
import { GameEngine } from '../../../engine/GameEngine';
import { Bullet } from './Bullet';
import { Entity } from '../../../engine/entities/Entity';
import { Container } from 'pixi.js';

export class Enemy extends EngineEnemy {
  private damageTexts: Set<DamageText> = new Set();

  constructor(private stage: Container, engine: GameEngine, x: number, y: number) {
    super(engine, x, y);
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
    this.damageTexts.forEach(text => text.destroy());
    super.destroy();
  }

  update(delta: number) {
    this.damageTexts.forEach(text => text.update(delta));
    super.update(delta);
  }
}
