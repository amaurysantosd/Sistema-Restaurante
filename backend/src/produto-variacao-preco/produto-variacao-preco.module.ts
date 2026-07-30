import { Module } from '@nestjs/common';
import { ProdutoVariacaoPrecoController } from './produto-variacao-preco.controller';
import { ProdutoVariacaoPrecoService } from './produto-variacao-preco.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProdutoVariacaoPrecoController],
  providers: [ProdutoVariacaoPrecoService],
})
export class ProdutoVariacaoPrecoModule {}