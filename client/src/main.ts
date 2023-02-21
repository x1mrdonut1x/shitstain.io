import { MAP_HEIGHT, MAP_WIDTH, TILE_WIDTH } from './constants';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: MAP_WIDTH * TILE_WIDTH,
  height: MAP_HEIGHT * TILE_WIDTH,
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

window.onload = () => {
  initialize();
};
