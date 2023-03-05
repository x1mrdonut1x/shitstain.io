import { ServerMovement, ClientShootData, ServerSnapshot, ServerPlayer, ServerEnemy } from '.';

export enum SocketEvent {
  DISCONNECT = 'disconnect',
  PLAYER_CONNECT = 'players:connect',
  PLAYERS = 'players',
  PLAYER_MOVE = 'players:move',
  OBJECTS_CHANGE = 'objects:change',
  PLAYER_SHOOT = 'players:shoot',
  ADD_ENEMIES = 'enemies:add',
}

export type PlayerMoveEvent = {
  clientId: string;
  movement: ServerMovement;
};

export type AddEnemiesEvent = {
  data: ServerEnemy[];
};

export type PlayerConnectEvent = {
  clientId: string;
};

export type EmitPlayerShootEvent = Omit<ClientShootData, 'playerPos'>;

export type GetWorldStateEvent = ServerSnapshot;

export type GetPlayersEvent = ServerPlayer[];
