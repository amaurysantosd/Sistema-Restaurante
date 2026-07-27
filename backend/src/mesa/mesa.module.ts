import { Module } from '@nestjs/common';
import { MesaController } from './mesa.controller';
import { MesaService } from './mesa.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MesaController],
  providers: [MesaService],
})
export class MesaModule {}