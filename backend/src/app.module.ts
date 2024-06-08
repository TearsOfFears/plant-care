import { Module } from '@nestjs/common';
import { NotificationModule } from './socket/notification.module';
import { MqttModule } from './mqtt/mqtt.module';

import { typeOrmConfig } from './common/configs/typeOrm.config';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineModule } from './routine/routine.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      // validationSchema: envValidationSchema,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync(typeOrmConfig(true)),
    NotificationModule,
    MqttModule,
    RoutineModule,
  ],
})
export class AppModule {}
