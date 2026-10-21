# Food Delivery — Frontend

Painel React + TypeScript para consumir a API REST em `food-delivery-api`.

## Requisitos

- Node.js 20.19+ ou 22.12+ e npm.
- Backend iniciado em `http://localhost:8080`.

## Desenvolvimento

```bash
npm install
cp .env.example .env
npm run dev
```

O Vite fica disponível em `http://localhost:5173`. Por padrão, `VITE_API_URL=/api` direciona `/api/*` para `http://localhost:8080/*` pelo proxy de desenvolvimento. Para outro endereço, altere `VITE_API_URL` no `.env` local.

## Verificação

```bash
npm run build
npm run lint
npm test
```

## Contrato consumido

- Cadastro: `POST /auth/register`, com `name`, `email` e `password`.
- Login: `POST /auth/login`, com `email` e `password`; o JWT retornado fica em `sessionStorage`.
- Pedidos: `GET /orders`, `GET /orders/{id}`, `POST /orders` e `PATCH /orders/{id}/status`.
- O token é enviado como `Authorization: Bearer <token>`. Uma resposta `401` remove a sessão e as páginas protegidas redirecionam para login.
- O payload de criação contém `address` e `items`; o backend associa o cliente a partir do token.
- A lista segue o comportamento atual do backend, que retorna todos os pedidos a usuários autenticados.

O endpoint de cadastro responde com a entidade `User`, cujo modelo atual inclui a propriedade `password`. A interface ignora a resposta e não a armazena; recomenda-se alterar o backend para responder com um DTO público sem senha.

## Organização do código

- `src/app`: composição, rotas e provider de autenticação.
- `src/features/auth`: páginas, formulário, hook e service de autenticação.
- `src/features/orders`: páginas, formulário, lista, status, hooks e service de pedidos.
- `src/lib/api.ts`: cliente HTTP, token e erros da API.
- `src/types/api.ts`: contratos TypeScript usados pelo cliente.
- `src/components/layout`: estrutura visual compartilhada.
- `src/utils`: apresentação comum de erros da API.
