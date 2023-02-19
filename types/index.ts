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
  rotation: number;
};

export type ServerWorldObject = {
  clientId: string;
  x: number;
  y: number;
  move: ServerMovement;
};
