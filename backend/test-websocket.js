/**
 * Script de teste manual do AtendimentoGateway (WebSocket compartilhado por
 * Chamado, Fase 4, e Presenca, Fase 5). NAO faz parte da aplicacao -- so uma
 * ferramenta pra conferir na mao que a notificacao em tempo real esta
 * funcionando. Ver instrucoes de uso no chat.
 *
 * Uso:
 *   node test-websocket.js <TOKEN> [URL_DO_SERVIDOR]
 *   TOKEN=xxxxx node test-websocket.js
 *   (ou cole o token direto na constante TOKEN abaixo)
 */

const { io } = require('socket.io-client');

// Cole aqui um token de staff (retorno de POST /auth/login, campo
// "access_token") se preferir nao passar por argumento/variavel de ambiente.
const TOKEN_HARDCODED = '';

const token = process.argv[2] || process.env.TOKEN || TOKEN_HARDCODED;
const url = process.argv[3] || process.env.WS_URL || 'http://localhost:3000';

if (!token) {
  console.error(
    'Nenhum token informado. Use: node test-websocket.js <TOKEN> [URL_DO_SERVIDOR]\n' +
      'ou defina a variavel de ambiente TOKEN, ou cole em TOKEN_HARDCODED no script.',
  );
  process.exit(1);
}

console.log(`Conectando em ${url} ...`);

// O token vai em "auth", nao em header/query -- e exatamente o que
// AtendimentoGateway.handleConnection le em client.handshake.auth.token.
const socket = io(url, {
  auth: { token },
});

socket.on('connect', () => {
  console.log(`Conectado! socket.id = ${socket.id}`);
  console.log(
    'Aguardando eventos de chamado e de presenca... ' +
      '(crie um Chamado, ou faca check-in de um cliente notavel via QR Code, em outro terminal/Insomnia)',
  );
});

socket.on('disconnect', (reason) => {
  console.log(`Desconectado. Motivo: ${reason}`);
  // O Gateway desconecta imediatamente conexoes sem token valido -- se cair
  // aqui logo depois de conectar, o token provavelmente esta invalido/expirado
  // ou nao pertence a um Usuario de staff.
});

socket.on('connect_error', (err) => {
  console.error('Erro de conexão:', err.message);
});

socket.on('chamado:novo', (chamado) => {
  console.log('\n=== chamado:novo ===');
  console.log(JSON.stringify(chamado, null, 2));
});

socket.on('chamado:atualizado', (chamado) => {
  console.log('\n=== chamado:atualizado ===');
  console.log(JSON.stringify(chamado, null, 2));
});

// Fase 5 -- disparado por PresencaService.avaliarNotavel quando o cliente que
// fez check-in via QR Code e recorrente, VIP automatico ou VIP manual.
socket.on('presenca:cliente-notavel', (dados) => {
  console.log('\n=== presenca:cliente-notavel ===');
  console.log(JSON.stringify(dados, null, 2));
});
