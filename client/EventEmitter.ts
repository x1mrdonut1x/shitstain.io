import { io } from 'socket.io-client';

class EventEmitter {
  private readonly io = io();

  get allPlayers() {
    return {
      on: (callback: (event: { id: number; x: number; y: number }[]) => void) =>
        this.io.on('playersPositions', data => callback(data)),
    };
  }

  get newPlayer() {
    return {
      emit: (data: { id: number; x: number; y: number }) => this.io.emit('newPlayer', data),
      on: (callback: (event: { id: number; x: number; y: number }) => void) =>
        this.io.on('newPlayer', data => callback(data)),
    };
  }

  get move() {
    return {
      emit: (data: { id: number; x: number; y: number }) => this.io.emit('playerMove', data),
      on: (callback: (event: { id: number; x: number; y: number }) => void) =>
        this.io.on('playerMove', data => callback(data)),
    };
  }

  get shoot() {
    return {
      emit: (position: { x: number; y: number }) => this.io.emit('shoot', position),
      on: (callback: (event: { x: number; y: number }) => void) =>
        this.io.on('shoot', data => callback(data)),
    };
  }
}

export const eventEmitter = new EventEmitter();
