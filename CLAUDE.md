# CLAUDE.md

Este arquivo descreve o projeto e orienta o comportamento do Claude Code neste repositório.

## Projeto

**Nome:** seed  
**Organização:** Nova Era Net  
**Responsável:** Josafá Magalhães (josafa.magalhaes@novaeranet.com.br)

## Stack e Integrações

- **Supabase** — banco de dados PostgreSQL 17, projeto `boxhcdyecsxgfshildyk`, região `us-east-1`
- **Linear** — gerenciamento de tarefas, organização "Marcos Gabriel"
- **Proxy corporativo** — `vader.novaeranet.com.br:3128` (obrigatório para chamadas externas)

## MCPs Configurados

Os servidores MCP estão definidos em `.mcp.json` na raiz:

- `supabase` — acesso direto ao projeto Supabase via `@supabase/mcp-server-supabase`
- `linear` — acesso ao Linear via `mcp-remote` com autenticação por API key

## Diretrizes para o Claude

- Sempre use o MCP do Supabase para operações de banco de dados (consultas, migrações, schema)
- Antes de alterar o schema, use `list_tables` para entender a estrutura existente
- Use o MCP do Linear para criar, listar e atualizar issues e projetos
- Prefira editar arquivos existentes a criar novos
- Não adicione comentários óbvios no código; comente apenas o "porquê" quando não for evidente
- Não crie arquivos de documentação (`.md`) sem solicitação explícita
- Respostas devem ser concisas e diretas

## Estrutura do Projeto

```
.
├── .claude/
│   ├── agents/       # Agentes customizados
│   ├── rules/        # Regras de comportamento
│   ├── skills/       # Skills reutilizáveis
│   ├── settings.json
│   └── settings.local.json
├── .mcp.json
└── CLAUDE.md
```

## Ambiente

- **SO:** Windows 11 Pro
- **Shell padrão:** PowerShell 5.1
- **Node.js** disponível via `npx`
- Variáveis de proxy devem ser definidas via `$env:` no PowerShell
