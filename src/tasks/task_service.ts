import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from 'src/common/dto/create-task-dto';
import { PaginationDto } from 'src/common/dto/pagination-task-dto';
import { UpdateTaskDto } from 'src/common/dto/update-task-dto';

import { Task } from 'src/entities/task_entitie';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto) {
    const allTasks = await this.prisma.task.findMany({
      take: paginationDto.limit,
      skip: paginationDto.offSet,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return allTasks;
  }

  async findOneTask(id: number): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: id,
      },
    });

    if (task?.name) return task;

    throw new HttpException('Essa tarefa não existe', HttpStatus.NOT_FOUND);
  }

  async createTask(createTaskDto: CreateTaskDto) {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          user_id: createTaskDto.userId,
          name: createTaskDto.name,
          description: createTaskDto.description,
          completed: false,
        },
      });

      return newTask;
    } catch (error) {
      console.log(error);
    }
  }

  async updateTask(updateTaskDto: UpdateTaskDto, id: number): Promise<Task> {
    const findTask = await this.prisma.task.findFirst({
      where: {
        id: id,
      },
    });

    console.log(findTask);

    if (!findTask)
      throw new HttpException('Tarefa não encontrada', HttpStatus.NOT_FOUND);

    const task = await this.prisma.task.update({
      where: {
        id: findTask.id,
      },
      data: updateTaskDto,
    });

    return task;
  }

  async deleteTask(id: number) {
    try {
      const findTask = await this.prisma.task.findFirst({
        where: {
          id: id,
        },
      });

      if (!findTask)
        throw new HttpException('Tarefa não encontrada', HttpStatus.NOT_FOUND);

      await this.prisma.task.delete({
        where: {
          id: id,
        },
      });

      return 'tarefa deletada';
    } catch (e) {
      throw new HttpException(
        'Falha ao deletar essa tarefa',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
