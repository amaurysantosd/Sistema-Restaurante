# Sistema Restaurante

## Ambiente

Este ambiente não suporta TTY interativo. Nunca use `npx prisma migrate dev`.
Para novas migrations, use o fluxo não-interativo:
- `npx prisma migrate diff --from-config-datasource ./prisma.config.ts --to-schema ./prisma/schema.prisma --script > prisma/migrations/<timestamp>_<nome>/migration.sql` para gerar o SQL
- `npx prisma migrate deploy` para aplicar
