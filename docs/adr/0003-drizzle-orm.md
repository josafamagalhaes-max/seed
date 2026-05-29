# ADR 0003 — Drizzle ORM para acesso ao banco de dados

**Status:** Accepted

## Contexto

O app `api` precisa de uma camada de acesso ao PostgreSQL (Supabase). As opções avaliadas foram:

- **Prisma** — ORM mais popular no ecossistema Node/TypeScript. Schema declarativo em `.prisma`, cliente fortemente tipado gerado por codegen, migrations automáticas. Porém: cliente gerado é pesado, engine binário separado, execução em edge runtimes problemática, e o modelo de schema em arquivo próprio cria um indirecionamento entre o código TypeScript e a definição das tabelas.
- **Drizzle ORM** — schema definido em TypeScript puro (sem codegen), query builder type-safe que compila para SQL diretamente, sem engine binário, suporte a edge runtimes, migrations geridas pelo `drizzle-kit`.
- **Kysely** — query builder type-safe sem ORM; exige definir tipos de tabela manualmente.
- **SQL puro com `postgres`** — máximo controle, mas sem type-safety nas queries.

## Decisão

Adotar **Drizzle ORM** com o driver `postgres` (node-postgres) para conexão ao Supabase.

Estrutura no `apps/api/src/db/`:
```
db/
  index.ts        # instância do cliente Drizzle
  schema/
    clients.ts    # definição da tabela clients
    index.ts      # barrel export de todos os schemas
```

Migrations geridas pelo `drizzle-kit` com os scripts `db:generate` e `db:push` no `package.json` do app `api`.

## Consequências

**Positivas:**
- Schema como código TypeScript: refatorações no schema refletem imediatamente nos tipos das queries, sem rodar codegen.
- Sem engine binário: deploy mais simples, compatível com edge e serverless.
- SQL transparente: o Drizzle não esconde o SQL gerado, facilitando debugging e otimização de queries.
- Bundle menor que o Prisma Client.

**Negativas / trade-offs:**
- API mais verbosa para relations complexas comparado ao Prisma (`include`/`select` do Prisma são mais ergonômicos).
- Ecossistema menor: menos plugins e integrações prontas que o Prisma.
- `drizzle-kit` para migrations ainda em maturação: algumas features de migration automática são menos robustas que o Prisma Migrate.
