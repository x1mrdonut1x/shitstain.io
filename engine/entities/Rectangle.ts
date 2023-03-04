import { Entity } from './Entity';
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
}
