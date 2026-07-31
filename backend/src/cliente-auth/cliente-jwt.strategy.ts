import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClienteJwtStrategy extends PassportStrategy(Strategy, 'jwt-cliente') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
    // Verifica explicitamente que o token foi emitido como token de
    // CLIENTE (nao de Usuario/staff) -- sem essa checagem, qualquer
    // token valido (assinado com a mesma JWT_SECRET) seria aceito aqui,
    // mesmo sendo de outro tipo de usuario do sistema.
    if (payload.tipo !== 'cliente') {
      throw new UnauthorizedException('Token inválido para esta operação');
    }

    return { clienteId: payload.sub };
  }
}