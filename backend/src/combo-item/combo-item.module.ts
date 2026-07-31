import { Module } from '@nestjs/common';
import { ComboItemController } from './combo-item.controller';
import { ComboItemService } from './combo-item.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ComboItemController],
  providers: [ComboItemService],
})
export class ComboItemModule {}