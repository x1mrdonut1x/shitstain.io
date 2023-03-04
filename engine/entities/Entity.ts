import { Vector2 } from './Vector2';

export class Entity {
  public label?: string;
  public id?: string | number;

  public x: number;
  public y: number;

  public isActive = true; // used for destroying unused entities
  public isStatic = false;
  public anchor = new Vector2(0, 0);
  public velocity = new Vector2();
  public isColliding = false;
  public collisionGroup?: string;

  constructor(x: number, y: number, id?: string | number) {
    this.x = x;
    this.y = y;
    this.id = id;
  }

  // eslint-disable-next-line
  public onCollide(entity: Entity, vector: Vector2) {}

  public getPosition() {
    return new Vector2(this.x, this.y);
  }

  public setVelocity(v: Vector2) {
    this.velocity = v;
  }

  public destroy() {
    this.isActive = false;
  }

  public update(dt: number) {
    if (this.isStatic) return;

    this.x = Math.round(this.x + this.velocity.x * (dt / 1000));
    this.y = Math.round(this.y + this.velocity.y * (dt / 1000));
  }
}
