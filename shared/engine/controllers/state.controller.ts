import { Entity, EntityKey, State } from '../../types/objects';

export function createState(): State {
  return {
    objects: new Map(),
    changed: new Map(),
    authority: 'server',
  };
}

export function useState(state: State, trackChanges = false) {
  const getRandomId = () => {
    return (Math.random() + 1).toString(36).substring(2);
  };

  const addEntity = (entity: Omit<Entity, 'id'>, id = getRandomId()) => {
    state.objects.set(id, {
      id,
      ...entity,
    });

    if (trackChanges) {
      state.changed.set(id, {
        id: id,
        state: 'created',
        change: entity,
      });
    }
  };

  const updateEntity = (id: EntityKey, update: Partial<Entity>) => {
    const entity = state.objects.get(id);
    if (entity) {
      Object.assign(entity, update);
      if (trackChanges) {
        const snap = state.changed.get(id);
        if (snap) {
          Object.assign(snap.change, update);
        } else {
          state.changed.set(id, {
            id,
            state: 'updated',
            change: update,
          });
        }
      }
    }
  };

  const removeEntity = (id: EntityKey) => {
    state.objects.delete(id);
    if (trackChanges) {
      state.changed.set(id, {
        id,
        state: 'deleted',
        change: {},
      });
    }
  };

  const getEntity = (id: EntityKey) => {
    return state.objects.get(id);
  };

  const getSnapshot = (timestamp: number) => {
    const snapshot = {
      timestamp,
      changed: state.changed,
    };

    state.changed = new Map();

    return snapshot;
  };

  const setAuthority = (clientId: string) => {
    state.authority = clientId;
  };

  const hasAuthority = (clientId?: string) => {
    return state.authority === 'server' || state.authority === clientId;
  };

  return {
    addEntity,
    updateEntity,
    removeEntity,
    getEntity,
    getSnapshot,
    hasAuthority,
    setAuthority,
  };
}
