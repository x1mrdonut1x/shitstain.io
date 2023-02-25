import { GameState } from '@/components/GameState';
import { MAP_HEIGHT_PX, MAP_WIDTH_PX } from '../../../shared/constants';
import tile from '../assets/background/Ground_Tile_02.png';
import * as PIXI from 'pixi.js';

export class GameScene {
  private app: PIXI.Application;
  private gameState?: GameState;

  constructor() {
    this.app = new PIXI.Application({ width: MAP_WIDTH_PX, height: MAP_HEIGHT_PX });
    this.app.stage.interactive = true;
    this.app.stage.hitArea = this.app.screen;

    this.preload();
  }

  preload() {
    console.log('GameScene preload');

    const texture = PIXI.Texture.from(tile);
    const tilingSprite = new PIXI.TilingSprite(texture, MAP_WIDTH_PX, MAP_HEIGHT_PX);
    this.app.stage.addChild(tilingSprite);

    this.create();
  }

  create() {
    console.log('GameScene create');

    // DEBUG
    this.addPointerTracker(this.app);

    this.gameState = new GameState(this.app.stage);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document.body.appendChild(this.app.view as any);

    this.update();
  }

  lastTimestamp = Date.now();
  update() {
    const now = Date.now();
    const dt = now - this.lastTimestamp;
    this.lastTimestamp = now;
    this.gameState?.updatePlayers(dt);
    this.gameState?.updateEnemies(dt);

    requestAnimationFrame(this.update.bind(this));
  }

  addPointerTracker(app: PIXI.Application) {
    const text = new PIXI.Text('asd');
    text.style.fill = 'red';
    text.style.stroke = 'red';
    text.style.fontSize = 16;

    app.stage.addChild(text);

    // Follow the pointer
    app.stage.addEventListener('pointermove', e => {
      text.position.x = e.global.x + 10;
      text.position.y = e.global.y - 20;
      text.text = `x: ${e.global.x}, y: ${e.global.y}`;
    });
  }
}
