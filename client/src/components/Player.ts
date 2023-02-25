import { gameServer } from '@/networking/GameServer';
import { Player as EnginePlayer } from '../../../engine/components/Player';
import { ServerPlayer } from '../../../shared/types';
import { BulletController } from './BulletController';
import { MovementController } from './MovementController';
import * as PIXI from 'pixi.js';
import { MAP_HEIGHT_PX, MAP_WIDTH_PX } from '../../../shared/constants';

export class Player extends EnginePlayer {
  protected bulletController?: BulletController;
  protected movementController?: MovementController;
  public isLocalPlayer;
  public sprite = new PIXI.Sprite(PIXI.Texture.WHITE);

  constructor(private stage: PIXI.Container, x: number, y: number, public id: string) {
    super(x, y, id);

    this.sprite.position.set(x, y);
    this.sprite.width = this.width;
    this.sprite.height = this.height;
    this.sprite.tint = 0x00ff00;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    stage.addChild(this.sprite);

    this.isLocalPlayer = id === gameServer?.clientId;

    this.movementController = new MovementController(this);
    this.bulletController = new BulletController(stage, this);
  }

  update(dt: number) {
    this.bulletController?.update(dt);
    this.movementController?.update(dt);

    // Camera controller
    if (this.isLocalPlayer) {
      const nextX = this.position.x - window.innerWidth / 2;
      const nextY = this.position.y - window.innerHeight / 2;

      if (
        nextX > 0 &&
        (this.stage.pivot.x >= 0 || nextX > this.stage.pivot.x) &&
        (this.stage.pivot.x + window.innerWidth <= MAP_WIDTH_PX || nextX < this.stage.pivot.x)
      ) {
        this.stage.pivot.x = nextX;
      }

      if (
        nextY > 0 &&
        (this.stage.pivot.y >= 0 || nextY > this.stage.pivot.y) &&
        (this.stage.pivot.y + window.innerHeight <= MAP_HEIGHT_PX || nextY < this.stage.pivot.y)
      ) {
        this.stage.pivot.y = nextY;
      }
    }

    this.sprite.position.set(this.position.x, this.position.y);
    super.update(dt);
  }

  public setMovement(timestamp: number, position: ServerPlayer) {
    if (!this.isLocalPlayer) this.setVelocityFromMovement(position.move);
    this.movementController?.updatePositionFromServer(timestamp, position.position);
  }
}
