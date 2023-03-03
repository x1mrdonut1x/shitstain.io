import { Rectangle } from '../entities/Rectangle';
import { Circle } from '../entities/Circle';
import { Vector2 } from '../entities/Vector2';

type Shape = Rectangle | Circle;

export class CollisionDetector {
  public static getCollision(entity: Shape, entity2: Shape): Vector2 | undefined {
    if (entity instanceof Rectangle) {
      if (entity2 instanceof Rectangle) {
        return this.isRectangleOverlappingRectangle(entity, entity2);
      } else {
        return this.isCircleOverlappingRectangle(entity, entity2);
      }
    } else {
      if (entity2 instanceof Rectangle) {
        const collision = this.isCircleOverlappingRectangle(entity2, entity);
        if (collision) return this.reverse(collision);
        return undefined;
      } else {
        return this.isCircleOverlappingCircle(entity, entity2);
      }
    }
  }

  public static reverse(collision: Vector2): Vector2 {
    return {
      x: -collision.x,
      y: -collision.y,
    };
  }

  private static isRectangleOverlappingRectangle(
    r1: Rectangle,
    r2: Rectangle
  ): Vector2 | undefined {
    const r1w = r1.width / 2,
      r1h = r1.height / 2,
      r2w = r2.width / 2,
      r2h = r2.height / 2;

    const distX = r1.x + r1w - (r2.x + r2w);
    const distY = r1.y + r1h - (r2.y + r2h);

    if (Math.abs(distX) < r1w + r2w && Math.abs(distY) < r1h + r2h) {
      return {
        x: r1.x + r1w - (r2.x + r2w),
        y: r1.y + r1h - (r2.y + r2h),
      };
    }

    return undefined;
  }

  private static isCircleOverlappingRectangle(r: Rectangle, c: Circle): Vector2 | undefined {
    const rw = r.width / 2;
    const rh = r.height / 2;
    const rx = r.x + rw;
    const ry = r.y + rh;

    const distX = Math.abs(c.x - rx);
    const distY = Math.abs(c.y - ry);

    if (distX > rw + c.radius || distY > rh + c.radius) {
      return undefined;
    }

    const collision = {
      x: rx - c.x,
      y: ry - c.y,
    };

    if (distX <= rw || distY <= rh) {
      return collision;
    }

    const dx = distX - rw;
    const dy = distY - rh;
    if (dx * dx + dy * dy <= c.radius * c.radius) {
      return collision;
    }

    return undefined;
  }

  private static isCircleOverlappingCircle(c1: Circle, c2: Circle): Vector2 | undefined {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const rs = c1.radius + c2.radius;
    if (dx * dx + dy * dy <= rs * rs) {
      return {
        x: dx,
        y: dy,
      };
    }

    return undefined;
  }
}
