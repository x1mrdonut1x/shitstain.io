import { gameServer } from '@/networking/GameServer';
import { Physics, Scene } from 'phaser';
import { ServerMovement } from '../../../shared/types';
import { BulletController } from './BulletController';
import { MovementController } from './MovementController';

export class Player extends Physics.Arcade.Sprite {
  private bulletController: BulletController | undefined;
  private movementController: MovementController | undefined;
  private isMoving = false;

  constructor(scene: Scene, x: number, y: number, public id: string) {
    super(scene, x, y, 'fireWizard');
    console.log('player', id, 'created');

    this.bulletController = new BulletController(scene, this);
    this.movementController = new MovementController(scene, this);

    scene.physics.add.existing(this);
    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);

    if (gameServer.clientId === id) {
      this.setCollideWorldBounds(true);
    }

    // if (this.id === gameServer.clientId) {
    //   console.log('loadCamera');
    //   this.scene.cameras.main.startFollow(this);
    // }
  }

  update(delta: number) {
    this.bulletController?.update(delta);
    this.movementController?.update();

    if (this.bulletController?.isShooting) {
      this.anims.play('fire-wizard-fireball', true);
    } else if (this.isMoving) {
      this.anims.play('fire-wizard-walk', true);
    } else {
      this.anims.play('fire-wizard-idle', true);
    }
  }

  public setMovement(movement: ServerMovement) {
    this.isMoving = Boolean(movement?.dx || movement?.dy);
    this.movementController?.setMovement(movement);
  }
}
