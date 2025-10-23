import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'O email deve ser um endereço de e-mail válido.' })
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  readonly email: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  readonly password: string;
}
