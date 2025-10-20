import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  //pipe utilizado para frazer as validações

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;
}
