import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AtendimentoGateway } from './atendimento.gateway';

@Module({
  // JwtModule sem config async aqui de proposito: o Gateway passa o
  // JWT_SECRET manualmente em cada verify() (via ConfigService, global),
  // sem precisar reexportar o JwtModule ja configurado dentro do AuthModule.
  imports: [JwtModule.register({})],
  providers: [AtendimentoGateway],
  exports: [AtendimentoGateway],
})
export class AtendimentoModule {}
