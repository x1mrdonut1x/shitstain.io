export class Vector2 {
  public x: number;
  public y: number;

  constructor(x?: number, y?: number) {
    this.x = Math.round(x ?? 0);
    this.y = Math.round(y ?? 0);
  }
}
