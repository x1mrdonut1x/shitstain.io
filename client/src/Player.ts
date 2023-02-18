import * as PIXI from 'pixi.js';
import { Container } from 'pixi.js';
import { PlayerBulletController } from './PlayerBulletController';
import { PlayerMovementController } from './PlayerMovementController';
import { eventEmitter } from './EventEmitter';

export class Player {
  public id = Math.floor(Math.random() * 100);

  private readonly _playerContainer = new PIXI.Container();
  private readonly _sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
  private readonly stage: Container | undefined;
  private _movementController: PlayerMovementController | undefined;
  private readonly _bulletController: PlayerBulletController;
  private readonly playerSize = { width: 60, height: 60 };

  constructor(stage: Container, id?: number, x?: number, y?: number) {
    if (id) this.id = id;

    this.stage = stage;
    this._bulletController = new PlayerBulletController(this.stage, this);

    this.createPlayer(x, y);
    this._playerContainer.addChild(this._sprite);
  }

  set movementController(controller: PlayerMovementController) {
    this._movementController = controller;
  }

  public setPosition(x: number, y: number) {
    this._sprite.position.x = x;
    this._sprite.position.y = y;
  }

  get playerContainer() {
    return this._playerContainer;
  }

  get sprite() {
    return this._sprite;
  }

  get position() {
    return this._sprite.position;
  }

  get velocity() {
    return this._movementController?.getVelocity();
  }

  private createPlayer(x?: number, y?: number) {
    this._sprite.position.set(
      x ?? randomIntFromInterval(0, document.body.clientWidth),
      y ?? randomIntFromInterval(0, document.body.clientHeight)
    );
    this._sprite.width = this.playerSize.width;
    this._sprite.height = this.playerSize.height;
    this._sprite.tint = 0xff0000;
    this._sprite.anchor.x = 0.5;
    this._sprite.anchor.y = 0.5;
  }

  update(delta: number, elapsed: number) {
    this._movementController?.update(delta);
    this._bulletController.update(delta, elapsed);
  }
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
