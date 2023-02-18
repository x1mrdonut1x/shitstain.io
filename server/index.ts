import express, { static as staticMiddleware } from 'express';
import httpServer from 'http';
import path from 'path';

import { Server } from 'socket.io';

const app = express();
const server = new httpServer.Server(app);
const io = new Server(server);

app.use(staticMiddleware('dist'));

app.get('*', (_req, res) => {
  res.sendFile(path.resolve('./dist/client/index.html'));
});

let players: { id: number; x: number; y: number }[] = [];
io.on('connection', socket => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('newPlayer', (data: { id: number; x: number; y: number }) => {
    console.log(`player ${data.id} connected`);
    players.push(data);
    console.log(players);
    io.emit('playersPositions', players);
  });

  socket.on('playerMove', (data: { id: number; x: number; y: number }) => {
    console.log(`player ${data.id} moved x: ${data.x}, y: ${data.y}`);

    const foundPlayer = players.find(p => p.id === data.id);
    if (foundPlayer) {
      foundPlayer.x = data.x;
      foundPlayer.y = data.y;
    }

    io.emit('playersPositions', players);
  });

  socket.on('shoot', data => {
    console.log('shoot', data);
    socket.broadcast.emit('shoot', data);
  });
});

const PORT = 3000;
server.listen(PORT, async () => {
  console.log('Hi');
});
