import { Vector2 } from '../../engine/entities/Vector2';

export type ServerMovement = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type ClientShootData = {
  clientId: string | number;
  isShooting: boolean;
  playerPos: Vector2;
  mousePos: Vector2;
};

export type ServerShootData = {
  clientId: string | number;
  isShooting: boolean;
  playerPos: Vector2;
  mousePos: Vector2;
};

export type ServerPlayer = {
  clientId: string | number;
  position: Vector2;
  speed: number;
  bulletSpeed: number;
  move: ServerMovement;
};

export type ServerEnemy = {
  id: number | string;
  position: Vector2;
  velocity: Vector2;
  speed: number;
};

export type ServerSnapshot = {
  timestamp: number;
  state: {
    players: ServerPlayer[];
    enemies: ServerEnemy[];
  };
};

export type EntityId = string | number;
