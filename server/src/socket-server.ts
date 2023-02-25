import { Server } from 'socket.io';
import httpServer from 'http';
import { SocketActions } from './SocketActions';
import { GetWorldStateEvent, SocketEvent } from '../../shared/types/events';
import { GameEngine } from './GameEngine';
import { ServerSnapshot } from '../../shared/types';

let io: Server;

export function createSocketServer(server: httpServer.Server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const gameEngine = new GameEngine();
  gameEngine.startGame();
  gameEngine.onSnapshot((snapshot: ServerSnapshot) => {
    broadcast<GetWorldStateEvent>(SocketEvent.OBJECTS_CHANGE)(snapshot);
  });

  io.on('connection', socket => {
    new SocketActions(socket, gameEngine.state, gameEngine);
  });
}

export function broadcast<T>(event: SocketEvent) {
  return (message?: T) => io?.emit(event, message);
}
