import { MAP_HEIGHT, MAP_WIDTH, TILE_WIDTH } from './constants';
import { createGameServer } from './networking/GameServer';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: MAP_WIDTH * TILE_WIDTH,
  height: MAP_HEIGHT * TILE_WIDTH,
  pixelArt: true,
  parent: 'game-container',
  scene: [GameScene],
  physics: {
    default: 'arcade',
  },
};

async function initialize() {
  await createGameServer();

  new Phaser.Game(config);
}

initialize();
