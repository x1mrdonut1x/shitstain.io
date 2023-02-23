import { Enemy } from '@/components/Enemy';
// import { MAP_HEIGHT, MAP_WIDTH } from '@/constants';
import { gameServer } from '@/networking/GameServer';
import { log } from '@/utils/logAction';
import { Scene } from 'phaser';
import { GetPlayersEvent, GetWorldStateEvent } from '../../../types/events';
import { Player } from './Player';

export class GameState {
  public players: Player[] = [];
  public enemies: Enemy[] = [];

  constructor(private scene: Scene, private world: Phaser.Physics.Matter.World) {}

  public initialize() {
    console.log('GameState.initialize');
    gameServer.getPlayers.on(data => {
      this.updatePlayersFromServer(data);
    });

    gameServer.getWorldState.on(data => {
      this.movePlayers(data);
    });

    gameServer.createPlayer.emit();

    Array.from(Array(10)).forEach((_, index) => {
      this.addEnemy(400, 200 + index * 100);
    });

    document.getElementById('loading')?.remove();
  }

  public addEnemy(x: number, y: number) {
    const newEnemy = new Enemy(this.scene, this.world, this, x, y);
    this.enemies.push(newEnemy);
  }

  public getPlayerCount() {
    return this.players.length;
  }

  public addPlayer(id: string, x: number, y: number) {
    log(`Player ${id} connected`);
    this.players.push(new Player(this.scene, this.world, x, y, id));
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

  public updateEnemies() {
    this.enemies.forEach(enemy => {
      enemy.update();
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

    console.log('serverPlayers', data);
    console.log('localPlayers', this.players);
  }

  public movePlayers(data: GetWorldStateEvent) {
    // console.log(
    //   data.timestamp,
    //   data.state.players.map(player => `${Math.floor(player.x)}; ${Math.floor(player.y)}`)
    // );
    data.state.players.forEach(object => {
      const foundPlayer = this.players.find(player => player.id === object.clientId);

      foundPlayer?.setMovement(data.timestamp, object);
    });
  }
}
