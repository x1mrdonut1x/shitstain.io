import { Enemy } from './components/Enemy';
import { Player } from './components/Player';
import * as Quadtree from '@timohausmann/quadtree-ts';
import { MAP_HEIGHT_PX, MAP_WIDTH_PX } from '../shared/constants';
import { Circle } from './entities/Circle';
import { Rectangle } from './entities/Rectangle';
import { Entity } from './entities/Entity';
import { CollisionDetector } from './helpers/CollisionDetector';
import { Bullet } from './components/Bullet';

export class GameEngine<TPlayer extends Player = Player, TEnemy extends Enemy = Enemy> {
  public entities: Set<Rectangle | Circle> = new Set();
  public players: Set<TPlayer> = new Set();
  public enemies: Set<Enemy> = new Set();
  private tree = new Quadtree.Quadtree<Rectangle | Circle>({
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

    // TODO This is probably not very efficient
    this.tree.clear();
    this.entities.forEach(entity => this.tree.insert(entity));
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

  public updatePlayers(dt: number) {
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

  public updateEnemies(dt: number) {
    this.enemies.forEach(enemy => enemy.update(dt));
  }

  public removeInactiveEntities() {
    this.entities.forEach(entity => {
      if (!entity.isActive) {
        this.removeEntity(entity);
      }
      if (entity.x < 0 || entity.x > MAP_WIDTH_PX || entity.y < 0 || entity.y > MAP_HEIGHT_PX) {
        this.removeEntity(entity);
      }
    });
  }

  public update(dt: number) {
    this.collisionDetector();
    this.removeInactiveEntities();
    this.updatePlayers(dt);
    this.updateEnemies(dt);
  }

  public collisionDetector() {
    this.entities.forEach(entity => {
      const entityCollidingWith = this.collisions.get(entity) ?? new Set<Entity>();
      const candidates = this.tree.retrieve(entity);

      if (entity instanceof Bullet) {
        console.log(candidates.length);
      }

      candidates.forEach(candidate => {
        if (entity === candidate) return;
        if (entity.collisionGroup === candidate.collisionGroup) return;

        const collision = CollisionDetector.getCollision(entity, candidate);
        const isAlreadyColliding = entityCollidingWith.has(candidate);

        if (entity instanceof Bullet) {
          console.log(collision);
          console.log(isAlreadyColliding);
        }

        if (!collision && isAlreadyColliding) {
          entityCollidingWith.delete(candidate);
        }

        if (collision && !isAlreadyColliding) {
          entityCollidingWith.add(candidate);
          // TODO this should only be called once per entity collision
          entity.onCollide?.(candidate, collision);
        }
      });

      entity.isColliding = entityCollidingWith.size > 0;
      this.collisions.set(entity, entityCollidingWith);
    });
  }
}
