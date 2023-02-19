import express from 'express';
import httpServer from 'http';
import { createSocketServer } from './socket-server';

const app = express();
const server = new httpServer.Server(app);

app.get('*', (_req, res) => {
  res.sendStatus(200);
});

createSocketServer(server);

server.listen(3000, async () => {
  console.log('Server is running');
});
