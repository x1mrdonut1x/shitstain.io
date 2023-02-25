import { useEngine } from '../../shared/engine/controllers/engine.controller';
import { useInput } from '../../shared/engine/controllers/input.controller';
import { useState } from '../../shared/engine/controllers/state.controller';
import { BulletModel } from '../../shared/engine/models/bullet.model';
import { WizardModel } from '../../shared/engine/models/wizard.model';
import { SocketEvent } from '../../shared/types/events';
import { MovementInput, ShootInput } from '../../shared/types/objects';
import { useSocket } from './socket.controller';

export function usePlayer() {
  const { state } = useEngine();
  const { addEntity, removeEntity, updateEntity, getEntity } = useState(state);
  const { listen } = useSocket();
  const { getMovementFromInput, getMovementTowardsPoint } = useInput();

  const subscribePlayers = () => {
    listen(SocketEvent.PLAYER_CONNECT, clientId => {
      addEntity(
        {
          clientId,
          model: WizardModel,
          position: {
            x: Math.random() * 1100 + 100,
            y: Math.random() * 600 + 100,
          },
        },
        clientId
      );
    });

    listen(SocketEvent.PLAYER_DISCONNECT, clientId => {
      removeEntity(clientId);
    });

    listen<MovementInput>(SocketEvent.PLAYER_MOVE, (clientId, data) => {
      const player = getEntity(clientId);

      if (player) {
        const movement = getMovementFromInput(data, player.model.physics?.speed);
        updateEntity(clientId, {
          movement,
        });
      }
    });

    listen<ShootInput>(SocketEvent.PLAYER_SHOOT, (clientId, data) => {
      const player = getEntity(clientId);

      if (player) {
        const projectileModel = player.model.abilities?.shooting?.projectile;

        if (projectileModel) {
          addEntity({
            clientId,
            model: BulletModel,
            position: player.position,
            movement: getMovementTowardsPoint(data, projectileModel.physics?.speed),
          });
        }
      }
    });
  };

  return { subscribePlayers };
}
