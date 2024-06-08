import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { RetationEnum } from '../../common/types/retation.enum';
import { RetationDayEnum } from '../../common/types/relation-day.enum';
import { ModeEnum } from '../../common/types/mode.enum';

export class SelectRoutineAndModeDto {
  @ApiProperty({
    example: 'Selected routine',
  })
  @IsString()
  id: string;

  @IsEnum(ModeEnum)
  @ApiProperty({})
  mode: ModeEnum;
}
