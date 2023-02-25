import { GameState } from '@/components/GameState';
import { MAP_HEIGHT_PX, MAP_WIDTH_PX } from '../../../shared/constants';
import * as PIXI from 'pixi.js';
import { World } from '../../../shared/engine/entities/World';
import { Player } from '@/components/Player';

export class GameScene {
  private gameState?: GameState;

  constructor() {
    console.log('GameScene constructor');

    this.preload();
  }

  preload() {
    console.log('GameScene preload');

    this.create();
  }

  create() {
    console.log('GameScene create');
    const app = new PIXI.Application({ width: MAP_WIDTH_PX, height: MAP_HEIGHT_PX });
    app.stage.interactive = true;

    const world = new World();
    this.gameState = new GameState(app.stage);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document.body.appendChild(app.view as any);

    const player = new Player(app.stage, 100, 100, 'dupa');
    world.add(player);

    this.update();
  }

  lastTimestamp = Date.now();
  update() {
    const now = Date.now();
    const dt = now - this.lastTimestamp;
    this.lastTimestamp = now;
    this.gameState?.updatePlayers(dt);
    // this.gameState?.updateEnemies(dt);

    requestAnimationFrame(this.update.bind(this));
  }
}
