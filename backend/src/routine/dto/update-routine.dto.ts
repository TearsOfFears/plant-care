import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { RetationEnum } from '../../common/types/retation.enum';
import { RetationDayEnum } from '../../common/types/relation-day.enum';
import { CreateRoutineDto } from './create-routine.dto';

export class UpdateRoutineDto extends CreateRoutineDto {
  @ApiProperty({
    example: 'Site invite!',
    description: 'Notification title',
  })
  @IsString()
  readonly id: string;
}
