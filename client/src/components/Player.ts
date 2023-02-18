import { Physics, Scene, Types } from 'phaser';

interface Keys {
  [keyCode: string]: {
    key: Phaser.Input.Keyboard.Key;
    onDown: () => void;
    onUp: () => void;
  };
}

export class Player extends Physics.Arcade.Sprite {
  private readonly speed = 200;
  private readonly keys: Keys = {};

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'fireWizard');

    scene.physics.add.existing(this);
    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);

    this.initKeyboard();
  }

  private initKeyboard() {
    this.keys['W'] = {
      key: this.scene.input.keyboard.addKey('W'),
      onDown: () => this.onMoveUp(),
      onUp: () => {
        if (this.keys['S'].key.isDown) {
          this.onMoveDown();
        } else {
          this.setVelocityY(0);
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
          this.setVelocityY(0);
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
          this.setVelocityX(0);
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
          this.setVelocityX(0);
        }
      },
    };
  }

  private onMoveRight() {
    this.setVelocityX(this.speed);
    this.flipX = false;
  }

  private onMoveLeft() {
    this.setVelocityX(-this.speed);
    this.flipX = true;
  }

  private onMoveUp() {
    this.setVelocityY(-this.speed);
  }

  private onMoveDown() {
    this.setVelocityY(this.speed);
  }

  public move() {
    Object.keys(this.keys).forEach(key => {
      const entry = this.keys[key];

      if (Phaser.Input.Keyboard.JustDown(entry.key)) {
        entry.onDown();
      } else if (Phaser.Input.Keyboard.JustUp(entry.key)) {
        entry.onUp();
      }
    });

    if (Object.values(this.keys).some(value => value.key.isDown)) {
      this.anims.play('fire-wizard-walk', true);
    } else {
      this.anims.play('fire-wizard-idle', true);
    }
  }
}
