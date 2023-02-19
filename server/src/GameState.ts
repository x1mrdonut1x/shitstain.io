import { cloneDeep } from 'lodash';
import { ServerMovement, ServerPlayer } from '../../types';

export class GameState {
  private _players: ServerPlayer[] = [];

  get players() {
    return cloneDeep(this._players);
  }

  public getPlayerCount() {
    return this._players.length;
  }

  public addPlayer(id: string) {
    this._players.push({
      clientId: id,
      x: Math.random() * 1100 + 100,
      y: Math.random() * 600 + 100,
      move: {},
    });
  }

  public removePlayer(id: string) {
    this._players = this._players.filter(p => p.clientId === id);
  }

  public movePlayer(id: string, data: ServerMovement) {
    const foundPlayer = this._players.find(p => p.clientId === id);

    if (foundPlayer) {
      foundPlayer.move = data;
    }
  }
}
