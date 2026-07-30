import { Module } from '@nestjs/common';
import { ProdutoIngredienteController } from './produto-ingrediente.controller';
import { ProdutoIngredienteService } from './produto-ingrediente.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProdutoIngredienteController],
  providers: [ProdutoIngredienteService],
})
export class ProdutoIngredienteModule {}