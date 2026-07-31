import { Module } from '@nestjs/common';
import { FavoritoController } from './favorito.controller';
import { FavoritoService } from './favorito.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ClienteAuthModule } from '../cliente-auth/cliente-auth.module';

@Module({
  imports: [PrismaModule, ClienteAuthModule],
  controllers: [FavoritoController],
  providers: [FavoritoService],
})
export class FavoritoModule {}