import { MAP_HEIGHT_PX, MAP_WIDTH_PX } from '../../shared/constants';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: MAP_WIDTH_PX,
  height: MAP_HEIGHT_PX,
  pixelArt: true,
  parent: 'game-container',
  scene: [GameScene],
  physics: {
    default: 'matter',
    matter: { gravity: false },
  },
};

async function initialize() {
  new Phaser.Game(config);
}

initialize();
