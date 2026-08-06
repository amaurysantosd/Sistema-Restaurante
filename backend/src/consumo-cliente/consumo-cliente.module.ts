import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClienteAuthModule } from '../cliente-auth/cliente-auth.module';
import { PresencaModule } from '../presenca/presenca.module';
import { ConsumoClienteController } from './consumo-cliente.controller';
import { ConsumoClienteService } from './consumo-cliente.service';

@Module({
  imports: [PrismaModule, ClienteAuthModule, PresencaModule],
  controllers: [ConsumoClienteController],
  providers: [ConsumoClienteService],
})
export class ConsumoClienteModule {}
