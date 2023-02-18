import { GameScene } from './scenes/GameScene';

const config = {
  type: Phaser.AUTO,
  width: 1400,
  height: 750,
  backgroundColor: '#FFFFF',
  parent: 'game-container',
  scene: [GameScene],
  physics: {
    default: 'arcade',
  },
};

export default new Phaser.Game(config);
