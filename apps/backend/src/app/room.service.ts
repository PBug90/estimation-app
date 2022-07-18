import { Injectable } from '@nestjs/common';
import { Estimation, RoomState, UserRole } from '@estimation-app/types';

type InternalRoomState = {
  currentEstimation: Estimation;
  estimationHistory: Estimation[];
  observers: Set<string>;
  userVoteInputs: Set<number>;
  revealed: boolean;
};

@Injectable()
export class RoomService {
  private readonly roomStates: Map<string, InternalRoomState> = new Map();

  create(
    roomName: string,
    user: string,
    role: UserRole,
    allowedUserInputs: number[]
  ) {
    if (this.roomStates.has(roomName) === false) {
      this.initializeRoom(roomName, allowedUserInputs);
    }
    this.addUser(roomName, user, role);
  }

  addUser(roomName: string, user: string, role: UserRole) {
    const state = this.roomStates.get(roomName)!;
    if (role === UserRole.DEVELOPER) {
      state.currentEstimation.estimations[user] = -1;
    } else {
      state.observers.add(user);
    }
  }

  private initializeRoom(roomName: string, allowedUserInputs: number[]) {
    this.roomStates.set(roomName, {
      currentEstimation: {
        estimations: {},
        description: 'New Estimation',
      },
      estimationHistory: [],
      observers: new Set(),
      userVoteInputs: new Set(allowedUserInputs),
      revealed: false,
    });
  }

  removeUser(roomName: string, name: string, role: UserRole) {
    if (role === UserRole.DEVELOPER) {
      delete this.roomStates.get(roomName)!.currentEstimation.estimations[name];
    } else {
      this.roomStates.get(roomName)!.observers.delete(name);
    }
  }

  setEstimation(roomName: string, member: string, estimation: number) {
    this.roomStates.get(roomName)!.currentEstimation.estimations[member] =
      estimation;
  }

  setEstimationDescription(roomName: string, description: string) {
    this.roomStates.get(roomName)!.currentEstimation.description = description;
  }

  getCurrentEstimation(roomName: string) {
    return this.roomStates.get(roomName)!.currentEstimation;
  }

  getState(roomName: string): RoomState {
    const state = this.roomStates.get(roomName)!;
    return {
      ...state,
      observers: [...state.observers],
      userVoteInputs: [...state.userVoteInputs],
    };
  }

  reset(roomName: string) {
    const state = this.roomStates.get(roomName)!;
    state.currentEstimation = {
      description: state.currentEstimation.description,
      estimations: this.buildNewEstimationFromCurrentState(state),
    };
  }

  saveAndReset(roomName: string) {
    const state = this.roomStates.get(roomName)!;
    state.estimationHistory.push(state.currentEstimation);
    state.currentEstimation = {
      description: 'New Estimation ' + state.estimationHistory.length,
      estimations: this.buildNewEstimationFromCurrentState(state),
    };
  }

  private buildNewEstimationFromCurrentState(state: InternalRoomState) {
    const estimations = state.currentEstimation.estimations;
    const newEstimations: InternalRoomState['currentEstimation']['estimations'] =
      {};
    for (const key in estimations) {
      newEstimations[key] = -1;
    }
    return newEstimations;
  }
}
