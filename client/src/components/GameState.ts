import { Enemy } from '@/components/Enemy';
import { gameServer } from '@/networking/GameServer';
import { log } from '@/utils/logAction';
import { GetPlayersEvent, GetWorldStateEvent } from '../../../shared/types/events';
import { Player } from './Player';
import * as PIXI from 'pixi.js';
import { GameEngine } from '../../../engine/GameEngine';

export class GameState extends GameEngine<Player, Enemy> {
  public players: Set<Player> = new Set();
  public enemies: Set<Enemy> = new Set();

  constructor(private stage: PIXI.Container) {
    super();
    console.log('GameState.initialize');
    gameServer.getPlayers.on(data => {
      this.updatePlayersFromServer(data);
    });

    gameServer.getWorldState.on(data => {
      this.movePlayers(data);
    });

    gameServer.createPlayer.emit();

    Array.from(Array(10)).forEach((_, index) => {
      const enemy = new Enemy(this.stage, this, 200, 100 + index * 100);
      this.addEnemy(enemy);
    });

    document.getElementById('loading')?.remove();
  }

  public addEnemy(enemy: Enemy) {
    super.addEnemy(enemy);

    this.stage.addChild(enemy.sprite);
  }

  public addPlayer(player: Player) {
    super.addPlayer(player);

    log(`Player ${player.id} connected`);
    this.stage.addChild(player.sprite);
  }

  public removePlayer(player: Player) {
    super.removePlayer(player);

    log(`Player ${player.id} disconnected`);
    player.sprite.destroy(true);
  }

  public updatePlayersFromServer(data: GetPlayersEvent) {
    this.players.forEach(localPlayer => {
      if (!data.find(serverPlayer => localPlayer.id === serverPlayer.clientId)) {
        this.removePlayer(localPlayer);
      }
    });

    data.forEach(serverPlayer => {
      const {
        clientId,
        position: { x, y },
      } = serverPlayer;
      const foundPlayer = this.getPlayerById(clientId);

      if (!foundPlayer) {
        const player = new Player(this.stage, this, x, y, clientId);
        this.addPlayer(player);
      }
    });
  }

  public movePlayers(data: GetWorldStateEvent) {
    data.state.players.forEach(object => {
      const foundPlayer = this.getPlayerById(object.clientId);
      foundPlayer?.setMovement(data.timestamp, object);
    });
  }
}
