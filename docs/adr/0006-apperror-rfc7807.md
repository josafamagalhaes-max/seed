# ADR 0006 — AppError e RFC 7807 para tratamento de erros

**Status:** Accepted

## Contexto

Sem uma convenção de erros, cada endpoint pode retornar formatos diferentes: `{ message: "..." }`, `{ error: "..." }`, arrays de strings, ou objetos arbitrários. Isso dificulta o tratamento de erros no frontend e gera inconsistência na documentação da API.

O **RFC 7807 — Problem Details for HTTP APIs** define um formato padronizado para respostas de erro HTTP:

```json
{
  "type": "https://example.com/probs/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "O campo 'email' é obrigatório.",
  "instance": "/clients"
}
```

As alternativas avaliadas foram:

- **Sem convenção** — cada rota trata erros como quiser; descartado pela inconsistência.
- **Formato próprio ad hoc** — `{ success: false, message: "..." }`; resolve o problema de consistência mas não aproveita padrão de mercado.
- **RFC 7807** — padrão IETF, suportado por ferramentas de API (Postman, OpenAPI), reconhecido por SDKs de cliente.

## Decisão

Adotar a classe **`AppError`** no pacote `@seed/shared` e um **`HttpExceptionFilter`** global no NestJS que serializa qualquer erro no formato RFC 7807.

```typescript
// packages/shared/src/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public readonly title: string,
    public readonly status: number,
    public readonly detail?: string,
    public readonly type?: string,
  ) {
    super(title)
    this.name = 'AppError'
  }
}
```

O `HttpExceptionFilter` no NestJS intercepta:
1. `AppError` — serializa diretamente para RFC 7807.
2. `HttpException` do NestJS (ex: `NotFoundException`, `BadRequestException`) — mapeia para RFC 7807.
3. Erros inesperados — retorna `500` com `type: "about:blank"` sem expor stack trace em produção.

O campo `type` usa a convenção `about:blank` para erros genéricos e URIs descritivas para erros de domínio (ex: `https://seed.app/errors/client-not-found`).

## Consequências

**Positivas:**
- Contrato de erro uniforme: o frontend trata todos os erros pelo mesmo campo `status` + `detail`.
- Erros de validação do `ZodValidationPipe` são serializados com `errors` como campo extra (extensão permitida pelo RFC 7807).
- Documentação OpenAPI gerada pelo `@nestjs/swagger` pode referenciar o schema de Problem Details.
- Erros de domínio são identificáveis pelo campo `type` sem parsear a mensagem.

**Negativas / trade-offs:**
- Desenvolvedores precisam conhecer o RFC 7807 para usar `type` e `instance` corretamente.
- `AppError` no `@seed/shared` cria acoplamento entre o pacote compartilhado e a camada de domínio do backend — erros puramente de frontend não deveriam usar `AppError`.
- Stack traces ocultados em produção dificultam debug sem um sistema de observabilidade (Sentry, etc.) configurado.
