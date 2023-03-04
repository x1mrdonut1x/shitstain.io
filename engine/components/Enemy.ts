import { Entity } from '../entities/Entity';
import { Rectangle } from '../entities/Rectangle';
import { GameEngine } from '../GameEngine';
import { Bullet } from './Bullet';

export class Enemy extends Rectangle {
  private health = 100;

  constructor(private engine: GameEngine, x: number, y: number, public id?: string | number) {
    super(x, y, 50, 50, id);
    this.label = 'Enemy';
    this.id = id ?? this.engine.enemies.size + 1;
    this.collisionGroup = 'enemy';
  }

  public onCollide(entity: Entity) {
    if (entity instanceof Bullet) {
      this.health -= entity.damage;
    }
  }

  public update(dt: number): void {
    if (this.health <= 0) {
      this.destroy();
    }

    super.update(dt);
  }
}
