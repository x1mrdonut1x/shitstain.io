import { EnemyController } from '@/components/EnemyController';
import { GameState } from '@/components/GameState';
import { Scene } from 'phaser';
import { DamageText } from './DamageText';

export class Enemy {
  private enemyController?: EnemyController;
  private health = 100;
  private damageTexts: DamageText[] = [];

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
    enemy.label = 'enemy';

    // this.enemyController = new EnemyController(this, gameState.players);

    world.add(this);
    // this.setCollisionGroup(1);

    enemy.onCollideCallback = (event: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      let enemy;
      let bullet;

      if (event.bodyA.label !== 'enemy') {
        bullet = event.bodyA;
        enemy = event.bodyB;
      } else {
        enemy = event.bodyA;
        bullet = event.bodyB;
      }

      // console.log('playerId', bullet.gameObject?.getData('playerId'));
      // console.log('damage', bullet.gameObject?.getData('damage'));
      // console.log('enemy', enemy);
      this.damageTexts.push(new DamageText(scene, enemy, bullet.gameObject?.getData('damage')));
    };
  }

  update(delta: number) {
    this.damageTexts.forEach(text => text.update(delta));
  }
}
