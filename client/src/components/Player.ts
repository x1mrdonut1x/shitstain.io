import { gameServer } from '@/networking/GameServer';
import { Player as EnginePlayer } from '../../../engine/components/Player';
import { ServerPlayer } from '../../../shared/types';
import { BulletController } from './BulletController';
import { MovementController } from './MovementController';
import { MAP_HEIGHT_PX, MAP_WIDTH_PX } from '../../../shared/constants';
import { GameEngine } from '../../../engine/GameEngine';
import { Container, Text } from 'pixi.js';
import { DamageText } from '@/components/DamageText';

export class Player extends EnginePlayer {
  protected bulletController?: BulletController;
  protected movementController?: MovementController;
  public spritesContainer = new Container();
  public isLocalPlayer;
  private healthText: Text;
  private damageTexts: Set<DamageText> = new Set();

  constructor(
    private stage: Container,
    engine: GameEngine,
    x: number,
    y: number,
    public id: string | number
  ) {
    super(engine, x, y, id);

    this.healthText = new Text(this.health);
    this.healthText.position.x = this.x;
    this.healthText.position.y = this.y;
    this.healthText.style.fontSize = 12;
    this.spritesContainer.addChild(this.healthText);

    stage.addChild(this.spritesContainer);

    this.isLocalPlayer = id === gameServer?.clientId;

    this.movementController = new MovementController(this);
    this.bulletController = new BulletController(stage, this);
  }

  onHit(damage: number) {
    super.onHit(damage);

    const text = new DamageText(this.stage, this, damage.toString());

    text.onDestroy = () => {
      this.damageTexts.delete(text);
      text.destroy();
    };
    this.damageTexts.add(text);
  }

  update(dt: number) {
    this.bulletController?.update(dt);
    this.movementController?.update(dt);

    // Camera controller
    if (this.isLocalPlayer) {
      const nextX = this.x - window.innerWidth / 2;
      const nextY = this.y - window.innerHeight / 2;

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

    super.update(dt);

    this.spritesContainer.children.forEach(sprite => {
      sprite.x = this.x;
      sprite.y = this.y;
    });
    this.healthText.text = this.health;

    this.damageTexts.forEach(text => text.update(dt));
  }

  public setMovement(timestamp: number, position: ServerPlayer) {
    if (!this.isLocalPlayer) this.setVelocityFromMovement(position.move);
    this.movementController?.updatePositionFromServer(timestamp, position.position);
  }

  public destroy(): void {
    this.spritesContainer.destroy();
    super.destroy();
  }
}
