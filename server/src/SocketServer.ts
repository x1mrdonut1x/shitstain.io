import { Server } from 'socket.io';
import httpServer from 'http';

export function createSocketServer(server: httpServer.Server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  return io;
}
