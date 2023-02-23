export type ServerMovement = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type ClientShootData = {
  clientId: string;
  isShooting: boolean;
  playerPos: XYPosition;
  mousePos: XYPosition;
};

export type ServerShootData = {
  clientId: string;
  isShooting: boolean;
  playerPos: XYPosition;
  mousePos: XYPosition;
};

export type ServerPlayer = {
  clientId: string;
  x: number;
  y: number;
  speed: number;
  bulletSpeed: number;
  move: ServerMovement;
};

export type ServerWorldPlayer = {
  data: ServerPlayer;
};

export type ServerSnapshot = {
  timestamp: number;
  state: {
    players: ServerPlayer[];
  };
};

export type XYPosition = { x: number; y: number };
