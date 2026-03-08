# Plano: Aplicação Web de Controle de Peso

## 1. Visão geral

Aplicação única em **Next.js** (App Router) com **shadcn/ui** para:
- Cadastro de **múltiplas pessoas** com dados relevantes para análise de peso
- **Registro de peso** por data (histórico)
- **Dashboards** de progressão no tempo e indicadores de condição física (ex.: IMC)
- Visualizações **por pessoa** e **comparativo geral**
- Backend com **PostgreSQL**

---

## 2. Stack técnica

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14+ (App Router), React, TypeScript |
| UI | shadcn/ui, Tailwind CSS |
| Gráficos | shadcn Chart (Recharts) |
| Backend/API | Next.js Route Handlers (API Routes) |
| ORM/DB | Prisma + PostgreSQL |
| Validação | Zod |

---

## 3. Modelo de dados (PostgreSQL via Prisma)

### 3.1 Entidades

**Person (Pessoa)**
- `id` (UUID)
- `name` (string) – nome
- `birthDate` (date, opcional) – para cálculo de idade e faixas IMC
- `height` (decimal, cm) – altura para IMC
- `gender` (enum: male | female | other, opcional) – referência para métricas
- `targetWeight` (decimal, opcional) – peso meta
- `createdAt`, `updatedAt`

**WeightEntry (Registro de peso)**
- `id` (UUID)
- `personId` (FK → Person)
- `weight` (decimal, kg)
- `date` (date) – data do registro
- `note` (string, opcional)
- `createdAt`, `updatedAt`

- Índices: `(personId, date)` para consultas de histórico e dashboards.

### 3.2 Regras de negócio sugeridas

- Uma pessoa pode ter vários `WeightEntry`; um registro é por (pessoa, data) – pode permitir um único peso por dia ou múltiplos (definir no produto).
- IMC = peso / (altura/100)²; classificação (abaixo do peso, normal, sobrepeso, obesidade) conforme tabela OMS.
- Evolução: comparação entre primeiro e último registro (ou por período) para “progressão ao longo do tempo”.

---

## 4. Funcionalidades

### 4.1 Pessoas
- Listar pessoas (card ou tabela shadcn).
- Criar pessoa: nome, data nascimento, altura, gênero, peso meta (opcional).
- Editar e excluir pessoa (com cuidado: excluir ou arquivar registros de peso).

### 4.2 Registro de peso
- Formulário: seleção da pessoa, **peso**, **data** (date picker), nota opcional.
- Listagem de registros por pessoa (ordenado por data).
- Editar/remover registro (opcional).

### 4.3 Dashboards

**Dashboard individual (por pessoa)**
- Gráfico de linha: peso x tempo (eixo X = datas, eixo Y = peso).
- Card(s) com: peso atual, peso inicial no período, variação (kg e %), peso meta (se houver).
- Indicadores de condição física:
  - IMC atual e classificação (abaixo do peso / normal / sobrepeso / obesidade I, II, III).
  - Tendência (subindo/estável/descendo) com base nos últimos N registros.
- Opcional: pequeno histórico em tabela abaixo do gráfico.

**Dashboard comparativo (geral)**
- Seleção de uma ou mais pessoas.
- Gráfico de linhas: várias séries (uma por pessoa) – peso x tempo.
- Cards resumidos por pessoa (peso atual, IMC, variação no período).
- Tabela comparativa: pessoa, peso atual, IMC, variação %, tendência.

### 4.4 Alertas / condições físicas
- Exibir no dashboard (individual ou comparativo):
  - Faixa IMC e texto explicativo (ex.: “Sobrepeso – cuidado com calorias”).
  - Se peso atual > peso meta: “Acima da meta em X kg”.
  - Tendência de ganho consistente: aviso simples (ex.: “Peso em alta nos últimos registros”).

---

## 5. Estrutura do projeto (Next.js App Router)

```
weight-control/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Home: atalhos ou lista de pessoas
│   │   ├── globals.css
│   │   ├── api/
│   │   │   ├── people/
│   │   │   │   ├── route.ts            # GET (list), POST (create)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts       # GET, PUT, DELETE
│   │   │   └── weight/
│   │   │       ├── route.ts            # GET (query: personId), POST
│   │   │       └── [id]/
│   │   │           └── route.ts       # PUT, DELETE
│   │   ├── people/
│   │   │   ├── page.tsx                # Lista de pessoas
│   │   │   ├── new/page.tsx           # Nova pessoa
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Detalhe + histórico peso
│   │   │       ├── edit/page.tsx       # Editar pessoa
│   │   │       └── dashboard/page.tsx  # Dashboard individual
│   │   ├── weight/
│   │   │   └── page.tsx                # Adicionar registro (ou modal global)
│   │   └── dashboard/
│   │       └── page.tsx                # Dashboard comparativo
│   ├── components/
│   │   ├── ui/                         # shadcn (button, card, table, dialog, etc.)
│   │   ├── person-form.tsx
│   │   ├── weight-entry-form.tsx
│   │   ├── charts/
│   │   │   ├── weight-line-chart.tsx   # Gráfico peso x tempo (Recharts/shadcn)
│   │   │   └── comparison-chart.tsx    # Múltiplas pessoas
│   │   ├── bmi-badge.tsx               # Exibe IMC e classificação
│   │   └── dashboard/
│   │       ├── individual-dashboard.tsx
│   │       └── comparison-dashboard.tsx
│   └── lib/
│       ├── db.ts                       # Prisma client
│       ├── bmi.ts                      # Cálculo e classificação IMC
│       └── utils.ts
├── components.json                     # shadcn
├── package.json
├── .env.example                        # DATABASE_URL
└── PLANO.md
```

---

## 6. Fluxos principais

1. **Cadastrar pessoa** → People → New → formulário → POST `/api/people`.
2. **Registrar peso** → Weight (ou modal na listagem de pessoas) → escolher pessoa, data, peso → POST `/api/weight`.
3. **Ver evolução** → People → [pessoa] → Dashboard → gráfico + IMC + alertas.
4. **Comparar** → Dashboard (geral) → selecionar pessoas → gráfico comparativo + tabela.

---

## 7. UI com shadcn

- **Componentes a usar**: Button, Card, Input, Label, Select, Table, Dialog, Tabs, Badge, Calendar (date picker), Chart (shadcn chart com Recharts).
- **Tema**: usar variáveis CSS do shadcn (modo claro/escuro opcional).
- **Layout**: sidebar ou top nav para: Home, Pessoas, Adicionar Peso, Dashboard Comparativo; dentro de Pessoa: detalhe, editar, dashboard individual.

---

## 8. APIs sugeridas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/people` | Lista pessoas |
| POST | `/api/people` | Cria pessoa |
| GET | `/api/people/[id]` | Detalhe + últimos weight entries |
| PUT | `/api/people/[id]` | Atualiza pessoa |
| DELETE | `/api/people/[id]` | Remove pessoa (e registros ou soft delete) |
| GET | `/api/weight?personId=&from=&to=` | Lista registros (filtros opcionais) |
| POST | `/api/weight` | Cria registro (personId, weight, date, note) |
| PUT | `/api/weight/[id]` | Atualiza registro |
| DELETE | `/api/weight/[id]` | Remove registro |

---

## 9. Ordem de implementação sugerida

1. **Projeto base**: Next.js, TypeScript, Tailwind, shadcn init, Prisma + PostgreSQL (schema, migrate).
2. **CRUD pessoas**: schema Person, API, páginas list/new/edit e formulário.
3. **CRUD peso**: schema WeightEntry, API, formulário de registro (com data) e listagem por pessoa.
4. **Lib IMC**: função de cálculo e classificação (faixas OMS).
5. **Dashboard individual**: página, gráfico de linha (peso x data), cards de resumo, IMC e alertas.
6. **Dashboard comparativo**: seleção de pessoas, gráfico multi-série, tabela comparativa.
7. **Refino**: validação (Zod), tratamento de erros, loading states, responsividade.

---

## 10. Considerações finais

- **Data**: sempre enviar e armazenar em UTC ou apenas “date” (sem hora) para evitar problemas de fuso.
- **Unidades**: definir padrão (kg, cm) e exibir de forma consistente.
- **Privacidade**: se no futuro houver usuários, considerar autenticação e escopo por usuário (cada um vê só suas pessoas/registros).

Este plano permite implementar a aplicação de forma incremental, com Next.js, shadcn e PostgreSQL, atendendo a cadastro de múltiplas pessoas, registro de peso com data, dashboards individual e comparativo e indicadores de condição física (IMC e tendência).
