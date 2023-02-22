import { cloneDeep } from 'lodash';
import { ServerMovement, ServerPlayer } from '../../types';

export class GameState {
  public hasChanged = false;
  private _players: ServerPlayer[] = [];

  get players() {
    return cloneDeep(this._players);
  }

  public getPlayerCount() {
    return this._players.length;
  }

  public addPlayer(id: string) {
    this.hasChanged = true;
    this._players.push({
      clientId: id,
      x: Math.random() * 1100 + 100,
      y: Math.random() * 600 + 100,
      speed: 4,
      move: {
        up: false,
        right: false,
        down: false,
        left: false,
      },
    });
  }

  public removePlayer(id: string) {
    this.hasChanged = true;
    this._players = this._players.filter(p => p.clientId !== id);
  }

  public movePlayer(id: string, data: ServerMovement) {
    this.hasChanged = true;
    const foundPlayer = this._players.find(p => p.clientId === id);

    if (foundPlayer) foundPlayer.move = data;
  }

  public updateMovement() {
    let anyPlayerChanged = false;

    this._players.forEach(player => {
      let velocityX = 0;
      let velocityY = 0;

      if (player.move.up) {
        velocityY = -player.speed;
      }
      if (player.move.down) {
        velocityY = player.speed;
      }
      if (player.move.left) {
        velocityX = -player.speed;
      }
      if (player.move.right) {
        velocityX = player.speed;
      }
      player.x += velocityX;
      player.y += velocityY;

      if (velocityX !== 0 || velocityY !== 0) {
        anyPlayerChanged = true;
      }
    });

    this.hasChanged = anyPlayerChanged;
  }
}
