// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { EnemyController } from '@/components/EnemyController';
import { DamageText } from './DamageText';
import * as PIXI from 'pixi.js';
import { Rectangle } from '../../../shared/engine/entities/Rectangle';

export class Enemy extends Rectangle {
  private enemyController?: EnemyController;
  private health = 100;
  private damageTexts: DamageText[] = [];

  constructor(private stage: PIXI.Container, x: number, y: number) {
    super(x, y, 50, 50);

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
  }

  update(delta: number) {
    this.damageTexts.forEach(text => text.update(delta));
  }
}
