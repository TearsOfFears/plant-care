import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { NotificationModule } from '../socket/notification.module';
import { SensorsRepository } from '../repositories/sensors.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsEntity } from '../common/entities/sensors.entity';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TEST_SERVICE',
        transport: Transport.MQTT,
        options: {
          subscribeOptions: { qos: 0 },
          url: 'mqtt://127.0.0.1:1883',
          // username: 'nd_test',
          // password: 'FF@2HSCW7k47acd',
        },
      },
    ]),
    TypeOrmModule.forFeature([SensorsEntity]),
    NotificationModule,
  ],
  controllers: [MqttController],
  providers: [MqttService, SensorsRepository],
  exports: [MqttService, SensorsRepository],
})
export class MqttModule {}
