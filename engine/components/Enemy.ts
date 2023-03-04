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
  public speed = 225;

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

    this.setMovementTowardsPlayer();

    super.update(dt);
  }

  private setMovementTowardsPlayer() {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let minPlayer: Player | undefined = undefined;

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        x: Math.round(minPlayer.x - this.x),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        y: Math.round(minPlayer.y - this.y),
      };
    }

    const angle = Math.atan2(direction.y, direction.x);

    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    this.velocity.x = velocityX;
    this.velocity.y = velocityY;
  }
}
