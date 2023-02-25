import { SNAPSHOT_STEP, TIMESTEP } from '../../constants';
import { Snapshot } from '../../types/objects';
import { usePhysics } from './physics.controller';
import { createState, useState } from './state.controller';

const state = createState();

export function useEngine() {
  const { move } = usePhysics(state);

  const startEngine = () => {
    let lastTimestamp = Date.now();
    setInterval(() => {
      const now = Date.now();
      const delta = now - lastTimestamp;
      lastTimestamp = now;

      move(delta, now);
    }, TIMESTEP);
  };

  const onSnapshot = (handler?: (snap: Snapshot) => void) => {
    setInterval(() => {
      const { getSnapshot } = useState(state);
      handler?.(getSnapshot(Date.now()));
    }, SNAPSHOT_STEP);
  };

  return { startEngine, onSnapshot, state };
}
