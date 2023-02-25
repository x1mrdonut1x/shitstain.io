import { io as client, Socket } from 'socket.io-client';
import { ClientShootData, ServerObject, ServerShootData } from '../../../shared/types';
import {
  GetPlayersEvent,
  GetWorldStateEvent,
  PlayerConnectEvent,
  PlayerMoveEvent,
  SocketEvent,
} from '../../../shared/types/events';

class GameServer {
  public clientId!: string; // initialized in main.ts
  private io!: Socket; // initialized in main.ts

  constructor() {
    console.log('GameServer constructor');
    this.io = client(import.meta.env.VITE_SOCKET_SERVER);
  }

  async init() {
    console.log('GameServer initialized');

    return new Promise(resolve => {
      this.io.on('message', (id: string) => {
        this.clientId = id;

        return resolve(this.clientId);
      });
    });
  }

  get createPlayer() {
    return this.createSocket<PlayerConnectEvent>(SocketEvent.PLAYER_CONNECT);
  }

  get getPlayers() {
    return this.createSocket<GetPlayersEvent>(SocketEvent.PLAYERS);
  }

  get movePlayer() {
    return this.createSocket<PlayerMoveEvent>(SocketEvent.PLAYER_MOVE);
  }

  get getWorldState() {
    return this.createSocket<GetWorldStateEvent>(SocketEvent.OBJECTS_CHANGE);
  }

  get getWorldObjects() {
    return this.createSocket<ServerObject[]>(SocketEvent.WORLD_OBJECTS);
  }

  get shoot() {
    return this.createSocket<ClientShootData, ServerShootData>(SocketEvent.PLAYER_SHOOT);
  }

  private createSocket<TEmit = unknown, TOn = TEmit, TOff = TEmit>(
    event: SocketEvent
  ): DataSocket<TEmit, TOn, TOff> {
    return {
      emit: this.emitCallback.bind(this)(event),
      on: this.onCallback.bind(this)(event),
      off: this.offCallback.bind(this)(event),
    };
  }

  private emitCallback<T>(event: string) {
    return (data: T): void => {
      // console.log('emitCallback', event, this.clientId);
      this.io.emit(event, { clientId: this.clientId, ...data });
    };
  }

  private onCallback<T>(event: string) {
    return (callback: ListenerCallback<T>): void => {
      this.io.on(event, callback);
    };
  }

  private offCallback<T>(event: string) {
    return (callback?: ListenerCallback<T>): void => {
      this.io.off(event, callback);
    };
  }
}

export interface DataSocket<TEmit, TOn, TOff> {
  emit: (data?: Omit<TEmit, 'clientId'>) => void;
  on: (callback: ListenerCallback<TOn>) => void;
  off: (callback?: ListenerCallback<TOff>) => void;
}

interface ListenerCallback<T> {
  (data: T): void;
}

export let gameServer: GameServer;

export async function createGameServer() {
  gameServer = new GameServer();
  await gameServer.init();

  return gameServer;
}
