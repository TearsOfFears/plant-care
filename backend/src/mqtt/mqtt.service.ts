import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { connect } from 'mqtt';
import { ClientProxy } from '@nestjs/microservices';
import {
  RoutineEntity,
  RoutineWithMode,
} from '../common/entities/routine.entity';
import { SelectMode } from './dto/create-routine.dto';
import { DeepPartial } from 'typeorm';

@Injectable()
export class MqttService {
  constructor(@Inject('TEST_SERVICE') private client: ClientProxy) {}

  testData(payload: string) {
    this.client.send('notification-output', payload).subscribe((res) => {
      console.log('response:', res);
    });
  }

  sendSetup(routine: DeepPartial<RoutineWithMode>) {
    this.client.send('setup', routine).subscribe((res) => {
      console.log('response:', res);
    });
  }

  sendModeTimer(routine: SelectMode) {
    this.client.send('setup', routine).subscribe((res) => {
      console.log('response:', res);
    });
  }

  sendModeManual(routine: SelectMode) {
    this.client.send('setup', routine).subscribe((res) => {
      console.log('response:', res);
    });
  }

  sendModeAuto(routine: SelectMode) {
    //
    // humidityValueTarget = doc['data']['humidity_target'];
    // durationBulp = doc['data']['duration_bulb'];

    this.client.send('setup', routine).subscribe((res) => {
      console.log('response:', res);
    });
  }

  // private mqttClient;
  //
  // async onModuleInit() {
  //   // const host = this.configService.get<string>('host')
  //   // const port = this.configService.get<string>('port')
  //   const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
  //   const connectUrl = `mqtt://broker.hivemq.com`;
  //   const topic = '/nodejs/mqtt/sp';
  //   this.mqttClient = await connect(connectUrl, {
  //     clientId,
  //     clean: true,
  //     connectTimeout: 40,
  //     rejectUnauthorized: false,
  //     protocol: 'mqtts',
  //     host: 'broker.hivemq.com',
  //     port: 8883,
  //     username: 'nd_test',
  //     password: 'FF@2HSCW7k47acd',
  //     reconnectPeriod: 10,
  //   });
  //   // this.mqttClient.mqtt.;
  //
  //   console.log('this.mqttClient', this.mqttClient.clientId);
  //   this.mqttClient.on('connect', function () {
  //     console.log("'test");
  //   });
  //
  //   this.mqttClient.on('error', function () {
  //     console.error('Error in connecting to CloudMQTT');
  //   });
  //   this.mqttClient.publish('messages', 'Hello, this message was received!');
  //   this.mqttClient.subscribe('messages');
  // }
  // publish(topic: string, payload: string): string {
  //   this.mqttClient.publish(topic, payload);
  //   return `Publishing to ${topic}`;
  // }
}
