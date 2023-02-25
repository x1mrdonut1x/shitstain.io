import { Entity } from './Entity';

export class Circle extends Entity {
  constructor(x: number, y: number, public radius: number) {
    super(x, y);
  }
}
