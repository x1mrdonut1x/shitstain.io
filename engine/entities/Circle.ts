import { EntityId } from '../../shared/types';
import { Entity } from './Entity';

export class Circle extends Entity {
  constructor(x: number, y: number, public radius: number, public id: EntityId) {
    super(x, y, id);
  }
}
