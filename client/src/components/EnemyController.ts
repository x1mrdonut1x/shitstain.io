import { Enemy } from '@/components/Enemy';
import { Player } from '@/components/Player';

export class EnemyController {
  private readonly speed = 2;

  constructor(private enemy: Enemy, private players: Player[]) {}

  // public update() {
  //   let minDistance = Number.MAX_SAFE_INTEGER;
  //   let minIndex = 0;

  //   let direction = { x: Math.random(), y: Math.random() };

  //   if (this.players.length) {
  //     for (let i = 0; i < this.players.length; i++) {
  //       const distance = Phaser.Math.Distance.BetweenPoints(this.enemy, this.players[i]);
  //       if (distance < minDistance) {
  //         minDistance = distance;
  //         minIndex = i;
  //       }
  //     }

  //     direction = {
  //       x: Math.round(this.players[minIndex].x - this.enemy.x),
  //       y: Math.round(this.players[minIndex].y - this.enemy.y),
  //     };
  //   }

  //   const angle = Math.atan2(direction.y, direction.x);

  //   const velocityX = Math.cos(angle) * this.speed;
  //   const velocityY = Math.sin(angle) * this.speed;

  //   this.enemy.x += velocityX;
  //   this.enemy.y += velocityY;

  //   this.enemy.flipX = velocityX < 0;
  // }
}
