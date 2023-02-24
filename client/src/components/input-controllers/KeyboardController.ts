import { Scene } from 'phaser';
import { ServerMovement } from '../../../../shared/types';
interface Keys {
  [keyCode: string]: {
    key: Phaser.Input.Keyboard.Key;
    onDown: () => void;
    onUp: () => void;
  };
}

export class KeyboardController {
  private readonly keys: Keys = {};
  private events: (() => void)[] = [];
  private _movement: ServerMovement = { up: false, down: false, left: false, right: false };

  constructor(private scene: Scene) {
    this.initKeyboard();
  }

  public addEvent(callback: () => void) {
    this.events.push(callback);
  }

  get movement() {
    return { ...this._movement };
  }

  get isMoving() {
    return Boolean(
      this._movement.up || this._movement.down || this._movement.left || this._movement.right
    );
  }

  public update() {
    Object.keys(this.keys).forEach(key => {
      const entry = this.keys[key];

      if (Phaser.Input.Keyboard.JustDown(entry.key)) {
        entry.onDown();
      } else if (Phaser.Input.Keyboard.JustUp(entry.key)) {
        entry.onUp();
      }

      if (this.isMoving) {
        this.events.forEach(event => {
          event();
        });
      }
    });
  }

  private initKeyboard() {
    this.keys['W'] = {
      key: this.scene.input.keyboard.addKey('W'),
      onDown: () => this.onMoveUp(),
      onUp: () => {
        if (this.keys['S'].key.isDown) {
          this.onMoveDown();
        } else {
          this._movement.up = false;
        }
      },
    };

    this.keys['S'] = {
      key: this.scene.input.keyboard.addKey('S'),
      onDown: () => this.onMoveDown(),
      onUp: () => {
        if (this.keys['W'].key.isDown) {
          this.onMoveUp();
        } else {
          this._movement.down = false;
        }
      },
    };

    this.keys['A'] = {
      key: this.scene.input.keyboard.addKey('A'),
      onDown: () => this.onMoveLeft(),
      onUp: () => {
        if (this.keys['D'].key.isDown) {
          this.onMoveRight();
        } else {
          this._movement.left = false;
        }
      },
    };

    this.keys['D'] = {
      key: this.scene.input.keyboard.addKey('D'),
      onDown: () => this.onMoveRight(),
      onUp: () => {
        if (this.keys['A'].key.isDown) {
          this.onMoveLeft();
        } else {
          this._movement.right = false;
        }
      },
    };
  }

  private onMoveRight() {
    this._movement.left = false;
    this._movement.right = true;
  }

  private onMoveLeft() {
    this._movement.left = true;
    this._movement.right = false;
  }

  private onMoveUp() {
    this._movement.up = true;
    this._movement.down = false;
  }

  private onMoveDown() {
    this._movement.up = false;
    this._movement.down = true;
  }
}
