import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { ModeEnum } from '../../common/types/mode.enum';

export class SelectMode {
  @IsEnum(ModeEnum)
  @ApiProperty({})
  mode: ModeEnum;

  @IsString()
  @ApiProperty({})
  turn_on_bulb: boolean;

  @IsString()
  @ApiProperty({})
  turn_on_organic: boolean;

  @IsString()
  @ApiProperty({})
  turn_on_simple: boolean;
}
