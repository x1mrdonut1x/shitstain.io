import { Engine } from 'matter-js';
import { ServerSnapshot } from '../../types';
import { GameState } from './GameState';
import { TIMESTEP, SNAPSHOT_STEP, MAP_WIDTH_PX, MAP_HEIGHT_PX } from '../../shared/constants';

export class GameEngine {
  private engine: Engine;
  public state: GameState;
  private loop: ReturnType<typeof setInterval> | undefined;

  constructor() {
    this.engine = Engine.create({
      gravity: { y: 0, x: 0 },
    });

    this.engine.world.bounds = {
      min: { x: 0, y: 0 },
      max: { x: MAP_WIDTH_PX, y: MAP_HEIGHT_PX },
    };
    this.state = new GameState(this.engine.world);
  }

  // init() {
  //   createEnvironment(this.state, this.engine);
  //   this.registerPhysicsEvents();
  // }

  // onCollisionStart = (event: any) => {
  //   const pairs = event.pairs;

  //   for (let i = 0; i < pairs.length; i++) {
  //     const pair = pairs[i];
  //     const bodyA = pair.bodyA;
  //     const bodyB = pair.bodyB;
  //   }
  // };

  // registerPhysicsEvents() {
  //   // Collision Events
  //   Events.on(this.engine, 'collisionStart', this.onCollisionStart);
  // }

  private handleSnapshot: (snapshot: ServerSnapshot) => void = () => {
    /* empty */
  };

  public onSnapshot(callback: typeof this.handleSnapshot) {
    this.handleSnapshot = callback;
  }

  startGame() {
    let lastTimestamp = Date.now();

    this.loop = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTimestamp;

      this.state.updateMovement(delta / 1000);

      lastTimestamp = now;
      Engine.update(this.engine, delta);
    }, TIMESTEP);

    setInterval(() => {
      const now = Date.now();
      this.handleSnapshot({
        timestamp: now,
        state: {
          players: this.state.players.map(player => {
            const { data, body } = player;
            data.x = body.position.x;
            data.y = body.position.y;
            return data;
          }),
        },
      });
    }, SNAPSHOT_STEP);
  }

  stopGame() {
    clearInterval(this.loop);
  }
}
