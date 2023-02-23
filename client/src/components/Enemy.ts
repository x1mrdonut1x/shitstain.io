import { EnemyController } from '@/components/EnemyController';
import { GameState } from '@/components/GameState';
import { Physics, Scene } from 'phaser';

export class Enemy extends Physics.Matter.Sprite {
  private enemyController?: EnemyController;
  private health = 100;

  constructor(
    scene: Scene,
    world: Phaser.Physics.Matter.World,
    gameState: GameState,
    x: number,
    y: number
  ) {
    super(world, x, y, 'monster-hydra-walk');

    // this.setPosition(x, y);
    // this.setSize(100, 100);

    // this.setRectangle(50, 50);
    // this.setOrigin(0.75, 0.75);
    // this.enemyController = new EnemyController(this, gameState.players);

    // scene.sys.displayList.add(this);
    // scene.sys.updateList.add(this);
    // this.setCollisionGroup(1);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // this.setOnCollide((event: Phaser.Types.Physics.Matter.MatterCollisionData) => {
    //   // console.log(event.bodyA);
    //   // console.log(event.bodyB);
    // });
    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);

    this.anims.play('monster-hydra-walk', true);
  }

  update() {
    // this.enemyController.update();
  }
}
