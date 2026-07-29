import { Module } from '@nestjs/common';
import { AlergenoController } from './alergeno.controller';
import { AlergenoService } from './alergeno.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AlergenoController],
  providers: [AlergenoService],
})
export class AlergenoModule {}