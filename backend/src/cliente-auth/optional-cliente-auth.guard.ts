import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Variante do ClienteAuthGuard que NUNCA bloqueia a rota: se houver um token
 * valido de cliente, popula req.user normalmente; se nao houver token (ou
 * for invalido/expirado), deixa req.user undefined e a requisicao segue
 * mesmo assim. Usado em rotas publicas que precisam RECONHECER o cliente
 * quando ele esta logado, sem exigir login (ex: GET /mesa/qrcode/:codigo,
 * que dispara check-in de presenca so quando ha cliente autenticado).
 */
@Injectable()
export class OptionalClienteAuthGuard extends AuthGuard('jwt-cliente') {
  handleRequest(err: any, user: any) {
    // Comportamento padrao do AuthGuard lancaria UnauthorizedException aqui
    // se err ou !user -- sobrescrito pra so devolver o que tiver (ou null),
    // nunca bloquear.
    return user || null;
  }
}
