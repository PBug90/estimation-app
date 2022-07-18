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
import { UserRole } from '@estimation-app/types';
interface ClientInfo {
  mainRoom: string;
  name: string;
  role: UserRole;
}

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private roomService: RoomService) {}

  handleConnection() {
    this.logger.log('new connection');
  }

  @WebSocketServer()
  server!: Server;
  private logger: Logger = new Logger('AppGateway');
  private socketToClientInfo = new Map<Socket, ClientInfo>();

  @SubscribeMessage('estimate')
  handleEstimationMessage(client: Socket, estimation: number): void {
    const { mainRoom, name } = this.socketToClientInfo.get(client)!;
    this.roomService.setEstimation(mainRoom, name, estimation);
    this.server.to(mainRoom).emit('estimate', {
      name: this.socketToClientInfo.get(client)!.name,
      value: estimation,
    });
  }

  @SubscribeMessage('reveal')
  handleRevealMessage(client: Socket): void {
    const roomName = this.socketToClientInfo.get(client)!.mainRoom;
    this.server
      .to(roomName)
      .emit(
        'reveal',
        this.roomService.getState(roomName).currentEstimation.estimations
      );
  }

  @SubscribeMessage('reset')
  handleResetMessage(client: Socket): void {
    const roomName = this.socketToClientInfo.get(client)!.mainRoom;
    this.roomService.reset(roomName);
    this.server.to(roomName).emit('reset');
  }

  @SubscribeMessage('saveAndReset')
  handleSaveAndResetMessage(client: Socket): void {
    const roomName = this.socketToClientInfo.get(client)!.mainRoom;
    this.roomService.saveAndReset(roomName);
    this.server
      .to(roomName)
      .emit('roomstate', this.roomService.getState(roomName));
  }

  @SubscribeMessage('description')
  handleDescriptionMessage(client: Socket, description: string): void {
    const roomName = this.socketToClientInfo.get(client)!.mainRoom;
    this.roomService.setEstimationDescription(roomName, description);
    this.server.to(roomName).emit('description', description);
  }

  @SubscribeMessage('join')
  join(
    client: Socket,
    {
      name: clientName,
      room: roomName,
      role,
    }: { name: string; room: string; role: UserRole }
  ) {
    this.roomService.create(roomName, clientName, role, []);
    this.socketToClientInfo.set(client, {
      mainRoom: roomName,
      name: clientName,
      role,
    });
    client.join(roomName);
    this.server.to(roomName).emit('join', clientName, role);
    client.emit('roomstate', this.roomService.getState(roomName));
  }

  afterInit() {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (this.socketToClientInfo.has(client) === false) return;
    const { mainRoom, name, role } = this.socketToClientInfo.get(client)!;
    this.roomService.removeUser(mainRoom, name, role);
    this.server.to(mainRoom).emit('leave', name, role);
  }
}
