import { MAP_HEIGHT_PX } from '../../shared/constants';
import { useEngine } from '../../shared/engine/controllers/engine.controller';
import { useState } from '../../shared/engine/controllers/state.controller';
import { WallModel } from '../../shared/engine/models/wall.model';

export function useWorld() {
  const { state } = useEngine();
  const { addEntity } = useState(state);

  const createWorld = () => {
    addEntity({
      model: WallModel,
      position: {
        x: 0,
        y: 0,
      },
      collision: {
        group: 'map',
        body: {
          width: 200,
          height: MAP_HEIGHT_PX,
        },
      },
    });
  };

  return { createWorld };
}
