import { createGameServer } from './networking/GameServer';
import { GameScene } from './scenes/GameScene';

async function initialize() {
  await createGameServer();

  new GameScene();
}

initialize();
