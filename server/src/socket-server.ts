import { Server } from 'socket.io';
import httpServer from 'http';
import { SocketActions } from './SocketActions';
import { SocketEvent } from '../../shared/types/events';
import { GameState } from './GameState';
import GameEngine from './GameEngine';

let io: Server;

export function createSocketServer(server: httpServer.Server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const gameState = new GameState();
  const gameEngine = new GameEngine(gameState);

  io.on('connection', socket => {
    new SocketActions(socket, gameState);
  });
}

export function broadcast<T>(event: SocketEvent) {
  return (message?: T) => io?.emit(event, message);
}
