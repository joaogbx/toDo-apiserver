import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: NextFunction) {
    const authorization = req.headers['authorization'];

    console.log('interceptando req');
    if (authorization === '123456') {
      req['user'] = {
        token: authorization,
        role: 'admin',
      };
    }

    next();
  }
}
