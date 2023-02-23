import { Scene } from 'phaser';

export class DamageText {
  private text: Phaser.GameObjects.Text;
  private life = 300;
  private elapsed = 0;

  constructor(scene: Scene, private parent: MatterJS.BodyType, value: string) {
    this.text = scene.add.text(parent.position.x, parent.position.y, value, {
      color: 'red',
      fontSize: '20px',
    });
  }

  update(delta: number) {
    this.elapsed += delta;

    const newX = this.parent.position.x;
    const newY = this.parent.position.y - 30 - 20 * (this.elapsed / this.life);
    this.text.setPosition(newX, newY);

    if (this.elapsed > this.life) {
      this.text.destroy(true);
    }
  }
}
