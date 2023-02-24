import { gameServer } from '@/networking/GameServer';
import { Physics, Scene } from 'phaser';
import { PlayerEntity } from '../../../shared/entities/PlayerEntity';
import { ServerPlayer } from '../../../shared/types';
import { BulletController } from './BulletController';
import { MovementController } from './MovementController';

export class Player extends Physics.Matter.Sprite {
  private bulletController: BulletController | undefined;
  private movementController: MovementController | undefined;
  public isMoving = false;
  public isLocalPlayer;
  public bulletSpeed = 10;

  constructor(
    scene: Scene,
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    public id: string
  ) {
    super(world, x, y, 'fireWizard');
    this.isLocalPlayer = id === gameServer.clientId;
    (this.body as MatterJS.BodyType).label = 'Dupasraka';
    console.log('player', id, 'created');
    this.setBody(PlayerEntity.config);

    this.bulletController = new BulletController(scene, world, this);
    this.movementController = new MovementController(scene, this);

    this.setRectangle(20, 60);
    if (this.isLocalPlayer) {
      this.scene.cameras.main.startFollow(
        this,
        true,
        1,
        1,
        -window.innerWidth / 4,
        -window.innerHeight - 50 //offset url and tabs bar
      );
    }
    console.log((this.body as MatterJS.BodyType).collisionFilter);
    world.add(this);
    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
    this.setCollisionGroup(-1);
  }

  update(delta: number) {
    this.bulletController?.update();
    this.movementController?.update(delta);

    if (this.bulletController?.isShooting) {
      this.anims.play('fire-wizard-fireball', true);
    } else if (this.isMoving) {
      this.anims.play('fire-wizard-walk', true);
    } else {
      this.anims.play('fire-wizard-idle', true);
    }
  }

  public setMovement(timestamp: number, movement: ServerPlayer) {
    this.movementController?.updatePositionFromServer(timestamp, movement);
  }
}
