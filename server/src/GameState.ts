import { Enemy } from '../../engine/components/Enemy';
import { Player } from '../../engine/components/Player';
import { GameEngine } from '../../engine/GameEngine';
import { ServerMovement } from '../../shared/types';

export class GameState {
  public hasChanged = false;
  public engine: GameEngine<Player, Enemy>;

  constructor() {
    this.engine = new GameEngine();
  }

  public getPlayerCount() {
    return this.engine.players.size;
  }

  public addPlayer(id: string) {
    this.hasChanged = true;

    const x = Math.random() * 1100 + 100;
    const y = Math.random() * 600 + 100;
    const entity = new Player(x, y, id);

    this.engine.addPlayer(entity);
  }

  public addEnemy() {
    this.hasChanged = true;

    const x = Math.random() * 100 + 100;
    const y = Math.random() * 100 + 100;
    const enemy = new Enemy(x, y);

    this.engine.addEnemy(enemy);
  }

  public removePlayer(id: string) {
    this.hasChanged = true;

    this.engine.removePlayer(id);
  }

  public movePlayer(id: string, data: ServerMovement) {
    this.hasChanged = true;
    const foundPlayer = this.engine.getPlayerById(id);

    foundPlayer?.setVelocityFromMovement(data);
  }
}
