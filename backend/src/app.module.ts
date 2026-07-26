import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './empresa/empresa.module';
import { CategoriaModule } from './categoria/categoria.module';
import { PrismaModule } from './prisma/prisma.module';
import { FilialModule } from './filial/filial.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AmbienteModule } from './ambiente/ambiente.module';
import { TipoAmbienteModule } from './tipo-ambiente/tipo-ambiente.module';

/* @Module({
  imports: [PrismaModule, EmpresaModule, CategoriaModule, FilialModule, UsuarioModule, AuthModule, AmbienteModule],
  controllers: [AppController],
  providers: [AppService],
})
 */

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EmpresaModule,
    CategoriaModule,
    FilialModule,
    UsuarioModule,
    AuthModule,
    AmbienteModule,
    TipoAmbienteModule,
  ],
})

export class AppModule {}