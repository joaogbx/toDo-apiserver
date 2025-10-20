import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateTaskDto } from './create-task-dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  //com o partialtype, os parametros e validações sao herdados dec reatetaskdto para updatataskdto, porem tornando eles o opcionais

  @IsBoolean()
  @IsOptional()
  readonly completed?: boolean;
}
