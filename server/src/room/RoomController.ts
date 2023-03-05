import { Room } from './Room';

const MAX_PLAYERS = 100;

export class RoomController {
  public readonly rooms: Map<string, Room> = new Map();

  public addPlayerToRoom(clientId: string, roomId?: string) {
    let newRoomId: string | undefined = undefined;

    // Add to defined room
    if (roomId) {
      const room = this.rooms.get(roomId);
      room?.players.add(clientId);
      newRoomId = roomId;

      console.log('Room joined:', newRoomId);
      // Add to first free room
    } else if (this.rooms.size) {
      for (const [roomId, room] of this.rooms) {
        if (this.rooms.size < MAX_PLAYERS) {
          room.players.add(clientId);
          newRoomId = roomId;

          console.log('Room joined:', newRoomId);
          break;
        }
      }
    }

    // Create new room
    if (!newRoomId) {
      const newRoom = new Room();
      newRoomId = newRoom.id;
      newRoom.addPlayer(clientId);
      this.rooms.set(newRoom.id, newRoom);
    }

    return newRoomId;
  }

  public removePlayerFromRoom(roomId: string, clientId: string) {
    const room = this.rooms.get(roomId);
    room?.players.delete(clientId);
  }

  public getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }
}
