import { Scene } from 'phaser';
import { Player } from '../components/Player';
import { gameServer } from '../networking/GameServer';

export class GameScene extends Scene {
  private players?: Player[];

  constructor() {
    super('gameScene');
  }

  preload() {
    this.loadSprites();
  }

  create() {
    this.createAnimations();

    gameServer.onPlayersChange(data => {
      this.players = data.map(({ id, x, y }) => {
        return new Player(this, x, y, id);
      });
    });

    gameServer.onWorldChange(objects => {
      objects.forEach(object => {
        const foundPlayer = this.players?.find(player => player.id === object.id);

        foundPlayer?.setMovement(object.move);
      });
    });

    gameServer.onConnect(() => {
      gameServer.createPlayer();
    });
  }

  update() {
    this.players?.forEach(player => player.move());
  }

  private loadSprite(key: string, path: string) {
    this.load.spritesheet(key, new URL(path, import.meta.url).href, {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  private loadSprites() {
    this.loadSprite('fire-wizard-walk', `../assets/wizards/fire-wizard/walk.png`);
    this.loadSprite('fire-wizard-idle', `../assets/wizards/fire-wizard/idle.png`);
  }

  private createAnimations() {
    this.anims.create({
      key: 'fire-wizard-idle',
      frames: this.anims.generateFrameNumbers('fire-wizard-idle', {}),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'fire-wizard-walk',
      frames: this.anims.generateFrameNumbers('fire-wizard-walk', {}),
      frameRate: 20,
      repeat: -1,
    });
  }
}
