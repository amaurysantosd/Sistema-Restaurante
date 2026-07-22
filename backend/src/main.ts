import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, /* remove qualquer campo que não esteja no DTO (protege contra injeção
       de dados não esperados) */
      forbidNonWhitelisted: true,/* em vez de só remover, rejeita a requisição inteira se vier 
      campo estranho */
      transform: true,/* converte automaticamente o JSON recebido pra instância da classe DTO, 
      o que faz os decorators de validação funcionarem */
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
