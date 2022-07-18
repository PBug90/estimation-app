export interface Estimation {
  description: string;
  estimations: Record<string, number>;
}

export enum UserRole {
  DEVELOPER = 'DEVELOPER',
  OBSERVER = 'OBSERVER',
}

export interface RoomState {
  currentEstimation: Estimation;
  estimationHistory: Estimation[];
  observers: string[];
  userVoteInputs: number[];
  revealed: boolean;
}
