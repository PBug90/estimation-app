import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RoomService } from './room.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend', 'build'),
    }),
  ],
  controllers: [],
  providers: [AppGateway, RoomService],
})
export class AppModule {}
