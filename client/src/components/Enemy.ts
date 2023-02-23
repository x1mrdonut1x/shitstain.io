import { EnemyController } from '@/components/EnemyController';
import { GameState } from '@/components/GameState';
import { Scene } from 'phaser';

export class Enemy {
  private enemyController?: EnemyController;
  private health = 100;

  constructor(
    scene: Scene,
    world: Phaser.Physics.Matter.World,
    gameState: GameState,
    x: number,
    y: number
  ) {
    const enemy = scene.matter.add.rectangle(x, y, 50, 50);
    enemy.render.fillOpacity = 1;
    enemy.render.fillColor = 0x00ff00;
    enemy.render.opacity = 1;

    // this.setPosition(x, y);
    // this.setSize(100, 100);

    // this.setRectangle(50, 50);
    // this.setOrigin(0.75, 0.75);
    // this.enemyController = new EnemyController(this, gameState.players);

    world.add(this);
    // scene.sys.displayList.add(this);
    // scene.sys.updateList.add(this);
    // this.setCollisionGroup(1);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // this.setOnCollide((event: Phaser.Types.Physics.Matter.MatterCollisionData) => {
    //   // console.log(event.bodyA);
    //   // console.log(event.bodyB);
    // });
  }

  update() {
    // this.enemyController.update();
  }
}
