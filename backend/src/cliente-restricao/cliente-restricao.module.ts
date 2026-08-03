import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClienteAuthModule } from '../cliente-auth/cliente-auth.module';
import { ClienteRestricaoController } from './cliente-restricao.controller';
import { ClienteRestricaoService } from './cliente-restricao.service';

@Module({
  imports: [PrismaModule, ClienteAuthModule],
  controllers: [ClienteRestricaoController],
  providers: [ClienteRestricaoService],
})
export class ClienteRestricaoModule {}
