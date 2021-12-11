import { Injectable } from '@nestjs/common';

export interface RoomState {
  admin: string;
  estimations: Record<string, number>;
}

@Injectable()
export class RoomService {
  private readonly roomStates: Map<string, RoomState> = new Map();

  create(roomName: string, adminName: string) {
    if (this.roomStates.has(roomName)) {
      this.setEstimation(roomName, adminName, -1);
    } else {
      this.roomStates.set(roomName, {
        admin: adminName,
        estimations: { [adminName]: -1 },
      });
    }
  }

  addMember(roomName: string, member: string) {
    this.roomStates.get(roomName).estimations[member] = -1;
  }

  removeMember(roomName: string, member: string) {
    delete this.roomStates.get(roomName).estimations[member];
  }

  setEstimation(roomName: string, member: string, estimation: number) {
    this.roomStates.get(roomName).estimations[member] = estimation;
  }

  getEstimations(roomName: string) {
    return this.roomStates.get(roomName).estimations;
  }

  reset(roomName: string) {
    const estimations = this.roomStates.get(roomName).estimations;
    for (const key in estimations) {
      estimations[key] = -1;
    }
  }
}
