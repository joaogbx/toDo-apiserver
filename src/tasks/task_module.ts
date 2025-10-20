import { Module } from '@nestjs/common';
import { TaskController } from './task_controller';
import { TaskService } from './task_service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
