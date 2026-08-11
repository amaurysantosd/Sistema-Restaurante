# Fase 5 — Presença Inteligente: Schema e decisões aprovadas

Este documento contém o schema e as decisões já discutidas e aprovadas para a Fase 5
(Presença Inteligente). Todas as decisões abaixo já foram tomadas em conversa — não é
necessário perguntar de novo sobre elas. Aplique o schema, rode a migration, e a partir
daí construa o CRUD/lógica seguindo os padrões já estabelecidos no restante do projeto
(ver `briefing-continuidade-claude-code.md` para as convenções gerais).

---

## Decisões já tomadas (contexto, não perguntar de novo)

- **Gatilho de check-in**: quando um Cliente **logado** (token de `ClienteAuthGuard`)
  escaneia o QR Code da mesa (`GET /mesa/qrcode/:codigo`), isso dispara automaticamente
  a criação (ou reaproveitamento) de uma `SessaoPresenca`. Sem login, o cliente só vê o
  cardápio anonimamente, sem nenhuma sessão criada — comportamento atual da rota
  permanece igual para acesso anônimo.
- **Reaproveitamento de sessão**: se o Cliente escanear de novo dentro de uma janela de
  tempo (usar 2 horas como valor inicial), a sessão `ATIVA` existente é reaproveitada
  (atualiza `ultimaAtividadeEm`), em vez de criar uma nova. Fora dessa janela, cria nova.
- **Encerramento da sessão — os dois mecanismos combinados**:
  1. Quando o staff fecha a Comanda daquela mesa (`ComandaService.fechar`), encerra
     também qualquer `SessaoPresenca` ativa na mesma mesa.
  2. Por inatividade automática: um job agendado (ver seção de job abaixo) encerra
     sessões cuja `ultimaAtividadeEm` passou de um limite (usar 3 horas como valor
     inicial).
- **`ultimaAtividadeEm`** deve ser atualizado em outras ações do cliente na mesma sessão
  (ex: favoritar um produto, marcar `ConsumoCliente`, escanear o QR de novo) — não só no
  check-in inicial. Se for muito trabalhoso conectar em todos os pontos agora, pelo menos
  conectar no check-in e no `ConsumoCliente` (ação mais indicativa de presença real).
- **Critério de cliente recorrente/VIP — os dois combinados**:
  - Recorrente automático: 3 ou mais registros de `HistoricoVisita` do Cliente na mesma
    Filial.
  - VIP automático: 10 ou mais visitas OU pontos de fidelidade (`ClienteFilial.pontosFidelidade`)
    acima de um valor a definir (usar 500 como placeholder inicial).
  - VIP manual: campo `ClienteFilial.vipManual` (boolean), marcado pelo staff
    independente da contagem — cobre casos que número nenhum capturaria (amigo do dono,
    influenciador, etc.).
  - **Esses valores (3, 10, 500, janela de 2h, limite de 3h de inatividade) são
    PROVISÓRIOS/HARDCODED por decisão consciente** — devem ficar centralizados como
    constantes nomeadas e claramente comentadas (ex: um arquivo `presenca.constants.ts`),
    não espalhadas soltas pelo código, porque a intenção declarada é migrá-las para um
    painel administrativo de configuração assim que esse painel existir (registrado como
    requisito transversal no roadmap do produto — não é necessário construir esse painel
    agora, só deixar os valores fáceis de localizar e trocar depois).
- **Notificação em tempo real**: dispara **somente** quando o cliente que fez check-in é
  recorrente, VIP automático ou VIP manual (não dispara para todo check-in comum) —
  reaproveita o Gateway WebSocket compartilhado já existente da Fase 4 (mesma
  autenticação, mesmas rooms por filial/empresa), com um novo evento.

---

## 1. Novo enum e model

```prisma
enum StatusSessao {
  ATIVA
  ENCERRADA
}

model SessaoPresenca {
  id     String       @id @default(uuid())
  status StatusSessao @default(ATIVA)

  checkInEm         DateTime  @default(now())
  ultimaAtividadeEm DateTime  @default(now()) // atualizado a cada acao relevante do cliente
  encerradaEm       DateTime?

  clienteId String
  cliente   Cliente @relation(fields: [clienteId], references: [id])

  mesaId String
  mesa   Mesa @relation(fields: [mesaId], references: [id])

  @@index([clienteId])
  @@index([mesaId])
  @@index([status])
}
```

## 2. Ajuste em model existente

### `ClienteFilial` — adicionar campo

```prisma
vipManual Boolean @default(false) // marcado manualmente pelo staff, independente de
                                    // contagem automatica de visitas/pontos
```

## 3. Lados inversos a adicionar

| Model | Linha a adicionar |
|---|---|
| `Cliente` | `sessoesPresenca SessaoPresenca[]` |
| `Mesa` | `sessoesPresenca SessaoPresenca[]` |

## 4. Passos de aplicação

```bash
npx prisma migrate dev --name fase5_sessao_presenca
npx prisma generate
npx prisma migrate status
npx tsc --noEmit
```

---

## 5. Lógica a implementar (depois do schema aplicado)

### 5.1. Constantes centralizadas

Criar um arquivo próprio (ex: `src/presenca/presenca.constants.ts`) com os valores
provisórios, bem comentados:

```typescript
// Valores PROVISORIOS/HARDCODED por decisao consciente -- devem migrar para painel
// administrativo de configuracao quando esse painel existir (ver roadmap do produto,
// requisito transversal "Painel administrativo de configuracoes"). Centralizados aqui
// para facilitar localizacao e troca futura.

export const JANELA_REAPROVEITAMENTO_SESSAO_HORAS = 2;
export const LIMITE_INATIVIDADE_HORAS = 3;
export const MINIMO_VISITAS_RECORRENTE = 3;
export const MINIMO_VISITAS_VIP_AUTOMATICO = 10;
export const MINIMO_PONTOS_VIP_AUTOMATICO = 500;
```

### 5.2. Ajuste no endpoint de QR Code da Mesa (`mesa.service.ts` / `mesa.controller.ts`)

Ao acessar `GET /mesa/qrcode/:codigo`:
- Se a requisição estiver autenticada como Cliente (verificar se há um token válido de
  `ClienteAuthGuard` — como essa rota é `@Public()`, pode ser necessário um mecanismo
  de "autenticação opcional" que tenta validar o token se presente, mas não bloqueia se
  ausente; se não houver padrão pronto para isso no projeto, pare e pergunte antes de
  implementar), buscar/criar a `SessaoPresenca` conforme a regra de reaproveitamento por
  janela de tempo.
- Se não autenticado, comportamento atual permanece inalterado (só retorna os dados do
  cardápio/mesa, sem criar sessão).

### 5.3. Cálculo de recorrente/VIP e disparo de notificação

No momento da criação de uma `SessaoPresenca` nova (não em reaproveitamento), calcular:
1. Contar `HistoricoVisita` do Cliente na Filial (via Mesa → Ambiente → Filial)
2. Verificar `ClienteFilial.vipManual` e `pontosFidelidade`
3. Se recorrente ou VIP (qualquer critério), emitir evento no Gateway WebSocket
   compartilhado (ex: `presenca:cliente-notavel`), com dados do cliente, mesa e o motivo
   (recorrente/VIP automático/VIP manual) — mesma lógica de rooms por filial/empresa já
   usada no evento `chamado:novo`.

### 5.4. Encerramento ao fechar Comanda

Em `ComandaService.fechar` (módulo já existente da Fase 4): após mudar
`Comanda.status` para `FECHADA`, buscar `SessaoPresenca` com `status: ATIVA` na mesma
`mesaId` e encerrar (`status: ENCERRADA`, `encerradaEm: new Date()`).

### 5.5. Job agendado de encerramento por inatividade

Esta é a primeira vez que o projeto precisa de um job agendado (execução periódica, não
disparada por requisição HTTP). Usar `@nestjs/schedule` (instalar se necessário:
`npm install @nestjs/schedule`). Antes de implementar os detalhes (frequência exata do
job, decorator usado, onde ele mora no projeto), **pare e apresente as opções de
arquitetura**, seguindo o método de trabalho já estabelecido — esta é uma peça nova,
assim como o WebSocket foi na Fase 4.

### 5.6. CRUD/consulta de SessaoPresenca

Construir rotas para o staff consultar sessões ativas (ex: `GET /sessao-presenca?filialId=`
retornando quem está presente agora, em qual mesa, há quanto tempo) — protegidas por
`JwtAuthGuard`. Não é necessário CRUD de criação manual (sessão só nasce via check-in
automático).

---

Pare e pergunte antes de qualquer decisão de arquitetura ou modelagem não coberta
explicitamente neste documento — mesmo método de trabalho já usado no resto do projeto.
Explique o "porquê" das partes não óbvias com comentários no código.
