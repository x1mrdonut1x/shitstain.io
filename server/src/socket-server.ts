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

  const gameState = new GameState();
  gameLoop(gameState);

  io.on('connection', socket => {
    new SocketActions(socket, gameState);
  });
}

export function broadcast<T>(event: SocketEvent) {
  return (message?: T) => io?.emit(event, message);
}

const mainLoopMs = 1000 / 60;
const updateClientMs = 1000 / 10;

let mainLoopTick = Date.now();
let updateClientTick = Date.now();

const gameLoop = function (gameState: GameState) {
  const now = Date.now();

  if (mainLoopTick + mainLoopMs <= now) {
    const delta = now - mainLoopTick;
    mainLoopTick = now;

    update(gameState, delta);
  }

  if (updateClientTick + updateClientMs <= now) {
    updateClientTick = now;

    if (gameState.hasChanged) {
      broadcast<GetWorldStateEvent>(SocketEvent.OBJECTS_CHANGE)(gameState.players);
      gameState.hasChanged = false;
    }
  }

  if (Date.now() - mainLoopTick < mainLoopMs - 16) {
    setTimeout(() => gameLoop(gameState));
  } else {
    setImmediate(() => gameLoop(gameState));
  }
};

const update = (gameState: GameState, delta: number) => {
  gameState.updateMovement();
};
