# ADR 0002 — NestJS como framework do backend

**Status:** Accepted

## Contexto

O app `api` precisa de um framework Node.js para expor endpoints REST, gerenciar injeção de dependências, validação de entrada e ciclo de vida da aplicação. As alternativas avaliadas foram:

- **Express puro** — mínimo e flexível, mas exige montar toda a estrutura manualmente (DI, validação, erros, módulos).
- **Fastify** — mais rápido que Express, mas igualmente sem convenções fortes; estrutura fica a cargo do time.
- **NestJS** — opinionado, baseado em decorators e módulos, com DI nativa, integração direta com `class-validator`/`class-transformer` e ecossistema maduro (Guards, Interceptors, Pipes, Filters).
- **Hono** — leve e edge-ready, mas sem DI nativa e ecossistema menor para projetos enterprise.

## Decisão

Adotar **NestJS** (TypeScript, modo CommonJS) como framework do app `api`.

O projeto utilizará:
- Módulos por domínio (`HelloModule`, `ClientsModule`, etc.)
- `ValidationPipe` global com `class-validator`
- `ExceptionFilter` global para padronização de erros (RFC 7807 — ver ADR 0006)
- Configuração via `@nestjs/config` com validação de schema no bootstrap

## Consequências

**Positivas:**
- Estrutura previsível: novos devs encontram rapidamente onde cada peça vive.
- DI nativa elimina a necessidade de bibliotecas externas de container.
- `class-validator` + `ValidationPipe` reduzem código boilerplate de validação de entrada.
- Ecossistema rico: `@nestjs/swagger`, `@nestjs/throttler`, `@nestjs/schedule` disponíveis sem atrito.

**Negativas / trade-offs:**
- Overhead de bundle maior comparado a Express/Fastify para endpoints simples.
- Uso de decorators exige `experimentalDecorators: true` e `emitDecoratorMetadata: true` no tsconfig — incompatível com `"type": "module"` no `package.json` raiz (resolvido no ADR 0001 removendo `"type": "module"` da raiz).
- Curva de aprendizado para desenvolvedores vindos de frameworks sem DI.
