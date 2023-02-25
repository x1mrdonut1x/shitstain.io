import { gameServer } from '@/networking/GameServer';
import * as PIXI from 'pixi.js';
import { Player as EnginePlayer } from '../../../engine/components/Player';
import { ServerPlayer } from '../../../shared/types';
import { MovementController } from './MovementController';

export class Player extends EnginePlayer {
  public isLocalPlayer;
  public sprite = new PIXI.Sprite(PIXI.Texture.WHITE);

  constructor(stage: PIXI.Container, x: number, y: number, public id: string) {
    super(x, y, id);

    this.sprite.position.set(x, y);
    this.sprite.width = this.width;
    this.sprite.height = this.height;
    this.sprite.tint = 0xff0000;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    stage.addChild(this.sprite);

    this.isLocalPlayer = id === gameServer?.clientId;

    this.movementController = new MovementController(this);
  }

  update(dt: number) {
    // this.bulletController?.update();
    this.movementController?.update(dt);

    super.update(dt);
    this.sprite.position.set(this.position.x, this.position.y);
  }

  public setMovement(timestamp: number, position: ServerPlayer) {
    this.setVelocityFromMovement(position.move);
    this.movementController?.updatePositionFromServer(timestamp, position);
  }

  destroy(options: boolean) {
    this.sprite.destroy(options);
  }
}
