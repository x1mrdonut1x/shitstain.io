import { Entity } from './Entity';

export class Circle extends Entity {
  constructor(x: number, y: number, public radius: number, public id?: string | number) {
    super(x, y, id);
  }
}
