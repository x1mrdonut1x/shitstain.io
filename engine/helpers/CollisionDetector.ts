import { Rectangle } from '../entities/Rectangle';
import { Circle } from '../entities/Circle';

type Shape = Rectangle | Circle;

export class CollisionDetector {
  public static isColliding(entity: Shape, entity2: Shape): boolean {
    if (entity instanceof Rectangle) {
      if (entity2 instanceof Rectangle) {
        return this.isRectangleOverlappingRectangle(entity, entity2);
      } else {
        return this.isCircleOverlappingRectangle(entity, entity2);
      }
    } else {
      if (entity2 instanceof Rectangle) {
        return this.isCircleOverlappingRectangle(entity2, entity);
      } else {
        return this.isCircleOverlappingCircle(entity, entity2);
      }
    }
  }

  private static isRectangleOverlappingRectangle(r1: Rectangle, r2: Rectangle) {
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

  private static isCircleOverlappingRectangle(r: Rectangle, c: Circle) {
    const distX = Math.abs(c.x - r.x - r.width / 2);
    const distY = Math.abs(c.y - r.y - r.height / 2);

    if (distX > r.width / 2 + c.radius) {
      return false;
    }
    if (distY > r.height / 2 + c.radius) {
      return false;
    }

    if (distX <= r.width / 2) {
      return true;
    }
    if (distY <= r.height / 2) {
      return true;
    }

    const dx = distX - r.width / 2;
    const dy = distY - r.height / 2;
    return dx * dx + dy * dy <= c.radius * c.radius;
  }

  private static isCircleOverlappingCircle(c1: Circle, c2: Circle) {
    return Math.hypot(c1.x - c2.x, c1.y - c2.y) <= c1.radius + c2.radius;
  }
}
