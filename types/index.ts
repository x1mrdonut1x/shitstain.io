import MatterJS from 'matter-js';

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

export type ServerEnemy = {
  x: number;
  y: number;
  speed: number;
  move: ServerMovement;
};

export type ServerWorldPlayer = {
  data: ServerPlayer;
  body: MatterJS.Body;
};

export type ServerWorldEnemy = {
  data: ServerEnemy;
  body: MatterJS.Body;
};

export type ServerSnapshot = {
  timestamp: number;
  state: {
    players: ServerPlayer[];
  };
};

export type ServerObject = {
  position: XYPosition;
  vertices: XYPosition[];
  label: string;
};

export type XYPosition = { x: number; y: number };
