import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';

import { RoutineEntity } from '../../common/entities/routine.entity';

@Injectable()
export class RoutineRepository {
  constructor(
    @InjectRepository(RoutineEntity)
    private readonly routineRepository: Repository<RoutineEntity>,
  ) {}

  public async createOrUpdate(
    payload: DeepPartial<RoutineEntity>,
  ): Promise<RoutineEntity> {
    return this.routineRepository.save(payload);
  }
  public async delete(id): Promise<DeleteResult> {
    return this.routineRepository.delete({ id });
  }

  public async list(): Promise<RoutineEntity[]> {
    return this.routineRepository.find();
  }

  public async getById(routineId): Promise<RoutineEntity> {
    return this.routineRepository.findOneBy({ id: routineId });
  }

  public async updateManyNotSelect(): Promise<UpdateResult> {
    return this.routineRepository.update(
      { is_selected: true },
      { is_selected: false },
    );
  }
}
