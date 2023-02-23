import { EnemyController } from '@/components/EnemyController';
import { GameState } from '@/components/GameState';
import { DamageText } from './DamageText';

import { Physics, Scene } from 'phaser';

export class Enemy extends Physics.Matter.Sprite {
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
    super(world, x, y, 'monster-hydra-walk', undefined, { label: 'enemy' });
    const body = this.body as MatterJS.BodyType;

    body.label = 'enemy';
    this.name = 'enemy';

    this.setRectangle(60, 50);
    this.setOrigin(0.65, 0.75);

    world.add(this);

    this.setOnCollide((event: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      let enemy;
      let bullet;

      if (event.bodyA.label === 'bullet') {
        bullet = event.bodyA;
        enemy = event.bodyB;
      } else {
        enemy = event.bodyA;
        bullet = event.bodyB;
      }

      this.damageTexts.push(new DamageText(scene, enemy, bullet.gameObject?.getData('damage')));
    });

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);

    this.anims.play('monster-hydra-walk', true);
  }

  update(delta: number) {
    this.damageTexts.forEach(text => text.update(delta));
  }
}
