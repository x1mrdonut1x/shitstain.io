import { State } from '../../types/objects';
import { useState } from './state.controller';

export function usePhysics(state: State) {
  const { updateEntity, hasAuthority } = useState(state, true);

  const move = (delta: number, timestamp: number) => {
    state.objects.forEach(entity => {
      if (entity.position && entity.movement) {
        const newPosition = entity.position || {};
        if (hasAuthority(entity.clientId)) {
          newPosition.x = entity.position.x + entity.movement.x * delta;
          newPosition.y = entity.position.y + entity.movement.y * delta;
        } else {
          newPosition.x = entity;
        }

        updateEntity(entity.id, {
          position: newPosition,
        });
      }
    });
  };

  return { move };
}
