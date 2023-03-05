import express from 'express';
import httpServer from 'http';
import { createSocketServer } from './SocketServer';
import { SocketActions } from './SocketActions';
import { SocketController } from './SocketController';
import { RoomController } from './room/RoomController';

const app = express();
const server = new httpServer.Server(app);

app.get('*', (_req, res) => {
  res.sendStatus(200);
});

server.listen(3000, async () => {
  console.log('Server is running');
});

// used by GameScene
export const io = createSocketServer(server);

export const rooms = new RoomController();

io.on('connection', socket => {
  const clientId = socket.id;

  // Register clientId on client side
  socket.send(clientId);

  const socketActions = new SocketActions(io, socket);
  new SocketController(socketActions);
});
