import express from 'express';
import httpServer from 'http';
import { useEngine } from '../../shared/engine/controllers/engine.controller';
import { usePlayer } from './player.controller';
import { useSocket } from './socket.controller';
import { useWorld } from './world.controller';

const app = express();
const server = new httpServer.Server(app);

app.get('*', (_req, res) => {
  res.sendStatus(200);
});

const { startEngine } = useEngine();
const { createServer } = useSocket();
const { createWorld } = useWorld();
const { subscribePlayers } = usePlayer();

startEngine();
createServer(server);
createWorld();
subscribePlayers();

server.listen(3000, async () => {
  console.log('Server is running');
});
