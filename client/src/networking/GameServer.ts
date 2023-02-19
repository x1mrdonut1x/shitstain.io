import { io as client } from 'socket.io-client';
import { ServerMovement, ServerPlayer, ServerShootData, ServerWorldObject } from '../../../types';
import { SocketEvent } from '../../../types/events';

const io = client(import.meta.env.VITE_SOCKET_SERVER);

class GameServer {
  public clientId = 'unconnected';

  createPlayer() {
    io.emit(SocketEvent.PLAYER_CREATE, { id: this.clientId });
  }

  movePlayer(movement: ServerMovement) {
    io.emit(SocketEvent.PLAYER_MOVE, { id: this.clientId, movement });
  }

  onConnect(callback: (id: string) => void) {
    io.on('message', (id: string) => {
      console.log('message', id);
      this.clientId = id;
      callback(id);
    });
  }

  onPlayersChange(callback: (data: ServerPlayer[]) => void) {
    io.on(SocketEvent.PLAYER, callback);
  }

  onWorldChange(callback: (data: ServerWorldObject[]) => void) {
    io.on(SocketEvent.OBJECTS_CHANGE, callback);
  }

  get shoot() {
    return {
      emit: (data: ServerShootData) => io.emit(SocketEvent.PLAYER_SHOOT, data),
      on: (callback: (data: ServerShootData) => void) => {
        io.on(SocketEvent.PLAYER_SHOOT, callback);
      },
    };
  }
}

export const gameServer = new GameServer();
