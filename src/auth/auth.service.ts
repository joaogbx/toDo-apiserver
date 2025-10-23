import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from 'src/common/dto/signin-user-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import type jwtConfigType from './config/jwt.config';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingProtocol: HashingServiceProtocol,
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfigType>,
  ) {}

  async autenticate(signInDto: SignInDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: signInDto.email,
      },
    });

    console.log(this.jwtConfiguration);

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

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: '30d',
      },
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token: token,
    };
  }
}
