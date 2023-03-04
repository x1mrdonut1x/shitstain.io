import { Entity } from '../entities/Entity';
import { Rectangle } from '../entities/Rectangle';
import { GameEngine } from '../GameEngine';
import { Bullet } from './Bullet';
import { Player } from './Player';

export class Enemy extends Rectangle {
  private health = 100;
  private damage = 35;
  private attackSpeed = 1 * 1000;
  private attackTimer = 0;
  private attackedPlayers = new Set<Player>();

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

    if (entity instanceof Player) {
      this.attackedPlayers.add(entity);
    }
  }

  public update(dt: number): void {
    if (this.health <= 0) {
      this.destroy();
    }

    this.attackTimer += dt;
    if (this.attackTimer > this.attackSpeed) {
      this.attackedPlayers.forEach(player => player.onHit(this.damage));
      this.attackedPlayers.clear();
      this.attackTimer = 0;
    }

    super.update(dt);
  }
}
