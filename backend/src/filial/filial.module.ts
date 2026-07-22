import { Module } from "@nestjs/common";
import { FilialController } from "./filial.controller";
import { FilialService } from "./filial.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [FilialController], /* lista de Controllers que este módulo expõe como
   rotas HTTP. */
  providers: [FilialService], /* lista de classes que o Nest deve saber instanciar e 
  injetar quando algo pedir por elas no construtor */
})
export class FilialModule {}