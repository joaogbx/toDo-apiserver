import { Module } from '@nestjs/common';
import { TaskController } from './task_controller';
import { TaskService } from './task_service';
import { PrismaModule } from '../prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from 'src/common/filters/exception-filter';

@Module({
  imports: [PrismaModule],
  providers: [
    TaskService,
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
  controllers: [TaskController],
})
export class TaskModule {}
