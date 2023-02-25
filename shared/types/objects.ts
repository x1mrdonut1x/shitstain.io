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

export type Collision = {
  body: Rectangle | Circle;
  group: string;
};

export type View = {
  sprite: string;
};

export type EntityKey = string;

export type State = {
  objects: Map<EntityKey, Entity>;
  changed: Map<EntityKey, SnapshotObject>;
  snapshot?: Snapshot;
  authority: string;
};

export type Entity = {
  id: EntityKey;
  clientId?: string;
  model: Model;
  position?: Point;
  movement?: Vector;
  collision?: Collision;
  view?: View;
};

export type Model = {
  type: string;
  physics?: {
    speed?: number;
  };
  abilities?: {
    shooting?: {
      projectile: Model;
    };
  };
};

export type Snapshot = {
  timestamp: number;
  changed: Map<EntityKey, SnapshotObject>;
};

export type SnapshotObject = {
  id: EntityKey;
  state: 'created' | 'updated' | 'deleted';
  change: Partial<Entity>;
};

export type MovementInput = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export type ShootInput = {
  x: number;
  y: number;
};
