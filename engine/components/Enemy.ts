import { Rectangle } from '../entities/Rectangle';
import { GameEngine } from '../GameEngine';

export class Enemy extends Rectangle {
  private health = 100;

  constructor(private engine: GameEngine, x: number, y: number, public id?: string | number) {
    super(x, y, 50, 50, id);
    this.label = 'Enemy';
    this.id = id ?? this.engine.enemies.size + 1;
  }
}
