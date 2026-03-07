# Order API

API de gerenciamento de pedidos feita em Node.js puro — sem framework, sem magic, só o que precisa.

## Stack

- Node.js (http nativo)
- PostgreSQL
- JWT para autenticação
- Swagger UI para documentação
- Docker para o banco

## Rodando o projeto

Sobe o banco:
```bash
docker compose up -d
```

Instala as dependências:
```bash
npm install
```

Configura as variáveis de ambiente:
```bash
cp .env.example .env
```

Inicia a API:
```bash
npm run dev
```

Acessa a documentação em `http://localhost:3000/docs`

## Autenticação

Todas as rotas do `/order` são protegidas. Antes de qualquer coisa, faz o login:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Usa o token retornado no header `Authorization: Bearer <token>` nas próximas requisições.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/login | Autenticação |
| POST | /order | Criar pedido |
| GET | /order/list | Listar pedidos |
| GET | /order/:orderId | Buscar pedido |
| PUT | /order/:orderId | Atualizar pedido |
| DELETE | /order/:orderId | Deletar pedido |

## Criando um pedido

```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }'
```

O campo `numeroPedido` é opcional — se não vier, a API gera um ID automaticamente.

Os campos do body são mapeados antes de salvar no banco:

| Recebido | Salvo no banco |
|----------|----------------|
| numeroPedido | orderId |
| valorTotal | value |
| dataCriacao | creationDate |
| idItem | productId |
| quantidadeItem | quantity |
| valorItem | price |

## Estrutura do projeto

```
src/
├── index.js
├── router.js
├── swagger.json
├── db/
│   └── connection.js
├── helpers/
│   ├── asyncHandler.js
│   ├── getBody.js
│   ├── serveSwagger.js
│   └── verifyToken.js
└── controllers/
    ├── login.js
    ├── createOrder.js
    ├── getOrder.js
    ├── listOrders.js
    ├── updateOrder.js
    └── deleteOrder.js
```

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| DB_HOST | Host do banco |
| DB_PORT | Porta do banco |
| DB_USER | Usuário do banco |
| DB_PASSWORD | Senha do banco |
| DB_NAME | Nome do banco |
| PORT | Porta da API (default 3000) |
| API_USER | Usuário para login |
| API_PASSWORD | Senha para login |
| JWT_SECRET | Chave secreta do JWT |
| JWT_EXPIRES_IN | Expiração do token (ex: 1h) |