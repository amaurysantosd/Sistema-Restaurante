import { Module } from '@nestjs/common';
import { RestricaoAlimentarController } from './restricao-alimentar.controller';
import { RestricaoAlimentarService } from './restricao-alimentar.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RestricaoAlimentarController],
  providers: [RestricaoAlimentarService],
})
export class RestricaoAlimentarModule {}