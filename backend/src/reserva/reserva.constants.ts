// Valores PROVISORIOS/HARDCODED por decisao consciente -- devem migrar para
// painel administrativo de configuracao quando esse painel existir (mesmo
// espirito de presenca.constants.ts, Fase 5). O schema de Reserva so tem
// dataHora (sem campo de fim/duracao), entao os dois valores abaixo cobrem
// as duas necessidades que dependem de "ate quando" a reserva vale:

// Por quanto tempo a reserva ocupa a mesa/ambiente, a partir de dataHora --
// usado pra detectar sobreposicao de horario (ReservaService.criar) e como
// limite superior da janela de match check-in -> reserva (PresencaService).
export const DURACAO_OCUPACAO_MESA_MINUTOS = 120;

// Quanto tempo se espera o cliente chegar apos dataHora antes de considerar
// no-show -- usado pra calcular o default de toleranciaAte na criacao e
// como limite inferior da janela de match check-in -> reserva.
export const TOLERANCIA_COMPARECIMENTO_MINUTOS = 30;
