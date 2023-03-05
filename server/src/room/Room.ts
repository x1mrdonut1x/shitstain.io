import { GameScene } from '../game/GameScene';
import crypto from 'crypto';
import { io } from '../main';
import { SocketEvent } from '../../../shared/types/events';

export class Room {
  public readonly id: string;
  public readonly game: GameScene;
  public readonly players: Set<string> = new Set();

  constructor() {
    this.id = crypto.randomBytes(16).toString('hex');
    this.game = new GameScene();
    this.game.startGame();
    this.game.setOnSnapshot(data => {
      io.to(this.id).emit(SocketEvent.OBJECTS_CHANGE, data);
    });

    console.log('Room created:', this.id);
  }

  public addPlayer(clientId: string) {
    this.players.add(clientId);
  }

  public removePlayer(clientId: string) {
    this.players.delete(clientId);
  }
}
