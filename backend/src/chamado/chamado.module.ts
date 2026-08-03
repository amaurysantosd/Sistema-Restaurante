import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { ChamadoController } from './chamado.controller';
import { ChamadoService } from './chamado.service';
import { AtendimentoGateway } from './atendimento.gateway';

@Module({
  // JwtModule sem config async aqui de proposito: o Gateway passa o
  // JWT_SECRET manualmente em cada verify() (via ConfigService, global),
  // sem precisar reexportar o JwtModule ja configurado dentro do AuthModule.
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [ChamadoController],
  providers: [ChamadoService, AtendimentoGateway],
})
export class ChamadoModule {}
