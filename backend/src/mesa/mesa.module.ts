import { Module } from '@nestjs/common';
import { MesaController } from './mesa.controller';
import { MesaService } from './mesa.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PresencaModule } from '../presenca/presenca.module';

@Module({
  imports: [PrismaModule, PresencaModule],
  controllers: [MesaController],
  providers: [MesaService],
})
export class MesaModule {}
