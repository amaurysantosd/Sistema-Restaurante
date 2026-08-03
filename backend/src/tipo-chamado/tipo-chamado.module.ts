import { Module } from '@nestjs/common';
import { TipoChamadoController } from './tipo-chamado.controller';
import { TipoChamadoService } from './tipo-chamado.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipoChamadoController],
  providers: [TipoChamadoService],
})
export class TipoChamadoModule {}
