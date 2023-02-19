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
  public clientId: string | undefined;
  private io: Socket | undefined;

  constructor() {
    this.io = client(import.meta.env.VITE_SOCKET_SERVER);

    this.io.on('message', (id: string) => {
      this.clientId = id;
      console.log('clientId', this.clientId);
      this.createPlayer.emit();
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

  get shoot() {
    return this.createSocket<PlayerShootEvent>(SocketEvent.PLAYER_SHOOT);
  }

  private createSocket<TEmit = unknown, TOn = TEmit, TOff = TEmit>(
    event: SocketEvent
  ): DataSocket<TEmit, TOn, TOff> {
    return {
      emit: this.emitCallback(event),
      on: this.onCallback(event),
      off: this.offCallback(event),
    };
  }

  private emitCallback<T>(event: string) {
    return (data: T): void => {
      console.log('emitCallback', event, this.clientId);
      this.io?.emit(event, { clientId: this.clientId, ...data });
    };
  }

  private onCallback<T>(event: string) {
    return (callback: ListenerCallback<T>): void => {
      console.log('onCallback', event);
      this.io?.on(event, callback);
    };
  }

  private offCallback<T>(event: string) {
    return (callback?: ListenerCallback<T>): void => {
      console.log('offCallback', event);
      this.io?.off(event, callback);
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

export const gameServer = new GameServer();
