import 'dotenv/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

/*Esse arquivo é MUITO importante. O PrismaService existe para centralizar
 o acesso ao banco de dados. Assim, todos os módulos utilizam a mesma 
 conexão e o mesmo serviço, evitando duplicação de código e facilitando 
 a manutenção. */

/* Ele cria e mantém a conexão única com o banco e expõe o PrismaClient para 
toda a aplicação. Imagine que o banco seja outro prédio. Quem leva as 
informações até lá? O PrismaService. */

@Injectable()
/* PrismaService herda todas as funcionalidades do PrismaClient */
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    super({
      adapter: new PrismaPg(pool),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}