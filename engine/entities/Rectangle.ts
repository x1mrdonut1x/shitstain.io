import { Entity } from './Entity';
import * as Quadtree from '@timohausmann/quadtree-ts';

export class Rectangle extends Entity {
  constructor(
    x: number,
    y: number,
    public width: number,
    public height: number,
    public id?: string | number
  ) {
    super(x, y, id);
  }

  qtIndex(node: Quadtree.NodeGeometry) {
    return Quadtree.Rectangle.prototype.qtIndex.call(
      {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
      },
      node
    );
  }
}
