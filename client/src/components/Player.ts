import { Physics, Scene } from 'phaser';
import { ServerMovement } from '../../../types';
import { BulletController } from './BulletController';
import { MovementController } from './MovementController';

export class Player extends Physics.Arcade.Sprite {
  private bulletController: BulletController | undefined;
  private movementController: MovementController | undefined;

  constructor(scene: Scene, x: number, y: number, public id: string) {
    super(scene, x, y, 'fireWizard');

    this.bulletController = new BulletController(scene, this);
    this.movementController = new MovementController(scene, this);

    scene.physics.add.existing(this);
    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
  }

  update(delta: number) {
    this.bulletController?.updateBullets(delta);
    this.movementController?.update();
  }

  public setMovement(movement?: ServerMovement) {
    this.movementController?.setMovement(movement);
  }
}
