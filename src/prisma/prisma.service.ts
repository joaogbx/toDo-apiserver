import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from  '../../prisma/generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Chamado no início da aplicação
  async onModuleInit() {
    // O $connect() deve estar aqui. Se não aparecer, verifique os passos acima!
    await this.$connect();
  }

  // Chamado no desligamento da aplicação
  async onModuleDestroy() {
    // Aqui usamos o $disconnect() para fechar a conexão
    await this.$disconnect();
  }
}