import { Module } from '@nestjs/common';
import { ProdutoDisponibilidadeController } from './produto-disponibilidade.controller';
import { ProdutoDisponibilidadeService } from './produto-disponibilidade.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProdutoDisponibilidadeController],
  providers: [ProdutoDisponibilidadeService],
})
export class ProdutoDisponibilidadeModule {}