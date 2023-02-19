import { Scene } from 'phaser';
import { gameServer } from '@/networking/GameServer';

import fireWizardWalkUrl from '@/assets/wizards/fire-wizard/Walk.png';
import fireWizardIdleUrl from '@/assets/wizards/fire-wizard/Idle.png';
import fireWizardFireballUrl from '@/assets/wizards/fire-wizard/Fireball.png';
import fireballUrl from '@/assets/wizards/fire-wizard/Charge.png';
import { GameState } from '@/components/GameState';

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
    this.createAnimations();

    gameServer.getPlayers.on.bind(this)(data => {
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

  private loadSprites() {
    this.loadSprite('fire-wizard-walk', fireWizardWalkUrl);
    this.loadSprite('fire-wizard-idle', fireWizardIdleUrl);
    this.loadSprite('fire-wizard-fireball', fireWizardFireballUrl);
    this.loadSprite('fire-ball', fireballUrl, 64);
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
