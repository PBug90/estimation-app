import { Test, TestingModule } from '@nestjs/testing';
import { AppGateway } from './app.gateway';
import { RoomService } from './room.service';
describe('AppGateway', () => {
  let gateway: AppGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppGateway, RoomService],
    }).compile();

    gateway = module.get<AppGateway>(AppGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
