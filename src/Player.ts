import * as PIXI from 'pixi.js';
import { Container } from 'pixi.js';
import { PlayerBulletController } from './PlayerBulletController';
import { PlayerMovementController } from './PlayerMovementController';

export class Player {
  private readonly playerContainer = new PIXI.Container();
  private readonly player = new PIXI.Sprite(PIXI.Texture.WHITE);
  private readonly stage: Container | undefined;
  private readonly movementController: PlayerMovementController;
  private readonly bulletController: PlayerBulletController;
  private readonly playerSize = { width: 60, height: 60 };

  constructor(stage: Container) {
    this.stage = stage;
    this.movementController = new PlayerMovementController(this.player);
    this.bulletController = new PlayerBulletController(this.stage, this);

    this.createPlayer();
    this.playerContainer.addChild(this.player);
  }

  get getPlayerContainer() {
    return this.playerContainer;
  }

  get position() {
    return this.player.position;
  }

  get velocity() {
    return this.movementController.getVelocity();
  }

  private createPlayer() {
    this.player.position.set(100, 100);
    this.player.width = this.playerSize.width;
    this.player.height = this.playerSize.height;
    this.player.tint = 0xff0000;
    this.player.anchor.x = 0.5;
    this.player.anchor.y = 0.5;
  }

  update(delta: number, elapsed: number) {
    this.movementController.update(delta);
    this.bulletController.update(delta, elapsed);
  }
}
