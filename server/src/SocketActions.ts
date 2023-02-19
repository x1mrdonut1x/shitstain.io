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
    console.log('New socket connection', socket.id);

    this.registeredEvents.forEach(({ event, callback }) => {
      socket.on(event, callback);
    });
  }

  private registeredEvents = [
    createSocket(SocketEvent.DISCONNECT, this.handleDisconnectPlayer.bind(this)),
    createSocket<PlayerConnectEvent>(
      SocketEvent.PLAYER_CONNECT,
      this.handleCreatePlayer.bind(this)
    ),
    createSocket<PlayerMoveEvent>(SocketEvent.PLAYER_MOVE, this.handleMovePlayer.bind(this)),
    createSocket<PlayerShootEvent>(SocketEvent.PLAYER_SHOOT),
  ];

  private handleCreatePlayer(data: { clientId: string }) {
    console.log(`player ${data.clientId} connected`);

    this.gameState.addPlayer(data.clientId);

    broadcast<GetPlayersEvent>(SocketEvent.PLAYERS)(this.gameState.players);
    console.log('Total players', this.gameState.getPlayerCount());
  }

  private handleMovePlayer(data: PlayerMoveEvent) {
    this.gameState.movePlayer(data.clientId, data.movement);

    broadcast<GetWorldStateEvent>(SocketEvent.OBJECTS_CHANGE)(this.gameState.players);
  }

  private handleDisconnectPlayer() {
    console.log(`player ${this.socket.id} disconnected`);
    this.gameState.removePlayer(this.socket.id);

    broadcast<GetPlayersEvent>(SocketEvent.PLAYERS)(this.gameState.players);
    console.log('Total players', this.gameState.getPlayerCount());
  }
}

export function createSocket<T>(
  event: SocketEvent,
  action?: SocketActionFn<T>
): WrappedServerSocket<T> {
  const callback = action || broadcast(event);

  return { event, callback };
}
