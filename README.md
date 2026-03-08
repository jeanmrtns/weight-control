# Controle de Peso

Aplicação web para cadastro de pessoas e acompanhamento do peso ao longo do tempo, com dashboards individuais e comparativos.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **shadcn/ui** (Tailwind) + Recharts para gráficos
- **Prisma 7** + PostgreSQL
- **Zod** para validação

## Pré-requisitos

- Node.js 18+
- PostgreSQL rodando (você já tem)
- npm ou pnpm

## Configuração

1. **Clone e instale as dependências:**

```bash
npm install
```

2. **Configure o banco de dados**

Copie o arquivo de exemplo e edite com sua URL do PostgreSQL:

```bash
cp .env.example .env
```

No `.env`, defina `DATABASE_URL` com uma URL no formato:

```
postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
```

Exemplo para um Postgres local:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/weight_control"
```

3. **Crie o banco e rode as migrações**

Crie o banco `weight_control` no PostgreSQL (se ainda não existir) e execute:

```bash
npx prisma migrate dev --name init
```

Isso cria as tabelas `persons` e `weight_entries`.

4. **Inicie a aplicação**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Funcionalidades

- **Pessoas:** cadastro com nome, data de nascimento, altura (cm), gênero e peso meta.
- **Registro de peso:** informar peso e data para qualquer pessoa (com observação opcional).
- **Dashboard individual:** por pessoa, gráfico de evolução do peso, IMC, classificação (OMS), tendência e alertas (ex.: acima da meta).
- **Dashboard comparativo:** escolher várias pessoas e ver gráfico de linhas comparativo + tabela resumo (peso atual, IMC, variação %, tendência).

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção (usa webpack)
- `npm run start` — inicia o servidor de produção após o build

## Estrutura principal

- `src/app` — rotas (páginas e API)
- `src/components` — formulários, gráficos, dashboards, UI
- `src/lib` — `db.ts` (Prisma), `bmi.ts` (IMC e tendência), `utils.ts`
- `prisma/schema.prisma` — modelo de dados

## Observação sobre o build

O build está configurado com `next build --webpack` para evitar problemas de resolução de módulos com o Turbopack. O `DATABASE_URL` no `.env` é carregado em tempo de build; use uma URL válida de PostgreSQL para que a aplicação funcione corretamente.
