# ADR 0001 — Estrutura de monorepo com Turborepo e pnpm workspaces

**Status:** Accepted

## Contexto

O projeto precisa abrigar pelo menos dois apps (`api` e `web`) que compartilham tipos, configurações e utilitários. Manter dois repositórios separados implica sincronização manual de versões e duplicação de configuração (TypeScript, ESLint, variáveis de ambiente). Uma estrutura monorepo resolve esses problemas, mas exige uma ferramenta de orquestração de builds.

As alternativas consideradas foram:
- **Nx** — poderoso, mas com curva de acentuada e opinionado na geração de código.
- **Lerna** — legado, hoje delega a execução ao npm/pnpm workspaces sem diferencial real.
- **Turborepo** — focado em cache e pipeline de tasks, sem geração de código forçada, adoção simples sobre pnpm workspaces existentes.

## Decisão

Adotar **Turborepo** como orquestrador de tasks sobre **pnpm workspaces**, com a seguinte estrutura de diretórios:

```
apps/
  api/      # backend NestJS
  web/      # frontend Next.js
packages/
  tsconfig/ # @seed/tsconfig — configs TypeScript compartilhadas
  eslint-config/ # @seed/eslint-config — regras ESLint compartilhadas
  shared/   # @seed/shared — tipos, schemas Zod e utilitários comuns
```

O `turbo.json` na raiz define pipelines para `build`, `dev`, `lint` e `test` com cache baseado em hash de entradas.

## Consequências

**Positivas:**
- Cache inteligente: rebuilds incrementais reduzem tempo de CI e desenvolvimento local.
- `pnpm dev` na raiz sobe todos os apps em paralelo com um único comando.
- Pacotes internos (`@seed/*`) compartilhados sem publicação no registry.
- Configurações de TypeScript e ESLint centralizadas e reutilizadas por extensão.

**Negativas / trade-offs:**
- Desenvolvedores precisam entender o conceito de workspaces para adicionar dependências corretamente (`pnpm add -w` vs `pnpm add --filter`).
- O cache do Turbo pode esconder problemas de build se as saídas (`outputs`) não forem declaradas corretamente no `turbo.json`.
