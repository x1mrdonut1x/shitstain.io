import * as PIXI from 'pixi.js';
import { Player } from './Player';

const app = new PIXI.Application({ width: 640, height: 360 });
app.stage.interactive = true;
const players: Player[] = [];

function addPlayer() {
  const player = new Player(app.stage);
  players.push(player);

  app.stage.addChild(player.getPlayerContainer);
}

function init() {
  app.resizeTo = document.body;
  document.body.appendChild(app.view as any);

  addPointer();
  addPlayer();

  animate();
}

const oldTime = Date.now();
let timeElapsedOrigin = Date.now();
function animate() {
  const newTime = Date.now();
  const deltaTime = newTime - oldTime;
  const timeElapsed = newTime - timeElapsedOrigin;

  timeElapsedOrigin = Date.now();

  players.forEach(player => {
    player.update(deltaTime, timeElapsed);
  });

  app.renderer.render(app.stage);

  requestAnimationFrame(animate);
}

function addPointer() {
  // Create the circle
  const circle = app.stage.addChild(
    new PIXI.Graphics()
      .beginFill(0xffffff)
      .lineStyle({ color: 0x111111, alpha: 0.87, width: 1 })
      .drawCircle(0, 0, 8)
      .endFill()
  );
  circle.position.set(app.screen.width / 2, app.screen.height / 2);

  app.stage.hitArea = app.screen;

  // Follow the pointer
  app.stage.addEventListener('pointermove', e => {
    circle.position.copyFrom(e.global);
  });
}

init();
