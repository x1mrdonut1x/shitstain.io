import { EntityId } from '../../shared/types';
import { Entity } from '../entities/Entity';
import { Rectangle } from '../entities/Rectangle';
import { GameEngine } from '../GameEngine';
import { Bullet } from './Bullet';
import { Player } from './Player';

export class Enemy extends Rectangle {
  private health = 100;
  private damage = 5;
  private attackSpeed = 1 * 1000;
  private attackTimer = this.attackSpeed; // attack on first collision
  private attackedPlayers = new Set<Player>();
  public speed = 100;

  constructor(private engine: GameEngine, x: number, y: number, public id: EntityId) {
    super(x, y, 50, 50, id);
    this.label = 'Enemy';
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
      return;
    }

    this.attackTimer += dt;
    // TODO do not attack if not colliding with player
    if (this.attackedPlayers.size && this.attackTimer >= this.attackSpeed) {
      this.attackedPlayers.forEach(player => player.onHit(this.damage));
      this.attackedPlayers.clear();
      this.attackTimer = 0;
    }

    this.setMovementTowardsPlayer();

    super.update(dt);
  }

  private setMovementTowardsPlayer() {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let minPlayer = undefined as Player | undefined;

    let direction = { x: Math.random() - 0.5, y: Math.random() - 0.5 };

    this.engine.players.forEach(player => {
      const distance = Math.hypot(this.x - player.x, this.y - player.y);
      if (distance < minDistance) {
        minDistance = distance;
        minPlayer = player;
      }
    });

    if (minPlayer) {
      direction = {
        x: Math.round(minPlayer.x - this.x),
        y: Math.round(minPlayer.y - this.y),
      };
    }

    const angle = Math.atan2(direction.y, direction.x);

    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    return;
    this.velocity.x = velocityX;
    this.velocity.y = velocityY;
  }
}
