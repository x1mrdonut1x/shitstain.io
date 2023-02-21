import { Server } from 'socket.io';
import httpServer from 'http';
import { SocketActions } from './SocketActions';
import { GetWorldStateEvent, SocketEvent } from '../../types/events';
import { GameState } from './GameState';

let io: Server;

export function createSocketServer(server: httpServer.Server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // let gameLoop: NodeJS.Timer;
  const gameState = new GameState();

  io.on('connection', socket => {
    new SocketActions(socket, gameState);
    gameLoop(gameState);

    // socket.on('disconnect', () => clearInterval(gameLoop));
  });
}

export function broadcast<T>(event: SocketEvent) {
  return (message?: T) => io?.emit(event, message);
}

const tickLengthMs = 1000 / 20;

/* gameLoop related variables */
// timestamp of each loop
let previousTick = Date.now();

const gameLoop = function (gameState: GameState) {
  const now = Date.now();

  if (previousTick + tickLengthMs <= now) {
    const delta = now - previousTick;
    previousTick = now;

    update(gameState, delta);

    // console.log('delta', `${delta}ms`, '(target: ' + tickLengthMs + 'ms)');
  }

  if (Date.now() - previousTick < tickLengthMs - 16) {
    setTimeout(() => gameLoop(gameState));
  } else {
    setImmediate(() => gameLoop(gameState));
  }
};

const update = (gameState: GameState, delta: number) => {
  broadcast<GetWorldStateEvent>(SocketEvent.OBJECTS_CHANGE)(gameState.players);
};
