import { Vector2 } from './Vector2';

export class Entity {
  public position: Vector2;
  public velocity: Vector2 = new Vector2();
  public onCollide?: (entity: Entity) => void;

  constructor(x: number, y: number) {
    this.position = new Vector2(x, y);
  }

  public setVelocity(v: Vector2) {
    this.velocity = v;
  }

  public update(dt: number) {
    this.position.x += Math.round(this.velocity.x * (dt / 1000));
    this.position.y += Math.round(this.velocity.y * (dt / 1000));
  }
}
