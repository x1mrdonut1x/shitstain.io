import { Entity } from './Entity';

export class Rectangle extends Entity {
  constructor(
    x: number,
    y: number,
    public width: number,
    public height: number) {
    super(x, y);
  }
}
