import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { time } from 'console';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenHeader(request);

    if (!token)
      throw new HttpException('Token não encontrado', HttpStatus.UNAUTHORIZED);

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );

      return payload;
    } catch (error) {
      console.log(error);
      throw new HttpException('Acesso não autorizado', HttpStatus.UNAUTHORIZED);
    }
  }

  extractTokenHeader(request: Request): string | null {
    const authorization = request.headers?.authorization;

    if (!authorization || typeof authorization !== 'string') return null;

    console.log('token jwt', authorization.split(' ')[1]);

    return authorization.split(' ')[1];
  }
}
