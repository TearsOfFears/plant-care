import { Entity, PrimaryColumn, Column, DeepPartial } from 'typeorm';
import { EnhancedBaseEntity } from './enhanced-base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RetationEnum } from '../types/retation.enum';
import { RetationDayEnum } from '../types/relation-day.enum';
import { ModeEnum } from '../types/mode.enum';

@Entity()
export class RoutineEntity extends EnhancedBaseEntity {
  @Column({
    type: 'text',
  })
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_selected: boolean;

  @Column({
    type: 'enum',
    enum: RetationEnum,
  })
  retation: RetationEnum;

  @Column({
    type: 'enum',
    enum: RetationDayEnum,
  })
  retation_day: RetationDayEnum;

  @Column({
    type: 'enum',
    enum: ModeEnum,
    default: ModeEnum.AUTO,
  })
  selected_mode: ModeEnum;

  @Column({
    type: 'int',
  })
  time_of_start_hours: number;

  @Column({
    type: 'int',
  })
  time_of_start_minutes: number;

  @Column({
    type: 'int',
  })
  duration_bulb: number;

  @Column({
    type: 'int',
  })
  humidity_target: number;

  @Column({
    type: 'int',
  })
  duration_simple: number;

  @Column({
    type: 'int',
  })
  duration_organic: number;
}

export interface RoutineWithMode extends RoutineEntity {
  mode: ModeEnum;
}
