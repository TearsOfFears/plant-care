import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoutineService } from './routine.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { SelectRoutineAndModeDto } from './dto/select-routine-and-mode.dto';
import { IdDTO } from './dto/id.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Post('/create')
  createRoutine(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routineService.createRoutine(createRoutineDto);
  }

  @Delete('/:id')
  delete(@Param() params: IdDTO) {
    return this.routineService.delete(params.id);
  }
  @Put('/update')
  updateRoutine(@Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routineService.update(updateRoutineDto);
  }

  @Put('/select-routine')
  selectRoutine(@Body() selectRoutineAndModeDto: SelectRoutineAndModeDto) {
    return this.routineService.selectRoutine(selectRoutineAndModeDto);
  }

  @Get('/list')
  getList() {
    return this.routineService.list();
  }
}
