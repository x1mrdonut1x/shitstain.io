import { cloneDeep } from 'lodash';
import { Player } from '../../engine/components/Player';
import { Rectangle } from '../../engine/entities/Rectangle';
import {
  ServerEnemy,
  ServerMovement,
  ServerPlayer,
  ServerWorldEnemy,
  ServerWorldPlayer,
} from '../../shared/types';

export class GameState {
  public hasChanged = false;
  private _players: ServerWorldPlayer[] = [];
  private _enemies: ServerWorldEnemy[] = [];

  get players() {
    return cloneDeep(this._players);
  }

  public getPlayerCount() {
    return this._players.length;
  }

  public addPlayer(id: string) {
    const x = Math.random() * 1100 + 100;
    const y = Math.random() * 600 + 100;
    const entity = new Player(x, y, id);
    this.hasChanged = true;

    const serverPlayer: ServerPlayer = {
      clientId: id,
      x: entity.position.x,
      y: entity.position.y,
      bulletSpeed: 10, //px per tick
      speed: 200,
      move: {
        up: false,
        right: false,
        down: false,
        left: false,
      },
    };

    this._players.push({ data: serverPlayer, entity: entity });
  }

  public addEnemy() {
    const x = Math.random() * 100 + 100;
    const y = Math.random() * 100 + 100;
    const body = new Rectangle(x, y, 20, 60);
    this.hasChanged = true;

    const serverEnemy: ServerEnemy = {
      x: body.position.x,
      y: body.position.y,
      speed: 200,
      move: {
        up: false,
        right: false,
        down: false,
        left: false,
      },
    };

    // this._enemies.push({ data: serverEnemy, body });
    // this.world.add(body);
  }

  public removePlayer(id: string) {
    this.hasChanged = true;

    this._players.find(p => p.data.clientId === id);

    this._players = this._players.filter(p => p.data.clientId !== id);
  }

  public movePlayer(id: string, data: ServerMovement) {
    this.hasChanged = true;
    const foundPlayer = this._players.find(p => p.data.clientId === id);

    if (foundPlayer) {
      foundPlayer.data.move = data;
    }
  }

  public updatePlayers(dt: number) {
    this._players.forEach(p => p.entity.update(dt));
  }

  public updateMovement() {
    let anyPlayerChanged = false;

    this._players.forEach(({ entity, data }) => {
      entity.setVelocityFromMovement(data.move);

      if (entity.velocity.x !== 0 || entity.velocity.y !== 0) {
        anyPlayerChanged = true;
      }
    });

    this.hasChanged = anyPlayerChanged;
  }
}
