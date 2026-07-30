import { Module } from '@nestjs/common';
import { ProdutoAlergenoController } from './produto-alergeno.controller';
import { ProdutoAlergenoService } from './produto-alergeno.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProdutoAlergenoController],
  providers: [ProdutoAlergenoService],
})
export class ProdutoAlergenoModule {}