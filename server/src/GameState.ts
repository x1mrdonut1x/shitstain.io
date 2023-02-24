import { cloneDeep } from 'lodash';
import Matter, { Bodies, Composite, World } from 'matter-js';
import { PlayerEntity } from '../../shared/entities/PlayerEntity';
import {
  ServerEnemy,
  ServerMovement,
  ServerPlayer,
  ServerWorldEnemy,
  ServerWorldPlayer,
} from '../../types';

export class GameState {
  public hasChanged = false;
  private _players: ServerWorldPlayer[] = [];
  private _enemies: ServerWorldEnemy[] = [];

  constructor(private world: World) {}

  get players() {
    return cloneDeep(this._players);
  }

  public getPlayerCount() {
    return this._players.length;
  }

  public addPlayer(id: string) {
    const x = Math.random() * 1100 + 100;
    const y = Math.random() * 600 + 100;
    const body = PlayerEntity.create(x, y);
    this.hasChanged = true;

    const serverPlayer: ServerPlayer = {
      clientId: id,
      x: body.position.x,
      y: body.position.y,
      bulletSpeed: 10, //px per tick
      speed: 200,
      move: {
        up: false,
        right: false,
        down: false,
        left: false,
      },
    };

    console.log('player', body.collisionFilter);
    this._players.push({ data: serverPlayer, body });
    Composite.add(this.world, body);
  }

  public addEnemy() {
    const x = Math.random() * 100 + 100;
    const y = Math.random() * 100 + 100;
    const body = Bodies.rectangle(x, y, 20, 60);
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

    this._enemies.push({ data: serverEnemy, body });
    World.add(this.world, body);
  }

  public removePlayer(id: string) {
    this.hasChanged = true;

    const foundPlayer = this._players.find(p => p.data.clientId === id);

    this._players = this._players.filter(p => p.data.clientId !== id);

    if (foundPlayer) World.remove(this.world, foundPlayer.body);
  }

  public movePlayer(id: string, data: ServerMovement) {
    this.hasChanged = true;
    const foundPlayer = this._players.find(p => p.data.clientId === id);

    if (foundPlayer) {
      foundPlayer.data.move = data;
    }
  }

  public updateMovement(delta: number) {
    let anyPlayerChanged = false;

    this._players.forEach(({ body, data }) => {
      let velocityX = 0;
      let velocityY = 0;

      if (data.move.up) {
        velocityY = -data.speed;
      }
      if (data.move.down) {
        velocityY = data.speed;
      }
      if (data.move.left) {
        velocityX = -data.speed;
      }
      if (data.move.right) {
        velocityX = data.speed;
      }
      body.position.x += velocityX * delta;
      body.position.y += velocityY * delta;
      Matter.Body.setVelocity(body, { x: 0, y: 0 });

      if (velocityX !== 0 || velocityY !== 0) {
        anyPlayerChanged = true;
      }
    });

    this.hasChanged = anyPlayerChanged;
  }
}
