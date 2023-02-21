export type ServerPlayer = ServerWorldObject & object;

export type ServerMovement = {
  left?: boolean;
  right?: boolean;
  up?: boolean;
  down?: boolean;
  dx?: number;
  dy?: number;
};

export type ServerShootData = {
  playerId: string;
  x: number;
  y: number;
  velocity: XYPosition;
};

export type ServerWorldObject = {
  clientId: string;
  x: number;
  y: number;
  move: ServerMovement;
};

export type XYPosition = { x: number; y: number };
