import { cloneDeep } from 'lodash';
import { World, Bodies, Body } from 'matter-js';
import { ServerMovement, ServerPlayer, ServerWorldPlayer } from '../../types';

export class GameState {
  public hasChanged = false;
  private _players: ServerWorldPlayer[] = [];

  constructor(private world: World) {}

  get players() {
    return cloneDeep(this._players);
  }

  public getPlayerCount() {
    return this._players.length;
  }

  public addPlayer(id: string) {
    this.hasChanged = true;

    const x = Math.random() * 1100 + 100;
    const y = Math.random() * 600 + 100;

    const player = {
      clientId: id,
      x,
      y,
      speed: 4,
      move: {
        up: false,
        right: false,
        down: false,
        left: false,
      },
    };

    const body = Bodies.rectangle(x, y, 128, 128);

    this._players.push({ data: player, body });
    World.add(this.world, body);
  }

  public removePlayer(id: string) {
    this.hasChanged = true;
    this._players = this._players.filter(p => p.data.clientId !== id);
  }

  public movePlayer(id: string, data: ServerMovement) {
    this.hasChanged = true;
    const foundPlayer = this._players.find(p => p.data.clientId === id);

    if (foundPlayer) {
      foundPlayer.data.move = data;

      let y = 0;
      let x = 0;
      if (data.down) y = foundPlayer.data.speed;
      if (data.up) y = -foundPlayer.data.speed;
      if (data.left) x = -foundPlayer.data.speed;
      if (data.right) x = foundPlayer.data.speed;

      Body.setVelocity(foundPlayer.body, { x, y });
    }
  }

  public updateMovement() {
    let anyPlayerChanged = false;

    this._players.forEach(({ data: player }) => {
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
