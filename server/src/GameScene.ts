import { ServerSnapshot } from '../../shared/types';
import { GameState } from './GameState';
import { TIMESTEP, SNAPSHOT_STEP } from '../../shared/constants';
import { fromServerPlayer } from './SocketActions';

export class GameScene {
  public state: GameState;
  private loop: ReturnType<typeof setInterval> | undefined;
  public onSnapshot?: (snapshot: ServerSnapshot) => void;

  constructor() {
    this.state = new GameState();
  }

  public setOnSnapshot(callback: typeof this.onSnapshot) {
    this.onSnapshot = callback;
  }

  startGame() {
    let lastTimestamp = Date.now();

    this.loop = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTimestamp;
      lastTimestamp = now;

      this.state.engine.update(delta);
    }, TIMESTEP);

    setInterval(() => {
      const now = Date.now();

      this.onSnapshot?.({
        timestamp: now,
        state: {
          players: Array.from(this.state.engine.players).map(fromServerPlayer),
        },
      });
    }, SNAPSHOT_STEP);
  }

  stopGame() {
    clearInterval(this.loop);
  }
}
