import * as PIXI from 'pixi.js';
import { eventEmitter } from './EventEmitter';
import { Player } from './Player';

interface Keys {
  [x: string]: {
    isDown: boolean;
    onDown: () => void;
    onUp: () => void;
  };
}

export class PlayerMovementController {
  private readonly player: Player;
  private readonly keys: Keys = {};
  private speed = 5;
  private velocityX = 0;
  private velocityY = 0;

  constructor(player: Player) {
    this.player = player;
    this.setUpKeyboard();

    // TODO should this be here?
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  private onRight() {
    this.velocityX = this.speed;
  }

  private onLeft() {
    this.velocityX = -this.speed;
  }

  private onUp() {
    this.velocityY = -this.speed;
  }

  private onDown() {
    this.velocityY = this.speed;
  }

  public getVelocity() {
    return { x: this.velocityX, y: this.velocityY };
  }

  private getNewPosition() {
    const velocity = this.getVelocity();
    const sprite = this.player.sprite;

    let newPlayerX: number = sprite.x + velocity.x;
    let newPlayerY: number = sprite.y + velocity.y;

    if (newPlayerX - sprite.width / 2 < 0) {
      newPlayerX = sprite.width / 2;
    }
    if (newPlayerX + sprite.width / 2 > document.body.clientWidth) {
      newPlayerX = document.body.clientWidth - sprite.width / 2;
    }
    if (newPlayerY - sprite.height / 2 < 0) {
      newPlayerY = sprite.height / 2;
    }
    if (newPlayerY + sprite.height / 2 > document.body.clientHeight) {
      newPlayerY = document.body.clientHeight - +sprite.height / 2;
    }

    return { x: newPlayerX, y: newPlayerY };
  }

  public update(_delta: number) {
    const { x, y } = this.getNewPosition();

    this.player.sprite.position.x = x;
    this.player.sprite.position.y = y;
  }

  private setUpKeyboard() {
    this.keys['w'] = {
      isDown: false,
      onDown: this.onUp.bind(this),
      onUp: () => {
        if (this.keys?.['s'].isDown) {
          this.onDown.bind(this)();
        } else {
          this.velocityY = 0;
        }
      },
    };

    this.keys['s'] = {
      isDown: false,
      onDown: this.onDown.bind(this),
      onUp: () => {
        if (this.keys?.['w'].isDown) {
          this.onUp.bind(this)();
        } else {
          this.velocityY = 0;
        }
      },
    };

    this.keys['a'] = {
      isDown: false,
      onDown: this.onLeft.bind(this),
      onUp: () => {
        if (this.keys?.['d'].isDown) {
          this.onRight.bind(this)();
        } else {
          this.velocityX = 0;
        }
      },
    };

    this.keys['d'] = {
      isDown: false,
      onDown: this.onRight.bind(this),
      onUp: () => {
        if (this.keys?.['a'].isDown) {
          this.onLeft();
        } else {
          this.velocityX = 0;
        }
      },
    };
  }

  public onKeyUp(e: KeyboardEvent) {
    Object.keys(this.keys).forEach(key => {
      if (e.key === key) {
        this.keys[key].isDown = false;
        this.keys[key].onUp();
      }
    });
    const { x, y } = this.getNewPosition();
    eventEmitter.move.emit({ id: this.player.id, x, y });
  }

  public onKeyDown(e: KeyboardEvent) {
    Object.keys(this.keys).forEach(key => {
      if (e.key === key) {
        this.keys[key].isDown = true;
        this.keys[key].onDown();
      }
    });
    const { x, y } = this.getNewPosition();
    eventEmitter.move.emit({ id: this.player.id, x, y });
  }
}
