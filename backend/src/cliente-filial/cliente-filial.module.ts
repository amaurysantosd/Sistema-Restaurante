import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClienteAuthModule } from '../cliente-auth/cliente-auth.module';
import { ClienteFilialController } from './cliente-filial.controller';
import { ClienteFilialService } from './cliente-filial.service';

@Module({
  imports: [PrismaModule, ClienteAuthModule],
  controllers: [ClienteFilialController],
  providers: [ClienteFilialService],
})
export class ClienteFilialModule {}
