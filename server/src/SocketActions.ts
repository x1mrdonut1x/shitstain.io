import { Socket } from 'socket.io';
import {
  GetPlayersEvent,
  PlayerConnectEvent,
  PlayerMoveEvent,
  SocketEvent,
} from '../../types/events';
import { broadcast } from './socket-server';
import { GameState } from './GameState';
import { ClientShootData, ServerShootData } from '../../types';

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

    this.createSocket<ClientShootData>(SocketEvent.PLAYER_SHOOT).on(this.onPlayerShoot.bind(this));
  }

  private onPlayerShoot(data: ClientShootData) {
    const foundPlayer = this.gameState.players.find(p => p.data.clientId === data.clientId);
    if (!foundPlayer) return;

    const output: ServerShootData = {
      clientId: data.clientId,
      isShooting: data.isShooting,
      mousePos: data.mousePos,
      playerPos: {
        x: foundPlayer?.data.x,
        y: foundPlayer.data.y,
      },
    };

    broadcast(SocketEvent.PLAYER_SHOOT)(output);
  }

  private onPlayerConnected(data: { clientId: string }) {
    console.log(`player ${data.clientId} connected`);

    this.gameState.addPlayer(data.clientId);

    broadcast<GetPlayersEvent>(SocketEvent.PLAYERS)(this.gameState.players.map(p => p.data));
    console.log('Total players', this.gameState.getPlayerCount());
  }

  private onPlayerDisconnect() {
    console.log(`player ${this.socket.id} disconnected`);
    this.gameState.removePlayer(this.socket.id);

    broadcast<GetPlayersEvent>(SocketEvent.PLAYERS)(this.gameState.players.map(p => p.data));
    console.log('Total players', this.gameState.getPlayerCount());
  }

  private onPlayerMove(data: PlayerMoveEvent) {
    this.gameState.movePlayer(data.clientId, data.movement);
  }

  private createSocket<T>(event: SocketEvent) {
    return {
      on: (callback: (data: T) => void) => {
        this.socket.on(event, callback);
      },
    };
  }
}
