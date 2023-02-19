import { log } from '@/utils/logAction';
import { Scene } from 'phaser';
import { GetPlayersEvent, GetWorldStateEvent } from '../../../types/events';
import { Player } from './Player';

export class GameState {
  public players: Player[] = [];

  constructor(private clientId: string, private scene: Scene) {}

  public getPlayerCount() {
    return this.players.length;
  }

  public addPlayer(id: string, x: number, y: number) {
    log(`Player ${id} connected`);
    this.players.push(new Player(this.scene, x, y, id));
  }

  public removePlayer(id: string) {
    const foundPlayer = this.players.find(player => player.id === id);

    if (foundPlayer) {
      log(`Player ${id} disconnected`);
      foundPlayer.destroy(true);
      this.players = this.players.filter(p => p.id !== id);
    }
  }

  public updatePlayers(delta: number) {
    this.players.forEach(player => {
      player.update(delta);
    });
  }

  public updatePlayersFromServer(data: GetPlayersEvent) {
    this.players.forEach(localPlayer => {
      if (!data.find(serverPlayer => localPlayer.id === serverPlayer.clientId)) {
        this.removePlayer(localPlayer.id);
      }
    });

    data.forEach(serverPlayer => {
      const foundPlayer = this.players.find(
        localPlayer => localPlayer.id === serverPlayer.clientId
      );

      if (!foundPlayer) {
        this.addPlayer(serverPlayer.clientId, serverPlayer.x, serverPlayer.y);
      } else {
        foundPlayer.setMovement(serverPlayer.move);
      }
    });

    console.log('serverPlayers', data);
    console.log('localPlayers', this.players);
  }

  public movePlayers(data: GetWorldStateEvent) {
    data.forEach(object => {
      const foundPlayer = this.players.find(player => player.id === object.clientId);

      if (foundPlayer && object.move) {
        foundPlayer?.setMovement(object.move);
      }
    });
  }
}
