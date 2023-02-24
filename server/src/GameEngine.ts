import { Bodies, Engine, World } from 'matter-js';
import { ServerObject, ServerSnapshot } from '../../types';
import { GameState } from './GameState';
import { TIMESTEP, SNAPSHOT_STEP, MAP_WIDTH_PX, MAP_HEIGHT_PX } from '../../shared/constants';
import { broadcast } from './socket-server';
import { SocketEvent } from '../../types/events';

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
    this.createWorldBounds();

    this.state = new GameState(this.engine.world);
  }

  public getWorldObjects() {
    const parsedBodies: ServerObject[] = this.engine.world.bodies.map(body => ({
      position: { x: body.position.x, y: body.position.y },
      vertices: body.vertices.map(v => ({ x: v.x, y: v.y })),
      label: body.label,
    }));

    return parsedBodies;
  }

  private createWorldBounds() {
    const WALL_THICKNESS = 200;

    this.updateWall(
      0 - WALL_THICKNESS,
      0 - WALL_THICKNESS,
      WALL_THICKNESS,
      MAP_HEIGHT_PX + WALL_THICKNESS * 2
    );

    this.updateWall(
      0 + MAP_WIDTH_PX,
      0 - WALL_THICKNESS,
      WALL_THICKNESS,
      MAP_HEIGHT_PX + WALL_THICKNESS * 2
    );

    this.updateWall(0, 0 - WALL_THICKNESS, MAP_WIDTH_PX, WALL_THICKNESS);
    this.updateWall(0, 0 + MAP_HEIGHT_PX, MAP_WIDTH_PX, WALL_THICKNESS);
  }

  private updateWall(x: number, y: number, width: number, height: number) {
    //  adjust center
    x += width / 2;
    y += height / 2;

    const body = Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      friction: 0,
      frictionStatic: 0,
      label: 'wall',
    });
    World.add(this.engine.world, body);
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
