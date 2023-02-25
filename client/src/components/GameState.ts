import { Enemy } from '@/components/Enemy';
import { gameServer } from '@/networking/GameServer';
import { log } from '@/utils/logAction';
import { GetPlayersEvent, GetWorldStateEvent } from '../../../shared/types/events';
import { Player } from './Player';
import * as PIXI from 'pixi.js';

export class GameState {
  public players: Player[] = [];
  public enemies: Enemy[] = [];

  constructor(private stage: PIXI.Container) {
    console.log('GameState.initialize');
    gameServer.getPlayers.on(data => {
      this.updatePlayersFromServer(data);
    });

    gameServer.getWorldState.on(data => {
      this.movePlayers(data);
    });

    gameServer.createPlayer.emit();

    Array.from(Array(10)).forEach((_, index) => {
      this.addEnemy(200, 100 + index * 100);
    });

    document.getElementById('loading')?.remove();
  }

  public addEnemy(x: number, y: number) {
    const newEnemy = new Enemy(this.stage, x, y);
    this.enemies.push(newEnemy);
    this.stage.addChild(newEnemy.sprite);
  }

  public getPlayerCount() {
    return this.players.length;
  }

  public addPlayer(id: string, x: number, y: number) {
    log(`Player ${id} connected`);
    this.players.push(new Player(this.stage, x, y, id));
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

  public updateEnemies(delta: number) {
    this.enemies.forEach(enemy => {
      enemy.update(delta);
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
      }
    });
  }

  public movePlayers(data: GetWorldStateEvent) {
    data.state.players.forEach(object => {
      const foundPlayer = this.players.find(player => player.id === object.clientId);
      foundPlayer?.setMovement(data.timestamp, object);
    });
  }
}
