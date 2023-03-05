import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../../shared/types/events';

export interface WrappedServerSocket<T> {
  event: string;
  callback: SocketActionFn<T>;
}

type SocketActionFn<T> = (message: T) => void;

export class SocketActions {
  public readonly clientId: string;
  public roomId?: string;

  constructor(private io: Server, private socket: Socket) {
    this.clientId = socket.id;
  }

  public joinRoom(roomId: string) {
    this.socket.join(roomId);
  }

  public broadcastToRoom<T>(event: SocketEvent, message: T) {
    if (!this.roomId) {
      console.log('Could not broadcast to room');
      return;
    }

    return this.io.to(this.roomId).emit(event, message);
  }

  public createSocket<TEmit = unknown, TOn = TEmit>(event: SocketEvent): DataSocket<TEmit, TOn> {
    return {
      emit: this.emitCallback.bind(this)(event),
      on: this.onCallback.bind(this)(event),
      off: this.offCallback.bind(this)(event),
    };
  }

  private emitCallback<T>(event: SocketEvent) {
    return (data: T): void => {
      this.broadcastToRoom(event, { clientId: this.clientId, ...data });
    };
  }

  private onCallback<T>(event: SocketEvent) {
    return (callback: ListenerCallback<T>): void => {
      this.socket.on(event, callback);
    };
  }

  private offCallback<T>(event: SocketEvent) {
    return (callback: ListenerCallback<T>): void => {
      this.socket.off(event, callback);
    };
  }
}

export interface DataSocket<TEmit, TOn> {
  emit: (data?: Omit<TEmit, 'clientId'>) => void;
  on: (callback: ListenerCallback<TOn>) => void;
  off: (callback: ListenerCallback<TOn>) => void;
}

interface ListenerCallback<T> {
  (data: T): void;
}
