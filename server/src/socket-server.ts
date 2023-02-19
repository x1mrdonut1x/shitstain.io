import { Server } from 'socket.io';
import httpServer from 'http';
import { SocketActions } from './SocketActions';
import { SocketEvent } from '../../types/events';
import { GameState } from './GameState';

let io: Server;

export function createSocketServer(server: httpServer.Server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const gameState = new GameState();

  io.on('connection', socket => {
    new SocketActions(socket, gameState);
  });
}

export function broadcast<T>(event: SocketEvent) {
  return (message?: T) => io?.emit(event, message);
}
