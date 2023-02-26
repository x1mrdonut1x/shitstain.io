import { Server } from 'socket.io';
import httpServer from 'http';
import { SocketActions } from './SocketActions';
import { GetWorldStateEvent, SocketEvent } from '../../shared/types/events';
import { GameScene } from './GameScene';
import { ServerSnapshot } from '../../shared/types';

let io: Server;

export function createSocketServer(server: httpServer.Server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const gameEngine = new GameScene();
  gameEngine.startGame();
  gameEngine.setOnSnapshot((snapshot: ServerSnapshot) => {
    broadcast<GetWorldStateEvent>(SocketEvent.OBJECTS_CHANGE)(snapshot);
  });

  io.on('connection', socket => {
    new SocketActions(socket, gameEngine.state);
  });
}

export function broadcast<T>(event: SocketEvent) {
  return (message?: T) => io?.emit(event, message);
}
