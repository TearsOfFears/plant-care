import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { RoutineRepository } from './repositories/sensors.repository';
import { MqttService } from '../mqtt/mqtt.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { SelectRoutineAndModeDto } from './dto/select-routine-and-mode.dto';
import { RoutineEntity } from '../common/entities/routine.entity';
import { ModeEnum } from '../common/types/mode.enum';
import { RetationDayEnum } from '../common/types/relation-day.enum';
import { RetationEnum } from '../common/types/retation.enum';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Injectable()
export class RoutineService {
  constructor(
    private readonly routineRepository: RoutineRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly mqttService: MqttService,
  ) {}

  public dayPosition(retationDay: RetationDayEnum) {
    switch (retationDay) {
      case RetationDayEnum.MONDAY:
        return 0;
      case RetationDayEnum.TUESDAY:
        return 1;
      case RetationDayEnum.WEDNESDAY:
        return 2;
      case RetationDayEnum.THURSDAY:
        return 3;
      case RetationDayEnum.FRIDAY:
        return 4;
      case RetationDayEnum.SATURDAY:
        return 5;
      case RetationDayEnum.SUNDAY:
        return 6;
    }
  }

  public dateCronBuilder(routine: RoutineEntity) {
    const day = this.dayPosition(routine.retation_day);

    if (routine.retation === RetationEnum.DAY) {
      return `${routine.time_of_start_minutes} ${routine.time_of_start_hours} * * *`;
    }
    if (routine.retation === RetationEnum.WEEKEND) {
      return `${routine.time_of_start_minutes} ${routine.time_of_start_hours} * * ${day}`;
    }
  }
  public createSchedule(routine: RoutineEntity) {
    const dataStart = new Date();
    const dateCron = this.dateCronBuilder(routine);

    const schedule = new CronJob(dateCron, () => {
      this.mqttService.sendSetup({
        duration_bulb: routine.duration_bulb,
        duration_organic: routine.duration_organic,
        duration_simple: routine.duration_simple,
        mode: ModeEnum.TIMER,
      });
    });

    this.schedulerRegistry.addCronJob('schedule', schedule);
    schedule.start();
    console.log('schedule', schedule);
  }

  public async createRoutine(createRoutineDto: CreateRoutineDto) {
    try {
      await this.routineRepository.createOrUpdate(createRoutineDto);
    } catch (e) {
      throw new BadRequestException('Db error');
    }
  }

  public async delete(id: string) {
    // this.client.send('notification-output', payload).subscribe((res) => {
    //   console.log('response:', res);
    // });
    //
    try {
      const routine = await this.routineRepository.getById(id);
      if (!routine) {
        throw new ConflictException('Not found');
      }
      await this.routineRepository.delete(id);
    } catch (e) {
      throw new BadRequestException('Db error');
    }
  }

  public async update(dto: UpdateRoutineDto) {
    // this.client.send('notification-output', payload).subscribe((res) => {
    //   console.log('response:', res);
    // });
    //
    try {
      const routine = await this.routineRepository.getById(dto.id);
      if (!routine) {
        throw new ConflictException('Not found');
      }
      await this.routineRepository.createOrUpdate(dto);
    } catch (e) {
      throw new BadRequestException('Db error');
    }
  }

  public async list() {
    // this.client.send('notification-output', payload).subscribe((res) => {
    //   console.log('response:', res);
    // });
    //
    try {
      return await this.routineRepository.list();
    } catch (e) {
      throw new BadRequestException('Db error');
    }
  }

  public async selectRoutine(selectRoutineAndModeDto: SelectRoutineAndModeDto) {
    const { id, mode } = selectRoutineAndModeDto;
    const routine = await this.routineRepository.getById(id);
    if (!routine) {
      throw new ConflictException('Not found');
    }
    await this.routineRepository.updateManyNotSelect();
    await this.routineRepository.createOrUpdate({
      ...routine,
      is_selected: true,
      selected_mode: mode,
    });
    await this.routineRepository.createOrUpdate({
      ...routine,
      is_selected: true,
      selected_mode: mode,
    });
    if (mode !== ModeEnum.TIMER) {
      const schedule = this.schedulerRegistry.doesExist('cron', 'schedule');
      if (schedule) {
        this.schedulerRegistry.deleteCronJob('schedule');
      }
    }
    if (mode === ModeEnum.TIMER) {
      return this.createSchedule(routine);
    }
    this.mqttService.sendSetup({
      duration_bulb: routine.duration_bulb,
      humidity_target: routine.humidity_target,
      mode,
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
