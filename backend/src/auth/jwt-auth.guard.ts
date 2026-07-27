import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Verifica se o metodo (ou a classe) tem a marca @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // o metodo especifico sendo chamado
      context.getClass(),   // o controller inteiro (caso @Public() esteja na classe)
    ]);

    // Se for publica, libera o acesso sem checar token nenhum
    if (isPublic) {
      return true;
    }

    // Caso contrario, segue o comportamento normal (exige token valido)
    return super.canActivate(context);
  }
}