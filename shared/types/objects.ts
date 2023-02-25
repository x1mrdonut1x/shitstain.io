export type Rectangle = {
  width: number;
  height: number;
};

export type Circle = {
  radius: number;
};

export type Point = {
  x: number;
  y: number;
};

export type Vector = Point;

export type Movable = {
  speed: Vector;
  position: Point;
};

export type Collidable = Movable & {
  body: Rectangle | Circle;
  group: string;
};

export type Drawable = {
  sprite: string;
};

// export const Wizard: Collidable & Drawable = {};

// export const Bullet: Collidable & Drawable = {};

// export const Monster: Collidable & Drawable = {};

// export type Input = { up: boolean };

// export type Player = {
//   clientId: string;
//   input: Input;
//   character: typeof Wizard;
// };
