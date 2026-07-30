import { Module } from '@nestjs/common';
import { ProdutoTagController } from './produto-tag.controller';
import { ProdutoTagService } from './produto-tag.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProdutoTagController],
  providers: [ProdutoTagService],
})
export class ProdutoTagModule {}