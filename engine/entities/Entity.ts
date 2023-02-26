import { Vector2 } from './Vector2';

export class Entity {
  public label?: string;

  public id?: string | number;
  public x: number;
  public y: number;
  public velocity: Vector2 = new Vector2();
  public onCollide?: (entity: Entity) => void;
  public isColliding = false;

  constructor(x: number, y: number, id?: string | number) {
    this.x = x;
    this.y = y;
  }

  public getPosition() {
    return new Vector2(this.x, this.y);
  }

  public setVelocity(v: Vector2) {
    this.velocity = v;
  }

  public update(dt: number) {
    this.x = Math.round(this.x + this.velocity.x * (dt / 1000));
    this.y = Math.round(this.y + this.velocity.y * (dt / 1000));
  }
}
