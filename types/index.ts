export type ServerPlayer = ServerWorldObject & {};

export type ServerMovement = {
  left?: boolean;
  right?: boolean;
  up?: boolean;
  down?: boolean;
  dx?: number;
  dy?: number;
};

export type ServerShootDirection = {
  playerId: string;
  x: number;
  y: number;
  rotation: number;
};

export type ServerWorldObject = {
  id: string;
  x: number;
  y: number;
  move?: ServerMovement;
};
