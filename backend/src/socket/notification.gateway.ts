import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SENSORS } from '../common/events';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  IsWaterSendEvent,
  MoistureSendEvent,
  TemperatureSendEvent,
} from '../common/events/sensors.event';

let socketId;

@Injectable()
@WebSocketGateway({ namespace: '/', cors: true })
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}

  @WebSocketServer() server: Server;

  async afterInit(server: Server) {
    this.server = server;
    // this.socketId = server.
  }

  async handleConnection(socket: Socket) {
    try {
      // const authToken = socket.handshake.query.authToken as string;
      console.log('ffff sockt conectted', socket.id);
      socketId = socket.id;
      this.server
        .to(socketId)
        .emit('notification-connected', `Connected ${socketId}`);
    } catch (e) {
      console.log('socket error', e);
      return socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    console.log('socjer', socket.id);
    socketId = null;
  }

  sendNotificationTemperature(value: string) {
    if (socketId) {
      this.server.to(socketId).emit('notification-tmp', value);
    }
  }

  sendNotificationMoisture(value: string) {
    if (socketId) {
      this.server.to(socketId).emit('notification-moisture', value);
    }
  }

  sendNotificationWater(isWater: string) {
    if (socketId) {
      this.server.to(socketId).emit('notification-water-level', isWater);
    }
  }

  async markNotificationAsRead(notificationId: string) {
    // const notification = await this.notificationRepository.findOneOrFail({
    //   where: { id: notificationId },
    //   relations: ['recipient'],
    // });
    // const recipient = notification.recipient;
    // const socketId = recipient.socket_id;
    // if (socketId && this.server.sockets.sockets.has(socketId)) {
    // this.server.to(socketId).emit('notification', notification);
    // }
  }

  @OnEvent(SENSORS.TMP_SEND)
  public async sendNotificationTemperatureEvent(payload: TemperatureSendEvent) {
    const payloadSend = {
      date: new Date(),
      value: payload.tmp,
    };
    this.sendNotificationTemperature(JSON.stringify(payloadSend));
  }

  @OnEvent(SENSORS.MOISTURE_OF_GROUND)
  public async sendNotificationOfMoistureEvent(payload: MoistureSendEvent) {
    const payloadSend = {
      date: new Date(),
      value: payload.moisture,
    };
    this.sendNotificationMoisture(JSON.stringify(payloadSend));
  }

  @OnEvent(SENSORS.IS_WATER)
  public async sendNotificationIswaterLow(payload: IsWaterSendEvent) {
    const payloadSend = {
      isWater: payload.isWater,
    };
    this.sendNotificationWater(JSON.stringify(payloadSend));
  }
}
