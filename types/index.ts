export type ServerMovement = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type ServerShootData = {
  playerId: string;
  isShooting: boolean;
  playerPos: XYPosition;
  velocity: XYPosition;
};

export type ServerPlayer = {
  clientId: string;
  x: number;
  y: number;
  speed: number;
  move: ServerMovement;
};

export type XYPosition = { x: number; y: number };
