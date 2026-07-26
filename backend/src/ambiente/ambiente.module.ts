import { Module } from '@nestjs/common';
import { AmbienteController } from './ambiente.controller';
import { AmbienteService } from './ambiente.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmpresaModule } from 'src/empresa/empresa.module';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { FilialModule } from 'src/filial/filial.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        EmpresaModule,
        CategoriaModule,
        FilialModule,
        UsuarioModule,
        AuthModule,
        AmbienteModule, // ← adicionar
     ],
  controllers: [AmbienteController],
  providers: [AmbienteService],
})



export class AmbienteModule {}