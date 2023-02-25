import { ServerSnapshot } from '../../shared/types';
import { GameState } from './GameState';
import { TIMESTEP, SNAPSHOT_STEP, MAP_WIDTH_PX, MAP_HEIGHT_PX } from '../../shared/constants';
import { Rectangle } from '../../engine/entities/Rectangle';

export class GameEngine {
  public state: GameState;
  private loop: ReturnType<typeof setInterval> | undefined;

  constructor() {
    this.createWorldBounds();

    this.state = new GameState();
  }

  public getWorldObjects() {
    // const parsedBodies: ServerObject[] = Array.from(this.world.bodies).map(body => ({
    //   position: { x: body.position.x, y: body.position.y },
    //   vertices: body.vertices.map(v => ({ x: v.x, y: v.y })),
    //   label: body.label,
    //   isStatic: body.isStatic,
    //   isSensor: body.isSensor,
    // }));
    // return parsedBodies;
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

    const body = new Rectangle(x, y, width, height);
  }

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
      lastTimestamp = now;

      this.state.updateMovement();
      this.state.updatePlayers(delta);
    }, TIMESTEP);

    setInterval(() => {
      const now = Date.now();

      this.handleSnapshot({
        timestamp: now,
        state: {
          players: this.state.players.map(player => {
            const { data, entity } = player;
            data.x = entity.position.x;
            data.y = entity.position.y;
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
