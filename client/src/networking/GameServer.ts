import { io as client } from 'socket.io-client';
import { ServerMovement, ServerPlayer, ServerWorldObject } from '../../../types';

const io = client(import.meta.env.VITE_SOCKET_SERVER);

class GameServer {
  public clientId: string = 'unconnected';

  createPlayer() {
    io.emit('players:create', { id: this.clientId });
  }

  movePlayer(movement: ServerMovement) {
    io.emit('players:move', { id: this.clientId, movement });
  }

  onConnect(callback: (id: string) => void) {
    io.on('message', (id: string) => {
      console.log('message', id);
      this.clientId = id;
      callback(id);
    });
  }

  onPlayersChange(callback: (data: ServerPlayer[]) => void) {
    io.on('players', callback);
  }

  onWorldChange(callback: (data: ServerWorldObject[]) => void) {
    io.on('objects:change', callback);
  }
}

export const gameServer = new GameServer();
