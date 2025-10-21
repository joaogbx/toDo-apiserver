import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const usandoConfigModule = process.env.TOKEssN_KEY;
    console.log(usandoConfigModule);
    return this.appService.getHello();
  }
}
