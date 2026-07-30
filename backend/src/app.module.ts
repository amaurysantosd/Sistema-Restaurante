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
import { MesaModule } from './mesa/mesa.module';
import { IngredienteModule } from './ingrediente/ingrediente.module';
import { AlergenoModule } from './alergeno/alergeno.module';
import { TagModule } from './tag/tag.module';
import { ProdutoModule } from './produto/produto.module';
import { ProdutoVariacaoPrecoModule } from './produto-variacao-preco/produto-variacao-preco.module';
import { ProdutoMidiaModule } from './produto-midia/produto-midia.module';
import { ProdutoIngredienteModule } from './produto-ingrediente/produto-ingrediente.module';
import { ProdutoAlergenoModule } from './produto-alergeno/produto-alergeno.module';
import { ProdutoTagModule } from './produto-tag/produto-tag.module';
import { ProdutoHarmonizacaoModule } from './produto-harmonizacao/produto-harmonizacao.module';

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
    MesaModule,
    IngredienteModule,
    AlergenoModule,
    TagModule,
    ProdutoModule,
    ProdutoVariacaoPrecoModule,
    ProdutoMidiaModule,
    ProdutoIngredienteModule,
    ProdutoAlergenoModule,
    ProdutoTagModule,
    ProdutoHarmonizacaoModule,
  ],
})

export class AppModule {}