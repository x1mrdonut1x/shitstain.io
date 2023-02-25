import { Entity } from './Entity';

export class World {
  public bodies: Set<Entity> = new Set<Entity>();


  public add(entity: Entity) {
    this.bodies.add(entity);
  }

  public remove(entity: Entity) {
    this.bodies.delete(entity);
  }

  public update(dt: number) {
    this.bodies.forEach(entity => {
      entity.update(dt);
    });
  }
}
