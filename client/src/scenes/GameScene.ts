import { Scene } from 'phaser';
import { Player } from '@/components/Player';
import { gameServer } from '@/networking/GameServer';

import fireWizardWalkUrl from '@/assets/wizards/fire-wizard/Walk.png';
import fireWizardIdleUrl from '@/assets/wizards/fire-wizard/Idle.png';
import fireWizardFireballUrl from '@/assets/wizards/fire-wizard/Charge.png';

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

  update(time: number, delta: number) {
    this.players?.forEach(player => {
      player.update(delta);
    });
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
    this.loadSprite('fire-ball', fireWizardFireballUrl, 64);
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

    this.anims.create({
      key: 'fire-ball',
      frames: this.anims.generateFrameNumbers('fire-ball', {}),
      frameRate: 20,
      repeat: 0,
    });
  }
}
