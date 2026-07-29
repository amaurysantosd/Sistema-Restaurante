import { Module } from '@nestjs/common';
import { IngredienteController } from './ingrediente.controller';
import { IngredienteService } from './ingrediente.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IngredienteController],
  providers: [IngredienteService],
})
export class IngredienteModule {}