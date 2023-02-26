import { ServerMovement } from '../../../../shared/types';

interface Keys {
  [key: string]: {
    isDown: boolean;
    onDown: () => void;
    onUp: () => void;
  };
}

export class KeyboardController {
  private readonly keys: Keys = {};
  private _movement: ServerMovement = { up: false, down: false, left: false, right: false };
  private onMovement?: (movement: ServerMovement) => void;

  constructor(callback?: (move: ServerMovement) => void) {
    this.initKeyboard();
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));

    if (callback) this.onMovement = callback;
  }

  public onKeyUp(e: KeyboardEvent) {
    if (e.repeat) return;
    let hasAnyChanged = false;

    Object.keys(this.keys).forEach(key => {
      if (e.key === key) {
        hasAnyChanged = true;

        this.keys[key].isDown = false;
        this.keys[key].onUp.bind(this)();
      }
    });

    if (hasAnyChanged) this.onMovement?.(this._movement);
  }

  public onKeyDown(e: KeyboardEvent) {
    if (e.repeat) return;
    let hasAnyChanged = false;

    Object.keys(this.keys).forEach(key => {
      if (e.key === key) {
        hasAnyChanged = true;

        this.keys[key].isDown = true;
        this.keys[key].onDown.bind(this)();
      }
    });

    if (hasAnyChanged) this.onMovement?.(this._movement);
  }

  get movement() {
    return { ...this._movement };
  }

  get isMoving() {
    return Boolean(
      this._movement.up || this._movement.down || this._movement.left || this._movement.right
    );
  }

  private initKeyboard() {
    this.keys['w'] = {
      isDown: false,
      onDown: () => this.onMoveUp(),
      onUp: () => {
        if (this.keys['s']?.isDown) {
          this.onMoveDown();
        } else {
          this._movement.up = false;
        }
      },
    };

    this.keys['s'] = {
      isDown: false,
      onDown: () => this.onMoveDown(),
      onUp: () => {
        if (this.keys['w']?.isDown) {
          this.onMoveUp();
        } else {
          this._movement.down = false;
        }
      },
    };

    this.keys['a'] = {
      isDown: false,
      onDown: () => this.onMoveLeft(),
      onUp: () => {
        if (this.keys['d']?.isDown) {
          this.onMoveRight();
        } else {
          this._movement.left = false;
        }
      },
    };

    this.keys['d'] = {
      isDown: false,
      onDown: () => this.onMoveRight(),
      onUp: () => {
        if (this.keys['a']?.isDown) {
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
