import { Body, Controller, Get, Post } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import {
  MessagePattern,
  Payload,
  Ctx,
  MqttContext,
} from '@nestjs/microservices';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { SENSORS } from '../common/events';
import {
  IsWaterSendEvent,
  MoistureSendEvent,
  TemperatureSendEvent,
} from '../common/events/sensors.event';
import { SensorsRepository } from '../repositories/sensors.repository';
import { SelectMode } from './dto/create-routine.dto';
import { ModeEnum } from '../common/types/mode.enum';

interface IMessage {
  moisture: number;
  tmp: number;
}

interface IMessageWater {
  is_water: boolean;
}

interface ISensors {
  moisture: number;
  tmp: number;
}
@Controller()
export class MqttController {
  constructor(
    private readonly mqttService: MqttService,
    private readonly eventEmitter: EventEmitter2,
    private readonly sensorsRepository: SensorsRepository,
  ) {}

  @Get('/list/sensors')
  getList() {
    return this.sensorsRepository.getSensorsList();
  }

  @Post('/mode')
  setupMode(@Body() data: SelectMode) {
    console.log('SelectMode', data);

    if (data.mode === ModeEnum.AUTO) {
      return this.mqttService.sendModeAuto(data);
    }
    if (data.mode === ModeEnum.MANUAL) {
      return this.mqttService.sendModeManual(data);
    }
  }

  @MessagePattern('notifications')
  getNotifications(@Payload() data: string, @Ctx() context: MqttContext) {
    this.mqttService.testData(data);
  }

  // @MessagePattern('notification-output')
  // getNotificationsOutput(
  //   @Payload() data: IMessage,
  //   @Ctx() context: MqttContext,
  // ) {
  //   console.log(`notification-output data: ${data.msg}`);
  //   this.eventEmitter.emit(
  //     SENSORS.TMP_SEND,
  //     new TemperatureSendEvent(Number(data.msg)),
  //   );
  //   // this.notification.sendNotificationTemperature(Number(data.msg));
  //   // this.mqttService.testData('fef');
  // }

  @MessagePattern('sensors')
  getTmp(@Payload() data: IMessage, @Ctx() context: MqttContext) {
    this.sensorsRepository.create({
      time: new Date(),
      temperature: data.tmp,
      moisture: data.moisture,
    });
    this.eventEmitter.emit(
      SENSORS.TMP_SEND,
      new TemperatureSendEvent(Number(data.tmp)),
    );
    this.eventEmitter.emit(
      SENSORS.MOISTURE_OF_GROUND,
      new MoistureSendEvent(Number(data.moisture)),
    );
  }

  @MessagePattern('waters')
  getWaterTank(@Payload() data: IMessageWater, @Ctx() context: MqttContext) {
    console.log(`dataParsed.is_water: ${data.is_water}`);
    this.eventEmitter.emit(
      SENSORS.IS_WATER,
      new IsWaterSendEvent(data.is_water),
    );
  }
}
