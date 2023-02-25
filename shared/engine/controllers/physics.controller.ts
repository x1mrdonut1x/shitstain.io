import { State } from '../../types/objects';
import { useState } from './state.controller';

export function usePhysics(state: State, trackChanges = false) {
  const { updateEntity, hasAuthority } = useState(state, trackChanges);

  const move = (delta: number, timestamp: number) => {
    state.objects.forEach(entity => {
      if (entity.position && entity.movement) {
        const newPosition = entity.position || {};
        let movement = entity.movement;

        if (!hasAuthority(entity.clientId) && state.snapshot) {
          const snapEntity = state.snapshot.changed.get(entity.id);
          movement = snapEntity?.change?.movement || movement;
        } else {
          newPosition.x = entity.position.x + entity.movement.x * delta;
          newPosition.y = entity.position.y + entity.movement.y * delta;
        }
        newPosition.x = entity.position.x + entity.movement.x * delta;
        newPosition.y = entity.position.y + entity.movement.y * delta;

        updateEntity(entity.id, {
          position: newPosition,
        });
      }
    });
  };

  return { move };
}
