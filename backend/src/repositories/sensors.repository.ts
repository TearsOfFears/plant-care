import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DeepPartial,
  DeleteResult,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  UpdateResult,
} from 'typeorm';

import { SensorsEntity } from '../common/entities/sensors.entity';

@Injectable()
export class SensorsRepository {
  constructor(
    @InjectRepository(SensorsEntity)
    private readonly sensorsEntityRepository: Repository<SensorsEntity>,
  ) {}

  public async create(
    payload: DeepPartial<SensorsEntity>,
  ): Promise<SensorsEntity> {
    return this.sensorsEntityRepository.save(payload);
  }

  public async getSensorsList(): Promise<SensorsEntity[]> {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 1);
    console.log('oneWeekAgo', oneWeekAgo);
    return this.sensorsEntityRepository.find({
      where: {
        time: Between(oneWeekAgo, now),
        // time: {
        //   // time >= startDate
        //   [MoreThanOrEqual]: startDate,
        //   // time <= endDate
        //   [LessThanOrEqual]: now,
        // },
      },
    });
    // return [];
  }
  // public async createMany(
  //   payload: DeepPartial<CountyEntity>[],
  // ): Promise<CountyEntity[]> {
  //   return this.countyEntityRepository.save(payload);
  // }
  // public async getById(
  //   id: string,
  //   relations: Array<string> = [],
  //   select: FindOptionsSelect<CountyEntity> = {},
  // ): Promise<CountyEntity> {
  //   return this.countyEntityRepository.findOne({
  //     where: {
  //       id,
  //     },
  //     relations,
  //     select,
  //   });
  // }
  // public async getByCounty(
  //   county: string,
  //   relations: Array<string> = [],
  //   select: FindOptionsSelect<CountyEntity> = {},
  // ): Promise<CountyEntity> {
  //   return this.countyEntityRepository.findOne({
  //     where: {
  //       county,
  //     },
  //     relations,
  //     select,
  //   });
  // }
  // public async getByState(
  //   state: string,
  //   relations: Array<string> = [],
  //   select: FindOptionsSelect<CountyEntity> = {},
  // ): Promise<CountyEntity> {
  //   return this.countyEntityRepository.findOne({
  //     where: {
  //       state: {
  //         state,
  //       },
  //     },
  //     relations,
  //     select,
  //   });
  // }
}
