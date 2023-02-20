import { io as client, Socket } from 'socket.io-client';
import {
  GetPlayersEvent,
  GetWorldStateEvent,
  PlayerConnectEvent,
  PlayerMoveEvent,
  PlayerShootEvent,
  SocketEvent,
} from '../../../types/events';

class GameServer {
  public clientId!: string; // initialized in main.ts
  private io!: Socket; // initialized in main.ts

  constructor() {
    this.io = client(import.meta.env.VITE_SOCKET_SERVER);
  }

  async init() {
    this.io.on('message', (id: string) => {
      this.clientId = id;

      document.getElementById('loading')?.remove();

      this.createPlayer.emit();
    });
  }

  get createPlayer() {
    return this.createSocket<PlayerConnectEvent>(SocketEvent.PLAYER_CONNECT);
  }

  get getPlayers() {
    return this.createSocket.bind(this)<GetPlayersEvent>(SocketEvent.PLAYERS);
  }

  get movePlayer() {
    return this.createSocket<PlayerMoveEvent>(SocketEvent.PLAYER_MOVE);
  }

  get getWorldState() {
    return this.createSocket<GetWorldStateEvent>(SocketEvent.OBJECTS_CHANGE);
  }

  get shoot() {
    return this.createSocket<PlayerShootEvent>(SocketEvent.PLAYER_SHOOT);
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
      console.log('emitCallback', event, this.clientId);
      this.io.emit(event, { clientId: this.clientId, ...data });
    };
  }

  private onCallback<T>(event: string) {
    return (callback: ListenerCallback<T>): void => {
      console.log('onCallback', event);
      this.io.on(event, callback);
    };
  }

  private offCallback<T>(event: string) {
    return (callback?: ListenerCallback<T>): void => {
      console.log('offCallback', event);
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
