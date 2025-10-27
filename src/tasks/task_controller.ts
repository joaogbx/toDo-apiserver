import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task_service';
import { Task } from 'src/entities/task_entitie';
import { CreateTaskDto } from 'src/common/dto/create-task-dto';
import { PaginationDto } from 'src/common/dto/pagination-task-dto';
import { UpdateTaskDto } from 'src/common/dto/update-task-dto';
import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';
import { AuthTokenGuard } from 'src/common/guards/auth-token.guard';

@Controller('/task')
@UseInterceptors(LoggerInterceptor)
@UseGuards(AuthTokenGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAllTasks(@Query() paginationDto: PaginationDto) {
    console.log('controller');
    return this.taskService.findAll(paginationDto);
  }

  @Get(':id')
  findOneTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    console.log(id);
    return this.taskService.findOneTask(id);
  }

  @Post('/create')
  createTask(@Body() createTaskDto: CreateTaskDto) {
    console.log(createTaskDto);

    return this.taskService.createTask(createTaskDto);
  }

  @Patch(':id')
  updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.taskService.updateTask(updateTaskDto, id);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.deleteTask(id);
  }
}
