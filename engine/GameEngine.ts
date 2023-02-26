import { Enemy } from './components/Enemy';
import { Player } from './components/Player';
import * as Quadtree from '@timohausmann/quadtree-ts';
import { MAP_HEIGHT_PX, MAP_WIDTH_PX } from '../shared/constants';
import { Circle } from './entities/Circle';
import { Rectangle } from './entities/Rectangle';
import { Entity } from './entities/Entity';

export class GameEngine<TPlayer extends Player = Player, TEnemy extends Enemy = Enemy> {
  public entities: Set<Rectangle | Circle> = new Set();
  public players: Set<TPlayer> = new Set();
  public enemies: Set<Enemy> = new Set();
  private tree = new Quadtree.Quadtree({
    width: MAP_WIDTH_PX,
    height: MAP_HEIGHT_PX,
  });

  private collisions = new Map<Entity, Set<Entity>>();

  public addEntity(entity: Rectangle | Circle) {
    this.entities.add(entity);

    this.tree.insert(entity);
  }

  public removeEntity(entity: Rectangle | Circle) {
    this.entities.delete(entity);
  }

  // Players
  public getPlayerById(id: string | number) {
    return Array.from(this.players).find(player => player.id === id);
  }

  public addPlayer(player: TPlayer) {
    this.players.add(player);
    this.addEntity(player);
  }

  public removePlayer(player: TPlayer | string) {
    let foundPlayer: TPlayer | undefined;

    if (typeof player === 'string') {
      foundPlayer = this.getPlayerById(player);
    } else {
      foundPlayer = player;
    }

    if (foundPlayer) {
      this.players.delete(foundPlayer);
      this.removeEntity(foundPlayer);
    }
  }

  private updatePlayers(dt: number) {
    this.players.forEach(player => player.update(dt));
  }

  // Enemies
  public addEnemy(enemy: TEnemy) {
    this.enemies.add(enemy);
    this.addEntity(enemy);
  }

  public removeEnemy(enemy: TEnemy) {
    this.enemies.delete(enemy);
    this.removeEntity(enemy);
  }

  private updateEnemies(dt: number) {
    this.enemies.forEach(enemy => enemy.update(dt));
  }

  public update(dt: number) {
    this.collisionDetector();
    this.updatePlayers(dt);
    this.updateEnemies(dt);
  }

  public collisionDetector() {
    this.entities.forEach(entity => {
      const entityCollidingWith = this.collisions.get(entity) ?? new Set<Entity>();
      const candidates = this.tree.retrieve(entity);

      candidates.forEach(candidate => {
        if (entity === candidate) return;

        if (entity instanceof Rectangle && candidate instanceof Rectangle) {
          const isColliding = getIntersection(entity, candidate);
          const isAlreadyColliding = entityCollidingWith.has(candidate);
          if (!isColliding && isAlreadyColliding) {
            entityCollidingWith.delete(candidate);
          }

          if (isColliding && !isAlreadyColliding) {
            entityCollidingWith.add(candidate);
            candidate.onCollide?.(entity);
            entity.onCollide?.(candidate);
            console.log(`${candidate.label}_${candidate.id}`, `${entity.label}_${entity.id}`);
          }

          candidate.isColliding = isColliding;
        }
      });
      entity.isColliding = entityCollidingWith.size > 0;

      this.collisions.set(entity, entityCollidingWith);
    });
  }
}

function getIntersection(r1: Rectangle, r2: Rectangle) {
  const r1w = r1.width / 2,
    r1h = r1.height / 2,
    r2w = r2.width / 2,
    r2h = r2.height / 2;

  const distX = r1.x + r1w - (r2.x + r2w);
  const distY = r1.y + r1h - (r2.y + r2h);

  if (Math.abs(distX) < r1w + r2w && Math.abs(distY) < r1h + r2h) {
    return true;
  } else {
    return false;
  }
}
