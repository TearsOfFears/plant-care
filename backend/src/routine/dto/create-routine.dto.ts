import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { RetationEnum } from '../../common/types/retation.enum';
import { RetationDayEnum } from '../../common/types/relation-day.enum';

export class CreateRoutineDto {
  @ApiProperty({
    example: 'Site invite!',
    description: 'Notification title',
  })
  @IsString()
  readonly title: string;

  @IsString()
  time_of_start: string;

  @ApiProperty({})
  @IsString()
  description: string;

  @ApiProperty({})
  @IsNumber()
  duration_bulb: number;

  @ApiProperty({})
  @IsEnum(RetationEnum)
  retation: RetationEnum;

  @ApiProperty({})
  @IsEnum(RetationDayEnum)
  retation_day: RetationDayEnum;

  @ApiProperty({})
  @IsNumber()
  time_of_start_hours: number;

  @ApiProperty({})
  @IsNumber()
  time_of_start_minutes: number;

  @ApiProperty({})
  @IsNumber()
  humidity_target: number;

  @ApiProperty({})
  @IsNumber()
  duration_simple: number;

  @ApiProperty({})
  @IsNumber()
  duration_organic: number;
}
