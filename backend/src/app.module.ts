import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './empresa/empresa.module';
import { CategoriaModule } from './categoria/categoria.module';
import { PrismaModule } from './prisma/prisma.module';
import { FilialModule } from './filial/filial.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [PrismaModule, EmpresaModule, CategoriaModule, FilialModule, UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


  