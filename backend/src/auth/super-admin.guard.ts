import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * Guard que exige, alem de estar autenticado (JwtAuthGuard ja deve ter
 * rodado antes), que o usuario tenha a flag superAdmin=true no token.
 * Usado para proteger operacoes sobre catalogos globais da plataforma
 * (ex: RestricaoAlimentar), que nao sao isolados por empresa.
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user?.superAdmin) {
      throw new ForbiddenException('Apenas administradores da plataforma podem realizar esta ação');
    }

    return true;
  }
}