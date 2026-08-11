# Fase 4 — Atendimento: Schema completo aprovado

Este documento contém o schema já discutido e aprovado para a Fase 4 (Comandas,
Chamados de Mesa, Consumo do Cliente). Todas as decisões de modelagem abaixo já foram
tomadas em conversa — não é necessário perguntar de novo sobre elas. Aplique o schema,
rode a migration, e a partir daí construa o CRUD seguindo os padrões já estabelecidos no
restante do projeto (ver `briefing-continuidade-claude-code.md` para as convenções
gerais).

---

## Decisões de modelagem já tomadas (contexto, não perguntar de novo)

- **Pedido é sempre criado pelo garçom (Usuario)**, nunca pelo Cliente.
- **Estrutura escolhida: Comanda + Item direto**, sem camada intermediária de
  "Pedido"/rodada. Cada `ItemComanda` tem seu próprio status e timestamps.
  *(Evolução futura JÁ REGISTRADA no roadmap do produto — não implementar agora: se um
  dia houver impressão física de comanda ou necessidade de agrupar itens por rodada
  enviada de uma vez, introduzir uma camada `Pedido` entre `Comanda` e `Item`.)*
- **Uma Mesa pode ter múltiplas Comandas abertas simultaneamente** (ex: comanda
  principal + comanda de convidado que paga separado).
- **Preço de cada item congela no momento em que é adicionado** à comanda
  (`precoUnitario` é copiado, não referenciado) — preserva histórico de venda.
- **Destino Cozinha/Bar**: `Categoria.destinoPadrao` define o padrão daquela categoria;
  `Produto.destino` (opcional) sobrescreve pontualmente quando um produto específico
  foge da regra da categoria. `ItemComanda.destino` copia o valor efetivo no momento da
  criação (mesma lógica de "congelar" do preço).
- **`Chamado` usa catálogo configurável** (`TipoChamado`, por empresa — mesmo padrão de
  `TipoAmbiente`), não enum fixo, porque o estabelecimento deve poder criar tipos novos
  (além de "Chamar Garçom"/"Pedir Conta") e ativar/desativar.
- **Notificação em tempo real via WebSocket** (Socket.io) — decisão já tomada, não usar
  polling. Push notification nativo para celular (Firebase/APNs) fica de fora por
  enquanto — funciona por ora com WebSocket + Web Notification API do navegador (útil
  para painel/tablet do garçom logado via web).
- **`ConsumoCliente` é uma feature separada e informal** — o cliente marca no cardápio o
  que consumiu, sem valor fiscal/operacional formal, só para acompanhar seu próprio
  consumo. Configurável por Filial (`exibirConsumoClienteParaGarcom`) se o garçom da área
  pode ou não visualizar essas marcações.
- **Fechamento de Comanda (`status: FECHADA`) hoje só significa "não aceita mais itens
  novos"** — pagamento (forma de pagamento, valor, troco) depende do módulo Financeiro
  (Fase 9, ainda não construído). Não implementar lógica de pagamento agora.
- **Valor total da Comanda é sempre calculado** (soma de `quantidade × precoUnitario`
  dos itens não cancelados) — nunca um campo próprio guardado, para evitar dessincronia
  se um item for cancelado depois.
- **Exatamente um entre `produtoVariacaoPrecoId` e `comboId` deve estar preenchido** em
  `ItemComanda` — o banco não força isso sozinho (sem constraint customizada); validar
  no Service ao criar (XOR: um e apenas um dos dois).

---

## 1. Ajustes em models existentes

### `Categoria` — adicionar campo

```prisma
destinoPadrao DestinoPreparo @default(COZINHA) // Default temporário para categorias já
                                                 // existentes; revisar manualmente após
                                                 // a migration (ex: "Bebidas" deveria
                                                 // provavelmente virar BAR, não COZINHA)
```

### `Produto` — adicionar campo

```prisma
destino DestinoPreparo? // Opcional. Se null, usa o destinoPadrao da Categoria.
                         // Preenchido só quando um produto específico foge da regra
                         // padrão da própria categoria.
```

### `Filial` — adicionar campo

```prisma
exibirConsumoClienteParaGarcom Boolean @default(false)
```

---

## 2. Novos enums

```prisma
enum DestinoPreparo {
  COZINHA
  BAR
}

enum StatusChamado {
  PENDENTE
  EM_ATENDIMENTO
  ATENDIDO
}

enum StatusComanda {
  ABERTA
  FECHADA
  CANCELADA
}

enum StatusItemComanda {
  PENDENTE
  EM_PREPARO
  PRONTO
  ENTREGUE
  CANCELADO
}
```

---

## 3. Novos models

```prisma
model TipoChamado {
  id    String  @id @default(uuid())
  nome  String
  ativo Boolean @default(true)

  empresaId String
  empresa   Empresa @relation(fields: [empresaId], references: [id])

  chamados Chamado[]

  @@unique([empresaId, nome])
  @@index([empresaId])
}

model Chamado {
  id         String        @id @default(uuid())
  status     StatusChamado @default(PENDENTE)
  criadoEm   DateTime      @default(now())
  atendidoEm DateTime?

  tipoChamadoId String
  tipoChamado   TipoChamado @relation(fields: [tipoChamadoId], references: [id])

  mesaId String
  mesa   Mesa @relation(fields: [mesaId], references: [id])

  atendidoPorUsuarioId String?
  atendidoPorUsuario   Usuario? @relation(fields: [atendidoPorUsuarioId], references: [id])

  @@index([mesaId])
}

model Comanda {
  id     String        @id @default(uuid())
  nome   String        @default("Principal")
  status StatusComanda @default(ABERTA)

  abertaEm  DateTime  @default(now())
  fechadaEm DateTime?

  mesaId String
  mesa   Mesa @relation(fields: [mesaId], references: [id])

  abertaPorUsuarioId String
  abertaPorUsuario   Usuario @relation(fields: [abertaPorUsuarioId], references: [id])

  itens ItemComanda[]

  @@index([mesaId])
}

model ItemComanda {
  id            String            @id @default(uuid())
  quantidade    Int               @default(1)
  precoUnitario Float             // CONGELADO no momento da criação — nunca muda depois
  status        StatusItemComanda @default(PENDENTE)
  destino       DestinoPreparo    // copiado do Produto/Categoria no momento da criação

  criadoEm   DateTime  @default(now())
  prontoEm   DateTime?
  entregueEm DateTime?

  comandaId String
  comanda   Comanda @relation(fields: [comandaId], references: [id])

  // EXATAMENTE UM dos dois deve estar preenchido (Produto OU Combo, nunca os dois
  // nem nenhum). Validar no Service — o banco não força isso sozinho.
  produtoVariacaoPrecoId String?
  produtoVariacaoPreco   ProdutoVariacaoPreco? @relation(fields: [produtoVariacaoPrecoId], references: [id])

  comboId String?
  combo   Combo?  @relation(fields: [comboId], references: [id])

  criadoPorUsuarioId String
  criadoPorUsuario   Usuario @relation(fields: [criadoPorUsuarioId], references: [id])

  @@index([comandaId])
}

model ConsumoCliente {
  id         String   @id @default(uuid())
  quantidade Int      @default(1)
  marcadoEm  DateTime @default(now())

  clienteId String
  cliente   Cliente @relation(fields: [clienteId], references: [id])

  produtoId String
  produto   Produto @relation(fields: [produtoId], references: [id])

  mesaId String
  mesa   Mesa @relation(fields: [mesaId], references: [id])

  @@index([clienteId])
  @@index([mesaId])
}
```

---

## 4. Lados inversos a adicionar em models já existentes

| Model | Linha a adicionar dentro do model |
|---|---|
| `Empresa` | `tiposChamado TipoChamado[]` |
| `Mesa` | `comandas Comanda[]`<br>`chamados Chamado[]`<br>`consumosCliente ConsumoCliente[]` |
| `Usuario` | `comandasAbertas Comanda[]`<br>`itensComandaCriados ItemComanda[]`<br>`chamadosAtendidos Chamado[]` |
| `ProdutoVariacaoPreco` | `itensComanda ItemComanda[]` |
| `Combo` | `itensComanda ItemComanda[]` |
| `Produto` | `consumosCliente ConsumoCliente[]` |
| `Cliente` | `consumos ConsumoCliente[]` |

---

## 5. Passos de aplicação

```bash
# depois de editar o schema.prisma com tudo acima:
npx prisma migrate dev --name fase4_comanda_chamado_consumo
npx prisma generate
```

Confirme com `npx prisma migrate status` e `npx tsc --noEmit` antes de prosseguir para
o CRUD.

---

## 6. Depois do schema aplicado — ordem sugerida de implementação

1. `TipoChamado` (catálogo simples, mesmo padrão de `TipoAmbiente`/`Ingrediente`)
2. `Chamado` (CRUD + WebSocket Gateway para notificação em tempo real — esta parte é
   nova no projeto, nunca implementamos WebSocket antes; se houver dúvida de arquitetura
   sobre o Gateway, PARE e pergunte antes de implementar, seguindo o método já
   estabelecido)
3. `Comanda` + `ItemComanda` (o núcleo mais rico desta fase — validação de Produto XOR
   Combo, congelamento de preço/destino, cálculo de total)
4. `ConsumoCliente` (mais simples, junção com um campo extra de quantidade — protegido
   por `ClienteAuthGuard`, não `JwtAuthGuard`)

Pare e pergunte antes de qualquer decisão de arquitetura não coberta explicitamente
neste documento (ex: detalhes de implementação do Gateway WebSocket, estrutura exata das
rotas REST de cada módulo) — mesmo método de trabalho já usado no resto do projeto.
