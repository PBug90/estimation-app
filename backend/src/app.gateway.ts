import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { RoomService } from './room.service';

interface ClientInfo {
  mainRoom: string;
  name: string;
}

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private roomService: RoomService) {}

  handleConnection(client: any, ...args: any[]) {
    this.logger.log('new connection');
  }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  private socketToClientInfo = new Map<Socket, ClientInfo>();

  @SubscribeMessage('estimate')
  handleEstimationMessage(client: Socket, estimation: number): void {
    const { mainRoom, name } = this.socketToClientInfo.get(client);
    this.roomService.setEstimation(mainRoom, name, estimation);
    this.server.to(mainRoom).emit('estimate', {
      name: this.socketToClientInfo.get(client).name,
      value: estimation,
    });
  }

  @SubscribeMessage('reveal')
  handleRevealMessage(client: Socket): void {
    const roomName = this.socketToClientInfo.get(client).mainRoom;
    this.server.to(roomName).emit('reveal');
  }

  @SubscribeMessage('reset')
  handleResetMessage(client: Socket): void {
    const roomName = this.socketToClientInfo.get(client).mainRoom;
    this.roomService.reset(roomName);
    this.server.to(roomName).emit('reset');
  }

  @SubscribeMessage('join')
  join(
    client: Socket,
    { name: clientName, room: roomName }: { name: string; room: string },
  ) {
    this.roomService.create(roomName, clientName);
    this.socketToClientInfo.set(client, {
      mainRoom: roomName,
      name: clientName,
    });
    client.join(roomName);
    this.server.to(roomName).emit('join', clientName);
    client.emit('roomstate', this.roomService.getEstimations(roomName));
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (this.socketToClientInfo.has(client) === false) return;
    const { mainRoom, name } = this.socketToClientInfo.get(client);
    this.roomService.removeMember(mainRoom, name);
    this.server.to(mainRoom).emit('leave', name);
  }
}
