import express, { static as staticMiddleware } from 'express';
import httpServer from 'http';
import { Server } from 'socket.io';
import { ServerMovement, ServerPlayer, ServerShootDirection as ServerShootData } from '../../types';

const app = express();
const server = new httpServer.Server(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('*', (_req, res) => {
  res.sendStatus(200);
});

let players: ServerPlayer[] = [];

io.on('connection', socket => {
  socket.send(socket.id);

  socket.on('disconnect', () => {
    players = players.filter(player => player.id !== socket.id);
  });

  socket.on('players:create', (data: { id: string }) => {
    console.log(`player ${data.id} connected`);

    players.push({
      id: data.id,
      x: Math.random() * 1400,
      y: Math.random() * 750,
    });

    io.emit('players', players);
  });

  socket.on('players:move', (data: { id: string; movement: ServerMovement }) => {
    const foundPlayer = players.find(p => p.id === data.id);
    if (foundPlayer) {
      foundPlayer.move = data.movement;
    }

    io.emit('objects:change', players);
  });

  socket.on('players:shoot', (data: ServerShootData ) => {
    io.emit('players:shoot', data);
  });
});

server.listen(3000, async () => {
  console.log('Server is running');
});
