import * as PIXI from 'pixi.js';

interface Keys {
  [x: string]: {
    isDown: boolean;
    onDown: () => void;
    onUp: () => void;
  };
}

export class PlayerMovementController {
  private readonly player: PIXI.Sprite;
  private readonly keys: Keys = {};
  private speed = 5;
  private velocityX = 0;
  private velocityY = 0;

  constructor(player: PIXI.Sprite) {
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

  public update(_delta: number) {
    const velocity = this.getVelocity();

    let newPlayerX: number = this.player.x + velocity.x;
    let newPlayerY: number = this.player.y + velocity.y;

    if (newPlayerX - this.player.width / 2 < 0) {
      newPlayerX = this.player.width / 2;
    }
    if (newPlayerX + this.player.width / 2 > document.body.clientWidth) {
      newPlayerX = document.body.clientWidth - this.player.width / 2;
    }
    if (newPlayerY - this.player.height / 2 < 0) {
      newPlayerY = this.player.height / 2;
    }
    if (newPlayerY + this.player.height / 2 > document.body.clientHeight) {
      newPlayerY = document.body.clientHeight - +this.player.height / 2;
    }

    this.player.position.x = newPlayerX;
    this.player.position.y = newPlayerY;
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
  }

  public onKeyDown(e: KeyboardEvent) {
    Object.keys(this.keys).forEach(key => {
      if (e.key === key) {
        this.keys[key].isDown = true;
        this.keys[key].onDown();
      }
    });
  }
}
