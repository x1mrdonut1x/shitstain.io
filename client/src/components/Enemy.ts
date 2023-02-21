import { EnemyController } from '@/components/EnemyController';
import { GameState } from '@/components/GameState';
import { Physics, Scene } from 'phaser';

export class Enemy extends Physics.Matter.Sprite {
  private enemyController: EnemyController;

  constructor(
    scene: Scene,
    world: Phaser.Physics.Matter.World,
    gameState: GameState,
    x: number,
    y: number
  ) {
    super(world, x, y, 'monster-hydra-walk');
    this.setPosition(x, y);

    this.enemyController = new EnemyController(this, gameState.players);

    world.add(this);
    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
    this.setCollisionGroup(1);
  }

  update() {
    this.enemyController.update();

    this.anims.play('monster-hydra-walk', true);
  }
}
