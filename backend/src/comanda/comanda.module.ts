import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PresencaModule } from '../presenca/presenca.module';
import { ComandaController } from './comanda.controller';
import { ComandaService } from './comanda.service';
import { ItemComandaService } from './item-comanda.service';

@Module({
  imports: [PrismaModule, PresencaModule],
  controllers: [ComandaController],
  providers: [ComandaService, ItemComandaService],
})
export class ComandaModule {}
