import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { UserRole } from '@estimation-app/types';

describe('RoomService', () => {
  let roomService: RoomService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService],
    }).compile();

    roomService = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(roomService).toBeDefined();
  });

  it('can create a new room', () => {
    roomService.create('testroom', 'some admin user', UserRole.DEVELOPER, []);
    expect(roomService.getCurrentEstimation('testroom')).toEqual({
      description: 'New Estimation',
      estimations: {
        'some admin user': -1,
      },
    });
  });

  it('joins an already created room', () => {
    roomService.create('testroom', 'some admin user', UserRole.DEVELOPER, []);
    roomService.addUser('testroom', 'some other user', UserRole.DEVELOPER);
    expect(roomService.getCurrentEstimation('testroom')).toEqual({
      description: 'New Estimation',
      estimations: {
        'some admin user': -1,
        'some other user': -1,
      },
    });
  });

  it('updates roomstate votes', () => {
    roomService.create('testroom2', 'some admin user', UserRole.DEVELOPER, []);
    expect(roomService.getCurrentEstimation('testroom2')).toEqual({
      description: 'New Estimation',
      estimations: {
        'some admin user': -1,
      },
    });
    roomService.setEstimation('testroom2', 'some admin user', 5);
    expect(roomService.getCurrentEstimation('testroom2')).toEqual({
      description: 'New Estimation',
      estimations: {
        'some admin user': 5,
      },
    });
  });

  it('saveAndReset persists votestate in history and creates a new blank estimation', () => {
    roomService.create('testroom2', 'some admin user', UserRole.DEVELOPER, []);
    roomService.setEstimation('testroom2', 'some admin user', 5);
    expect(roomService.getCurrentEstimation('testroom2')).toEqual({
      description: 'New Estimation',
      estimations: {
        'some admin user': 5,
      },
    });
    roomService.saveAndReset('testroom2');
    expect(roomService.getCurrentEstimation('testroom2')).toEqual({
      description: 'New Estimation 1',
      estimations: {
        'some admin user': -1,
      },
    });
    expect(roomService.getState('testroom2').estimationHistory).toEqual([
      {
        description: 'New Estimation',
        estimations: {
          'some admin user': 5,
        },
      },
    ]);
  });
});
