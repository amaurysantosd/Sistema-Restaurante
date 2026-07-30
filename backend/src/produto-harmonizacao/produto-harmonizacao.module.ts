import { Module } from '@nestjs/common';
import { ProdutoHarmonizacaoController } from './produto-harmonizacao.controller';
import { ProdutoHarmonizacaoService } from './produto-harmonizacao.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProdutoHarmonizacaoController],
  providers: [ProdutoHarmonizacaoService],
})
export class ProdutoHarmonizacaoModule {}