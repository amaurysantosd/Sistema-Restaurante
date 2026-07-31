import { Module } from '@nestjs/common';
import { PromocaoController } from './promocao.controller';
import { PromocaoService } from './promocao.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PromocaoController],
  providers: [PromocaoService],
})
export class PromocaoModule {}