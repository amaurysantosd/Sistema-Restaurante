import { Module } from '@nestjs/common';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';

/* organiza tudo relacionado à empresa. Nesse módulo existe
 um controller e um service. */
 
@Module({
  controllers: [EmpresaController],
  providers: [EmpresaService]
})
export class EmpresaModule {}
