# Fase 6 — Reservas e Eventos: Schema e decisões aprovadas

Este documento contém o schema e as decisões já discutidas e aprovadas para a Fase 6
(Reservas e Eventos). Todas as decisões abaixo já foram tomadas em conversa — não é
necessário perguntar de novo sobre elas. Aplique o schema, rode a migration, e a partir
daí construa o CRUD/lógica seguindo os padrões já estabelecidos no restante do projeto
(ver `briefing-continuidade-claude-code-pos-fase-5.md` para as convenções gerais).

---

## Decisões já tomadas (contexto, não perguntar de novo)

- **Reserva pode ser criada pelo staff (Usuario) OU pelo próprio Cliente** — primeira
  entidade do sistema com criação dupla. Quando criada sem Cliente cadastrado (ex:
  reserva por telefone), captura `nomeConvidado`/`telefoneConvidado` diretamente na
  Reserva.
- **Reserva "simples" nunca é obrigatoriamente cobrada** — sinal é sempre opcional, só
  existe quando há `valorOrcamento` preenchido (reservas com buffet/orçamento definido)
  E o estabelecimento configurou cobrança para esse caso. Reserva sem orçamento nunca
  gera cobrança — consumo é pago normalmente via Comanda, como qualquer mesa.
- **`Evento` é uma entidade separada, que a `Reserva` pode opcionalmente referenciar**
  (`eventoId`), em vez de um enum de "tipos de reserva" rígido. Isso cobre os quatro
  cenários descritos (mesa normal, aniversário, reserva do restaurante inteiro,
  datas festivas) sem precisar de um tipo fixo para cada: reserva normal e de
  aniversário não têm `eventoId`; "restaurante inteiro" e "época festiva" viram um
  `Evento` que a Reserva referencia.
- **Evento tipo PARTICULAR pode bloquear uma Filial ou Ambiente inteiro** num período —
  nenhuma outra reserva é permitida ali durante essa janela (validado no Service, não
  listando mesa por mesa).
- **Sinal congela `percentualSinal` no momento da criação da Reserva** (mesmo princípio
  de congelamento já usado em Produto/Promoção/ItemComanda) — mudança na configuração
  depois não afeta reservas já criadas.
- **Duas modalidades de recebimento, configuráveis por Empresa**: `PIX_MANUAL` (exibe
  dados de uma `ContaRecebimento` para o cliente pagar por fora, staff confirma
  manualmente) ou `GATEWAY` (integração automática — **não implementar agora**, depende
  do módulo Financeiro, Fase 9; só deixar o campo de configuração pronto para receber
  essa opção no futuro).
- **Múltiplas contas de recebimento por finalidade** (`ContaRecebimento`, com
  `finalidade`: COMANDA/RESERVA/EVENTO/GERAL) — permite o estabelecimento separar
  financeiramente vendas de salão, reservas e eventos, com fallback para `GERAL` se
  não houver conta específica para a finalidade.
- **No-show**: reservas sem comparecimento até `toleranciaAte` são canceladas
  automaticamente por job agendado (mesmo padrão `@Cron` já usado na Fase 5 para
  inatividade de `SessaoPresenca`) — mesa/ambiente ficam livres automaticamente, sem
  necessidade de "desbloqueio" manual (a validação de conflito de horário na criação de
  reserva nova só considera reservas com status PENDENTE/CONFIRMADA).
- **`ListaEspera` é entidade separada de `Reserva`** — fila em tempo real para quem
  chegou agora sem reserva e está aguardando mesa vaga (não é uma reserva futura),
  seguindo o mesmo padrão estrutural do `Chamado` (Fase 4), reaproveitando o Gateway
  WebSocket compartilhado (`AtendimentoModule`, Fase 5) para notificações em tempo real.
- **Validação de conflito de horário** (não permitir duas reservas sobrepostas na mesma
  mesa/ambiente) é lógica de Service, não constraint de banco.
- **Ideia registrada, NÃO implementar nesta fase**: mapa visual de mesas (estilo
  assento de ônibus) — ver nota própria no roadmap do produto, retomar quando o
  frontend estiver maduro para isso.

---

## 1. Novos enums

```prisma
enum TipoEvento {
  PARTICULAR   // aniversario/confraternizacao que bloqueia ambiente/filial inteiro
  SAZONAL      // data comemorativa (natal, virada de ano, dia dos namorados)
}

enum StatusReserva {
  PENDENTE
  CONFIRMADA
  CANCELADA
  COMPARECEU
  NAO_COMPARECEU // no-show, marcado automaticamente pelo job
}

enum StatusListaEspera {
  AGUARDANDO
  CHAMADO      // staff avisou que a mesa esta pronta
  ATENDIDO     // cliente foi acomodado
  DESISTIU
}

enum ModalidadePagamentoReserva {
  PIX_MANUAL   // exibe dados da ContaRecebimento, staff confirma manualmente
  GATEWAY      // integracao automatica -- NAO IMPLEMENTAR AGORA, depende da Fase 9
}

enum FinalidadeRecebimento {
  COMANDA
  RESERVA
  EVENTO
  GERAL
}
```

## 2. Novos models

```prisma
model Evento {
  id        String     @id @default(uuid())
  nome      String
  tipo      TipoEvento
  descricao String?

  dataInicio DateTime
  dataFim    DateTime

  // Se preenchido, bloqueia a filial inteira nesse periodo. Se null mas
  // ambienteId preenchido, bloqueia so aquele ambiente. Os dois nulos = evento
  // "informativo", sem bloqueio automatico de reservas.
  filialId String?
  filial   Filial? @relation(fields: [filialId], references: [id])

  ambienteId String?
  ambiente   Ambiente? @relation(fields: [ambienteId], references: [id])

  valorEntrada Float? // cobranca de entrada, se houver (ligacao futura com Financeiro)
  ativo        Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  reservas Reserva[]

  @@index([filialId])
  @@index([ambienteId])
}

model Reserva {
  id                String        @id @default(uuid())
  dataHora          DateTime
  quantidadePessoas Int
  status            StatusReserva @default(PENDENTE)
  observacoes       String?

  // Preenchido pelo staff quando a reserva e feita sem Cliente cadastrado
  // (ex: reserva por telefone). Se clienteId existir, usar os dados do Cliente.
  nomeConvidado     String?
  telefoneConvidado String?

  // Orcamento opcional -- so gera cobranca de sinal se preenchido E se a
  // configuracao do estabelecimento previr cobranca para este caso
  valorOrcamento  Float?
  percentualSinal Float? // copiado da config no momento da criacao (congelado)
  valorSinal      Float? // calculado: valorOrcamento * (percentualSinal / 100)
  sinalPago       Boolean @default(false)

  // Tolerancia de comparecimento, usada pelo job de no-show
  toleranciaAte DateTime?

  filialId String
  filial   Filial @relation(fields: [filialId], references: [id])

  ambienteId String?
  ambiente   Ambiente? @relation(fields: [ambienteId], references: [id])

  mesaId String?
  mesa   Mesa? @relation(fields: [mesaId], references: [id])

  eventoId String?
  evento   Evento? @relation(fields: [eventoId], references: [id])

  clienteId String?
  cliente   Cliente? @relation(fields: [clienteId], references: [id])

  criadoPorUsuarioId String?
  criadoPorUsuario   Usuario? @relation(fields: [criadoPorUsuarioId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([filialId])
  @@index([clienteId])
  @@index([eventoId])
  @@index([dataHora])
}

model ListaEspera {
  id                String            @id @default(uuid())
  quantidadePessoas Int
  status            StatusListaEspera @default(AGUARDANDO)

  nomeConvidado     String?
  telefoneConvidado String?

  criadoEm   DateTime  @default(now())
  chamadoEm  DateTime?
  atendidoEm DateTime?

  filialId String
  filial   Filial @relation(fields: [filialId], references: [id])

  clienteId String?
  cliente   Cliente? @relation(fields: [clienteId], references: [id])

  @@index([filialId])
  @@index([status])
}

model ContaRecebimento {
  id             String                @id @default(uuid())
  finalidade     FinalidadeRecebimento
  chavePix       String
  nomeFavorecido String
  nomeBanco      String?
  ativo          Boolean               @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  empresaId String
  empresa   Empresa @relation(fields: [empresaId], references: [id])

  @@unique([empresaId, finalidade])
  @@index([empresaId])
}
```

## 3. Ajustes em models existentes

### `Empresa` — adicionar campos

```prisma
modalidadePagamentoReserva ModalidadePagamentoReserva @default(PIX_MANUAL)
contasRecebimento          ContaRecebimento[]
```

### `Filial` — adicionar campos

```prisma
reservaExigeCadastro         Boolean @default(false) // PROVISORIO, migrar para painel adm
reservaPercentualSinalPadrao Float   @default(50)     // PROVISORIO, migrar para painel adm
```

## 4. Lados inversos a adicionar

| Model | Linha a adicionar |
|---|---|
| `Filial` | `eventos Evento[]`<br>`reservas Reserva[]`<br>`listaEspera ListaEspera[]` |
| `Ambiente` | `eventos Evento[]`<br>`reservas Reserva[]` |
| `Mesa` | `reservas Reserva[]` |
| `Cliente` | `reservas Reserva[]`<br>`listaEspera ListaEspera[]` |
| `Usuario` | `reservasCriadas Reserva[]` |

## 5. Passos de aplicação

```bash
npx prisma migrate dev --name fase6_reserva_evento_lista_espera
npx prisma generate
npx prisma migrate status
npx tsc --noEmit
```

---

## 6. Lógica a implementar (depois do schema aplicado)

### 6.1. Validação de conflito de horário (`ReservaService.create`)

Antes de criar uma Reserva, verificar se já existe outra Reserva com status
PENDENTE/CONFIRMADA para a mesma `mesaId` (ou `ambienteId`, se a reserva for por
ambiente inteiro) em horário sobreposto. Também verificar se existe um `Evento` tipo
PARTICULAR bloqueando a `filialId`/`ambienteId` naquele período — se houver, rejeitar
a criação da reserva com mensagem clara.

### 6.2. Cálculo do sinal

Se `valorOrcamento` for informado, calcular `valorSinal = valorOrcamento *
(percentualSinal / 100)`, usando `Filial.reservaPercentualSinalPadrao` como valor
default se `percentualSinal` não for informado explicitamente na criação. Copiar esse
percentual para o campo da Reserva (congelamento).

### 6.3. Retorno dos dados de pagamento

Ao criar uma Reserva com `valorSinal > 0`, se `Empresa.modalidadePagamentoReserva ==
PIX_MANUAL`, buscar a `ContaRecebimento` da empresa com `finalidade: RESERVA` (ou
`GERAL` como fallback) e incluir os dados na resposta, para o frontend exibir o
"copia e cola" do Pix. Se nenhuma conta estiver configurada, retornar erro claro
explicando que o estabelecimento precisa cadastrar uma forma de recebimento antes de
criar reservas com sinal.

### 6.4. Confirmação manual do sinal

Rota `PATCH /reserva/:id/confirmar-sinal` (staff, `JwtAuthGuard`) marca `sinalPago:
true` e avança `status` de `PENDENTE` para `CONFIRMADA`.

### 6.5. Job de no-show

Reaproveitar o padrão já usado no job de inatividade da Fase 5 (`@Cron`). Buscar
Reservas com status PENDENTE ou CONFIRMADA cuja `toleranciaAte` já passou, e marcar
como `NAO_COMPARECEU`. Definir a frequência do job (sugestão: a cada 15 min, mesma
frequência já usada na Fase 5, mas Claude Code deve confirmar antes de implementar se
outra frequência fizer mais sentido para este caso).

### 6.6. Integração com Presença (check-in via Reserva)

Quando um Cliente com Reserva confirmada chega e faz check-in (via QR Code, fluxo já
existente da Fase 5), o `PresencaService.checkIn` deve, se encontrar uma Reserva
correspondente (mesmo cliente, mesma filial, dataHora próxima), marcar essa Reserva
como `COMPARECEU`. Antes de implementar o critério exato de "correspondência" (janela de
tempo aceitável entre `Reserva.dataHora` e o check-in real, como localizar a reserva
certa se houver mais de uma), **pare e pergunte** — esta é uma integração entre dois
módulos já existentes e merece decisão explícita, não suposição.

### 6.7. ListaEspera com Gateway compartilhado

Emitir eventos (`lista-espera:novo`, `lista-espera:atualizado`) pelo Gateway já
existente em `AtendimentoModule`, mesmo padrão de rooms por filial/empresa já usado em
`chamado:novo` e `presenca:cliente-notavel`.

### 6.8. CRUD de Evento, ContaRecebimento

Módulos completos padrão (DTO, Service, Controller, Module), protegidos por
`JwtAuthGuard`. `ContaRecebimento` deve ter cuidado especial: dados de chave Pix são
sensíveis — considerar se a listagem (`GET`) deve mascarar parcialmente a chave para
perfis que não sejam ADMIN/GERENTE (pare e pergunte antes de decidir isso, não é óbvio
qual o nível de restrição correto).

---

Pare e pergunte antes de qualquer decisão de arquitetura ou modelagem não coberta
explicitamente neste documento — mesmo método de trabalho já usado no resto do projeto.
Explique o "porquê" das partes não óbvias com comentários no código.
