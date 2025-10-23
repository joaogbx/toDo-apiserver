import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from 'src/common/dto/signin-user-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingProtocol: HashingServiceProtocol,
  ) {}

  async autenticate(signInDto: SignInDto) {
    const user = this.prisma.user.findFirst({
      where: {
        email: signInDto.email,
      },
    });

    if (!user)
      throw new HttpException(
        'Falha ao realizar login',
        HttpStatus.UNAUTHORIZED,
      );

    const passwordHash = await this.hashingProtocol.hash(signInDto.password);
    const validateUser = await this.hashingProtocol.compare(
      signInDto.password,
      passwordHash,
    );

    if (!validateUser)
      throw new HttpException(
        'Usuário/senha incorretos',
        HttpStatus.UNAUTHORIZED,
      );
  }
}
