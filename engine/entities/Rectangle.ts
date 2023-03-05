import { EntityId } from '../../shared/types';
import { Entity } from './Entity';

export class Rectangle extends Entity {
  constructor(
    x: number,
    y: number,
    public width: number,
    public height: number,
    public id: EntityId
  ) {
    super(x, y, id);
  }
}
