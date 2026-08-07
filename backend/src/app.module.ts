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
import { ScheduleModule } from '@nestjs/schedule';
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
import { ProdutoDisponibilidadeModule } from './produto-disponibilidade/produto-disponibilidade.module';
import { PromocaoModule } from './promocao/promocao.module';
import { ComboModule } from './combo/combo.module';
import { ComboItemModule } from './combo-item/combo-item.module';
import { RestricaoAlimentarModule } from './restricao-alimentar/restricao-alimentar.module';
import { ClienteAuthModule } from './cliente-auth/cliente-auth.module';
import { FavoritoModule } from './favorito/favorito.module';
import { HistoricoVisitaModule } from './historico-visita/historico-visita.module';
import { ClienteRestricaoModule } from './cliente-restricao/cliente-restricao.module';
import { ClienteFilialModule } from './cliente-filial/cliente-filial.module';
import { TipoChamadoModule } from './tipo-chamado/tipo-chamado.module';
import { ChamadoModule } from './chamado/chamado.module';
import { ComandaModule } from './comanda/comanda.module';
import { ConsumoClienteModule } from './consumo-cliente/consumo-cliente.module';
import { PresencaModule } from './presenca/presenca.module';
import { EventoModule } from './evento/evento.module';

/* @Module({
  imports: [PrismaModule, EmpresaModule, CategoriaModule, FilialModule, UsuarioModule, AuthModule, AmbienteModule],
  controllers: [AppController],
  providers: [AppService],
})
 */

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
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
    ProdutoDisponibilidadeModule,
    PromocaoModule,
    ComboModule,
    ComboItemModule,
    RestricaoAlimentarModule,
    ClienteAuthModule,
    FavoritoModule,
    HistoricoVisitaModule,
    ClienteRestricaoModule,
    ClienteFilialModule,
    TipoChamadoModule,
    ChamadoModule,
    ComandaModule,
    ConsumoClienteModule,
    PresencaModule,
    EventoModule,
  ],
})

export class AppModule {}