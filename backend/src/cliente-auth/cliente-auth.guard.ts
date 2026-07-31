import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que exige um token valido gerado pela ClienteJwtStrategy
 * ('jwt-cliente'). Usar em rotas de acao do proprio cliente (favoritar,
 * ver historico, ver perfil) -- nunca nas rotas administrativas de staff,
 * que continuam usando JwtAuthGuard.
 */
@Injectable()
export class ClienteAuthGuard extends AuthGuard('jwt-cliente') {}