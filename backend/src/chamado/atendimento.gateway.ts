import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * Gateway compartilhado de atendimento em tempo real. Nasce aqui para
 * notificar Chamados, mas o design (rooms por filial/empresa) e pensado
 * para tambem carregar eventos de Comanda/ItemComanda mais adiante (painel
 * do garcom), sem precisar de uma segunda conexao/namespace no cliente.
 */
@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class AtendimentoGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // Autentica a conexao com o mesmo JWT de staff usado no resto do sistema
  // (enviado no handshake via `auth: { token }`, nao em header/query) e
  // coloca o socket na room da sua filial. Usuario sem filialId (ex: ADMIN
  // que gerencia varias filiais) entra na room da empresa inteira em vez
  // disso -- ver notificarNovoChamado, que emite pras duas rooms.
  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string | undefined;
      if (!token) {
        throw new Error('Token ausente');
      }

      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });

      const room = payload.filialId
        ? `filial:${payload.filialId}`
        : `empresa:${payload.empresaId}`;

      client.join(room);
    } catch {
      client.disconnect();
    }
  }

  notificarNovoChamado(filialId: string, empresaId: string, chamado: unknown) {
    this.server.to(`filial:${filialId}`).to(`empresa:${empresaId}`).emit('chamado:novo', chamado);
  }

  notificarChamadoAtualizado(filialId: string, empresaId: string, chamado: unknown) {
    this.server
      .to(`filial:${filialId}`)
      .to(`empresa:${empresaId}`)
      .emit('chamado:atualizado', chamado);
  }
}
