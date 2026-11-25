# Backend — Gestão Financeira

API REST em Node.js + Express + Mongoose (MongoDB Atlas), em TypeScript executado nativamente pelo Node.

## Como rodar

Requer Node 26+.

```bash
npm install
cp .env.example .env   # preencher MONGO_URI com a string do Atlas
npm run dev            # http://localhost:8000
```

A `MONGO_URI` precisa terminar com o nome do banco (`.../financeiro`); sem ele, o Mongoose grava no banco `test`.
Banco e coleções são criados automaticamente na primeira escrita.

`npm run typecheck` verifica os tipos.

## Estrutura (MVC)

```
server.ts      app, CORS, JSON, rotas, tratamento de erros, conexão
config/        conexão com o MongoDB
models/        schemas Mongoose (formato e validação dos dados)
controllers/   lógica de cada rota
routes/        mapeamento URL → controller
```

## Contrato

Base: `http://localhost:8000/api`

### Movimentações

```ts
{ _id: string, nome: string, valor: number, tipo: 'receita' | 'despesa', categoria: string | null }
```

- `valor` sempre positivo (mínimo `0.01`); o `tipo` define se entra ou sai.
- `categoria` é o **nome** de uma categoria (ou `null` para "sem tag").

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| GET | `/movimentacoes` | lista, mais recentes primeiro | `200` |
| GET | `/movimentacoes/kpis` | totais gerais `{ entradas, saidas, saldo }` | `200` |
| POST | `/movimentacoes` | cria `{ nome, valor, tipo, categoria? }` | `201` + objeto criado |
| DELETE | `/movimentacoes/:id` | exclui | `204` |

Filtros do GET (query string, opcionais, combináveis):

| Param | Regra |
|---|---|
| `tipo` | igual a `receita` ou `despesa` |
| `categoria` | igual ao nome da categoria |
| `nome` | contém o texto, sem diferenciar maiúsculas |

Exemplo: `GET /api/movimentacoes?tipo=despesa&nome=merc`

### Categorias (tags)

```ts
{ _id: string, nome: string, cor: string }   // cor no formato #RRGGBB
```

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| GET | `/categorias` | lista em ordem alfabética | `200` |
| POST | `/categorias` | cria `{ nome, cor }` | `201` + objeto criado |

Categorias não são editadas nem excluídas. O nome é único.

### Erros

Corpo sempre `{ erro: string }`.

| Status | Quando |
|---|---|
| `400` | campo obrigatório ausente, valor inválido, id malformado ou JSON inválido |
| `404` | movimentação não encontrada no DELETE |
| `409` | categoria com nome já existente |
| `500` | erro inesperado no servidor |

## Mudanças em relação ao contrato inicial (front)

- Não há filtro por `valor`.
- `categoria` da movimentação é opcional e guarda o nome da tag; a cor vem de `GET /categorias`.
- Novas rotas `GET` e `POST /categorias`.
