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

interface RoomState {
  admin: Socket;
  estimations: Record<string, number>;
}

interface ClientInfo {
  mainRoom: string;
  name: string;
}

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(client: any, ...args: any[]) {
    this.logger.log('new connection');
  }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  private rooms: Map<string, RoomState> = new Map();
  private socketToClientInfo = new Map<Socket, ClientInfo>();

  @SubscribeMessage('estimate')
  handleEstimationMessage(client: Socket, estimation: number): void {
    const room: string = this.socketToClientInfo.get(client).mainRoom;
    const roomState = this.rooms.get(room);
    roomState.estimations[this.socketToClientInfo.get(client).name] =
      estimation;
    this.server.to(room).emit('estimate', {
      name: this.socketToClientInfo.get(client).name,
      value: estimation,
    });
  }

  @SubscribeMessage('reveal')
  handleRevealMessage(client: Socket): void {
    const roomName = this.socketToClientInfo.get(client).mainRoom;
    const room = this.rooms.get(roomName);
    this.logger.debug('Reveal command received ' + roomName);
    if (room) {
      this.server.to(roomName).emit('reveal');
    }
  }

  @SubscribeMessage('reset')
  handleResetMessage(client: Socket): void {
    const roomName = this.socketToClientInfo.get(client).mainRoom;
    const room = this.rooms.get(roomName);
    this.logger.debug('Reveal command received ' + roomName);
    if (room) {
      this.server.to(roomName).emit('reset');
    }
  }

  @SubscribeMessage('join')
  createRoom(
    client: Socket,
    { name: clientName, room: roomName }: { name: string; room: string },
  ) {
    const room = this.rooms.get(roomName);
    if (room) {
      this.logger.debug(roomName + ' ' + clientName);
      if (room.estimations[clientName] === undefined) {
        room.estimations[clientName] = -1;
      }
      client.join(roomName);
      client.emit('roles', ['participant']);
      client.emit('roomstate', room.estimations);
    } else {
      this.logger.debug(roomName + ' ' + clientName);
      const newRoom = {
        admin: client,
        estimations: {},
      };
      this.rooms.set(roomName, newRoom);
      newRoom.estimations[clientName] = -1;
      client.join(roomName);
      client.emit('roles', ['admin']);
      client.emit('roomstate', newRoom.estimations);
    }
    this.socketToClientInfo.set(client, {
      name: clientName,
      mainRoom: roomName,
    });
    if (room) {
      room.estimations[clientName] = -1;
      this.server.to(roomName).emit('join', clientName);
    }
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (this.socketToClientInfo.has(client) === false) return;
    const { mainRoom, name } = this.socketToClientInfo.get(client);
    const room = this.rooms.get(mainRoom);
    if (room) {
      delete room.estimations[name];
      this.server.to(mainRoom).emit('leave', name);
    }
  }
}
