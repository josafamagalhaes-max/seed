# ADR 0004 — Supabase como banco de dados gerenciado

**Status:** Accepted

## Contexto

O projeto precisa de um banco PostgreSQL disponível para desenvolvimento e produção. As alternativas avaliadas foram:

- **PostgreSQL self-hosted** — máximo controle, mas exige provisionamento, backups, monitoramento e manutenção de infraestrutura.
- **AWS RDS / Aurora** — serviço gerenciado robusto, mas custo e complexidade de configuração elevados para um projeto em fase inicial.
- **PlanetScale** — MySQL serverless, incompatível com a decisão de usar PostgreSQL e Drizzle com tipos UUID e `gen_random_uuid()`.
- **Neon** — PostgreSQL serverless com branching por PR; boa opção, mas sem o conjunto de ferramentas integradas do Supabase.
- **Supabase** — PostgreSQL gerenciado com dashboard, autenticação, storage e APIs REST/Realtime geradas automaticamente. Plano gratuito generoso para desenvolvimento.

## Decisão

Adotar **Supabase** como banco de dados gerenciado.

Configurações relevantes:
- Projeto: `boxhcdyecsxgfshildyk`, região `us-east-1`
- Conexão via `DATABASE_URL` (connection string pooler do Supabase) no `apps/api/.env`
- Migrations aplicadas pelo `drizzle-kit push` (desenvolvimento) e `drizzle-kit migrate` (produção)
- SSL obrigatório na conexão de produção

O acesso via MCP (`@supabase/mcp-server-supabase`) está configurado em `.mcp.json` para uso com Claude Code.

## Consequências

**Positivas:**
- Zero manutenção de infraestrutura: backups automáticos, alta disponibilidade e atualizações gerenciadas.
- Dashboard com Table Editor, SQL Editor e logs integrados — agiliza inspeção e debug.
- Extensões PostgreSQL disponíveis (`uuid-ossp`, `pg_cron`, `pgvector`) sem configuração adicional.
- MCP integrado permite ao Claude Code inspecionar e modificar o banco diretamente via ferramentas.

**Negativas / trade-offs:**
- Vendor lock-in suave: `gen_random_uuid()` e outras funções do Supabase são padrão PostgreSQL, mas o dashboard e as APIs REST são proprietários.
- Latência adicional em ambientes sem proxy (resolvido com o proxy corporativo `vader.novaeranet.com.br:3128`).
- Plano gratuito pausa o projeto após 7 dias de inatividade — monitorar em produção.
