import { Scene } from 'phaser';
import { gameServer } from '@/networking/GameServer';

import fireWizardWalkUrl from '@/assets/wizards/fire-wizard/Walk.png';
import fireWizardIdleUrl from '@/assets/wizards/fire-wizard/Idle.png';
import fireWizardFireballUrl from '@/assets/wizards/fire-wizard/Fireball.png';
import tile1 from '@/assets/background/Ground_Tile_01.png';
import tile2 from '@/assets/background/Ground_Tile_02.png';
import fireballUrl from '@/assets/wizards/fire-wizard/Charge.png';
import { GameState } from '@/components/GameState';
import { MAP_HEIGHT, MAP_WIDTH, TILE_WIDTH } from '@/constants';

export class GameScene extends Scene {
  private gameState: GameState;

  constructor() {
    super('gameScene');
    this.gameState = new GameState(gameServer.clientId, this);
  }

  preload() {
    this.loadSprites();
  }

  create() {
    // this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT, true);
    // this.cameras.main.zoomTo(0.2);
    this.createAnimations();
    this.addBackground();

    gameServer.getPlayers.on(data => {
      console.log(data);
      this.gameState.updatePlayersFromServer(data);
    });

    gameServer.getWorldState.on(data => {
      this.gameState.movePlayers(data);
    });
  }

  update(time: number, delta: number) {
    this.gameState.updatePlayers(delta);
  }

  private loadSprite(key: string, path: string, size = 128) {
    this.load.spritesheet(key, path, {
      frameWidth: size,
      frameHeight: size,
    });
  }

  private addBackground() {
    const map = this.make.tilemap({
      width: MAP_WIDTH,
      height: MAP_HEIGHT,
      tileWidth: TILE_WIDTH,
      tileHeight: TILE_WIDTH,
    });
    const tiles = map.addTilesetImage('tile1', undefined, TILE_WIDTH, TILE_WIDTH);
    const layer = map.createBlankLayer('layer1', tiles);
    layer.randomize(0, 0, map.width, map.height, [0]);
  }

  private loadSprites() {
    this.loadSprite('fire-wizard-walk', fireWizardWalkUrl);
    this.loadSprite('fire-wizard-idle', fireWizardIdleUrl);
    this.loadSprite('fire-wizard-fireball', fireWizardFireballUrl);
    this.loadSprite('fire-ball', fireballUrl, 64);

    this.load.image('tile1', tile1);
    this.load.image('tile2', tile2);
  }

  private createAnimations() {
    this.anims.create({
      key: 'fire-wizard-idle',
      frames: this.anims.generateFrameNumbers('fire-wizard-idle', {}),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'fire-wizard-fireball',
      frames: this.anims.generateFrameNumbers('fire-wizard-fireball', {}),
      frameRate: 40,
      repeat: -1,
    });

    this.anims.create({
      key: 'fire-wizard-walk',
      frames: this.anims.generateFrameNumbers('fire-wizard-walk', {}),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'fire-ball',
      frames: this.anims.generateFrameNumbers('fire-ball', {}),
      frameRate: 20,
      repeat: 0,
    });
  }
}
