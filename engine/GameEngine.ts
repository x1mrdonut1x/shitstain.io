import { Enemy } from './components/Enemy';
import { Player } from './components/Player';

export class GameEngine<TPlayer extends Player, TEnemy extends Enemy> {
  public players: Set<TPlayer> = new Set();
  public enemies: Set<Enemy> = new Set();

  // Players
  public getPlayerById(id: string) {
    return Array.from(this.players).find(player => player.id === id);
  }

  public addPlayer(player: TPlayer) {
    this.players.add(player);
  }

  public removePlayer(player: TPlayer | string) {
    let foundPlayer: TPlayer | undefined;

    if (typeof player === 'string') {
      foundPlayer = this.getPlayerById(player);
    } else {
      foundPlayer = player;
    }

    if (foundPlayer) this.players.delete(foundPlayer);
  }

  private updatePlayers(dt: number) {
    this.players.forEach(player => player.update(dt));
  }

  // Enemies
  public addEnemy(enemy: TEnemy) {
    this.enemies.add(enemy);
  }

  public removeEnemy(enemy: TEnemy) {
    this.enemies.delete(enemy);
  }

  private updateEnemies(dt: number) {
    this.enemies.forEach(enemy => enemy.update(dt));
  }

  public update(dt: number) {
    this.updatePlayers(dt);
    this.updateEnemies(dt);
  }
}
