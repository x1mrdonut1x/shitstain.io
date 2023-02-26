import { GameState } from '@/components/GameState';
import { MAP_HEIGHT_PX, MAP_WIDTH_PX } from '../../../shared/constants';
import * as PIXI from 'pixi.js';

export class GameScene {
  private app: PIXI.Application;
  private gameState?: GameState;

  constructor() {
    this.app = new PIXI.Application({ width: MAP_WIDTH_PX, height: MAP_HEIGHT_PX });
    this.app.stage.interactive = true;
    this.app.stage.hitArea = this.app.screen;

    this.app.stage.pivot = { x: 0, y: 0 };
    // this.cameraContainer = new PIXI.Container();
    // this.app.stage.addChild(this.cameraContainer);

    document.body.appendChild(this.app.view as unknown as Node);

    this.preload();
  }

  async preload() {
    console.log('GameScene preload');

    const texture = PIXI.Texture.from('src/assets/background/Ground_Tile_02.png');
    const tilingSprite = new PIXI.TilingSprite(texture, MAP_WIDTH_PX, MAP_HEIGHT_PX);
    this.app.stage.addChild(tilingSprite);

    await PIXI.Assets.load('src/assets/wizards/fire-wizard/Charge/charge.json');

    this.create();
  }

  create() {
    console.log('GameScene create');

    // DEBUG
    this.addPointerTracker(this.app);

    this.gameState = new GameState(this.app.stage);

    this.update();
  }

  lastTimestamp = Date.now();
  update() {
    const now = Date.now();
    const dt = now - this.lastTimestamp;
    this.lastTimestamp = now;

    this.gameState?.update(dt);

    requestAnimationFrame(this.update.bind(this));
  }

  // DEBUG
  addPointerTracker(app: PIXI.Application) {
    const text = new PIXI.Text();
    text.style.fill = 'red';
    text.style.stroke = 'red';
    text.style.fontSize = 16;

    app.stage.addChild(text);

    app.stage.addEventListener('pointermove', e => {
      const x = Math.round(e.global.x + app.stage.pivot.x);
      const y = Math.round(e.global.y + app.stage.pivot.y);

      text.position.x = x + 10;
      text.position.y = y - 20;

      text.text = `x: ${x}, y: ${y}`;
    });
  }
}
