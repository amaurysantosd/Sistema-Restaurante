import { Module } from '@nestjs/common';
import { ProdutoMidiaController } from './produto-midia.controller';
import { ProdutoMidiaService } from './produto-midia.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProdutoMidiaController],
  providers: [ProdutoMidiaService],
})
export class ProdutoMidiaModule {}