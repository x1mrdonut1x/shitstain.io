import { Socket } from 'socket.io';
import {
  GetPlayersEvent,
  GetWorldStateEvent,
  PlayerConnectEvent,
  PlayerMoveEvent,
  PlayerShootEvent,
  SocketEvent,
} from '../../types/events';
import { broadcast } from './socket-server';
import { GameState } from './GameState';

export interface WrappedServerSocket<T> {
  event: string;
  callback: SocketActionFn<T>;
}

type SocketActionFn<T> = (message: T) => void;

export class SocketActions {
  constructor(private socket: Socket, private gameState: GameState) {
    socket.send(socket.id);

    this.createSocket(SocketEvent.DISCONNECT).on(this.onPlayerDisconnect.bind(this));

    this.createSocket<PlayerConnectEvent>(SocketEvent.PLAYER_CONNECT).on(
      this.onPlayerConnected.bind(this)
    );

    this.createSocket<PlayerMoveEvent>(SocketEvent.PLAYER_MOVE).on(this.onPlayerMove.bind(this));

    this.createSocket<PlayerShootEvent>(SocketEvent.PLAYER_SHOOT).on(
      broadcast(SocketEvent.PLAYER_SHOOT)
    );
  }

  private onPlayerConnected(data: { clientId: string }) {
    console.log(`player ${data.clientId} connected`);

    this.gameState.addPlayer(data.clientId);

    broadcast<GetPlayersEvent>(SocketEvent.PLAYERS)(this.gameState.players);
    console.log('Total players', this.gameState.getPlayerCount());
  }

  private onPlayerDisconnect() {
    console.log(`player ${this.socket.id} disconnected`);
    this.gameState.removePlayer(this.socket.id);

    broadcast<GetPlayersEvent>(SocketEvent.PLAYERS)(this.gameState.players);
    console.log('Total players', this.gameState.getPlayerCount());
  }

  private onPlayerMove(data: PlayerMoveEvent) {
    this.gameState.movePlayer(data.clientId, data.movement);

    broadcast<GetWorldStateEvent>(SocketEvent.OBJECTS_CHANGE)(this.gameState.players);
  }

  private createSocket<T>(event: SocketEvent) {
    return {
      on: (callback: (data: T) => void) => {
        this.socket.on(event, callback);
      },
    };
  }
}
