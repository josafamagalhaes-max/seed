# ADR 0005 — Zod em packages/shared para validação compartilhada

**Status:** Accepted

## Contexto

O projeto tem dois apps (`api` e `web`) que precisam validar os mesmos dados: formulários no frontend precisam das mesmas regras de validação que os DTOs do backend. Sem compartilhamento, as regras são duplicadas e podem divergir — um bug clássico onde o frontend aceita um campo que o backend rejeita (ou vice-versa).

As alternativas avaliadas foram:

- **`class-validator` no backend, Yup/Zod no frontend** — cada lado define suas próprias regras; duplicação inevitável.
- **Yup** — popular, mas API menos ergonômica para TypeScript; inferência de tipos mais fraca.
- **Zod** — schema-first, inferência de tipos nativa (`z.infer<typeof schema>`), validação isomórfica (roda em Node e no browser), composição de schemas por `.extend()` e `.merge()`.
- **`class-validator` em tudo** — exclusivo para ambientes com decorators; não funciona no Next.js (ESM, sem `reflect-metadata`).

## Decisão

Adotar **Zod** como biblioteca de validação universal, com schemas definidos no pacote `packages/shared` (`@seed/shared`):

```
packages/shared/
  src/
    schemas/
      client.ts     # clientSchema, createClientSchema, updateClientSchema
      index.ts      # barrel
    types/
      index.ts      # tipos inferidos dos schemas Zod
  package.json      # @seed/shared
  tsconfig.json     # extends @seed/tsconfig/base.json
```

No backend (`apps/api`), o `ValidationPipe` do NestJS usará um `ZodValidationPipe` customizado em vez do `class-validator`, aproveitando diretamente os schemas do `@seed/shared`.

No frontend (`apps/web`), os mesmos schemas serão usados com `react-hook-form` + `@hookform/resolvers/zod`.

## Consequências

**Positivas:**
- Regra de validação definida uma vez, aplicada em dois lugares: mudança no schema reflete automaticamente em API e formulário.
- `z.infer<typeof schema>` gera os tipos TypeScript sem código extra — sem DTOs duplicados.
- Zod roda em qualquer runtime (Node, edge, browser) sem dependências nativas.
- Mensagens de erro centralizadas no schema facilitam i18n futura.

**Negativas / trade-offs:**
- Adiciona dependência ao pacote compartilhado que ambos os apps herdam — bump de versão do Zod afeta os dois apps.
- `ZodValidationPipe` customizado no NestJS é boilerplate inicial, mas encapsula bem a lógica.
- Schemas muito granulares (ex: `createClientSchema` vs `updateClientSchema` como `.partial()`) exigem disciplina para manter a hierarquia organizada.
