import { Server } from 'socket.io';
import httpServer from 'http';
import { SocketEvent } from '../../shared/types/events';
import { useEngine } from '../../shared/engine/controllers/engine.controller';
import { Snapshot } from '../../shared/types/objects';

let io: Server;

export function useSocket() {
  const { onSnapshot } = useEngine();

  const createServer = (server: httpServer.Server) => {
    io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', socket => {
      socket.send(socket.id);
    });

    onSnapshot((snapshot: Snapshot) => {
      broadcast(SocketEvent.OBJECTS_CHANGE, snapshot);
    });
  };

  const broadcast = <T>(event: SocketEvent, data?: T) => {
    io?.emit(event, data);
  };

  const listen = <T>(event: SocketEvent, handler: (clientId: string, data: T) => void) => {
    io.on('connection', socket => {
      socket.on(event, data => handler(socket.id, data));
    });
  };

  return { createServer, broadcast, listen };
}
