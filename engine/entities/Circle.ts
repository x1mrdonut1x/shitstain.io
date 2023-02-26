import { Entity } from './Entity';
import * as Quadtree from '@timohausmann/quadtree-ts';

export class Circle extends Entity {
  constructor(x: number, y: number, public radius: number, public id?: string | number) {
    super(x, y, id);
  }

  qtIndex(node: Quadtree.NodeGeometry) {
    return Quadtree.Rectangle.prototype.qtIndex.call(
      {
        x: this.x,
        y: this.y,
        r: this.radius,
      },
      node
    );
  }
}
