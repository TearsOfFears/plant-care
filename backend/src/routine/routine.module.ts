import { Module } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { RoutineController } from './routine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineEntity } from '../common/entities/routine.entity';
import { RoutineRepository } from './repositories/sensors.repository';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoutineEntity]), MqttModule],
  controllers: [RoutineController],
  providers: [RoutineService, RoutineRepository],
  exports: [RoutineService, RoutineRepository],
})
export class RoutineModule {}
