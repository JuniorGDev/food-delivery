# Food Delivery

Aplicação de gerenciamento de pedidos para um sistema de Food Delivery, desenvolvida com **Java + Spring Boot** no backend e **React + TypeScript** no frontend.

O projeto possui autenticação de usuários e permite criar, consultar e atualizar pedidos.

## Tecnologias

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- SQLite
- Maven
- Swagger / OpenAPI

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router

## Funcionalidades

### Autenticação

- Cadastro de usuário
- Login com e-mail e senha
- Autenticação utilizando token
- Rotas protegidas para usuários autenticados

### Pedidos

- Criar um pedido
- Informar cliente, itens e endereço de entrega
- Listar pedidos
- Consultar pedido por ID
- Atualizar o status do pedido

Os pedidos possuem os seguintes status:

```text
RECEBIDO
EM_PREPARO
SAIU_PARA_ENTREGA
ENTREGUE
CANCELADO
```

Também existem regras para controlar a alteração dos status dos pedidos.

## Estrutura do projeto

O projeto está dividido em duas partes:

```text
food-delivery/
├── backend/
└── frontend/
```

### Backend

API REST desenvolvida em Java com Spring Boot.

A aplicação segue uma separação entre domínio, aplicação e infraestrutura, mantendo as responsabilidades organizadas.

Principais responsabilidades:

```text
Controller
    ↓
Service / Use Case
    ↓
Domain
    ↓
Repository
    ↓
Database
```

O backend também possui tratamento de exceções e documentação dos endpoints através do Swagger.

### Frontend

Aplicação web desenvolvida em React e TypeScript.

A estrutura do frontend foi organizada por responsabilidades, separando páginas, componentes, serviços, hooks, tipos e autenticação.

A comunicação com o backend é feita através de uma camada de API utilizando Axios.

## Como executar

### Backend

Entre na pasta do backend:

```bash
cd backend
```

Execute:

```bash
./mvnw spring-boot:run
```

No Windows:

```bash
mvnw.cmd spring-boot:run
```

A API será executada por padrão em:

```text
http://localhost:8080
```

### Swagger

Após iniciar o backend, a documentação da API pode ser acessada pelo Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

O Swagger pode ser utilizado para testar os endpoints da API, incluindo os endpoints protegidos por autenticação.

### Frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm run dev
```

O frontend será disponibilizado pelo Vite no endereço apresentado no terminal, normalmente:

```text
http://localhost:5173
```

## Fluxo da aplicação

O fluxo principal da aplicação é:

```text
Cadastro
   ↓
Login
   ↓
Autenticação
   ↓
Acesso aos pedidos
   ↓
Criar / consultar pedidos
   ↓
Atualizar status
```

Para acessar as funcionalidades de pedidos, o usuário precisa estar autenticado.

## Banco de dados

O projeto utiliza **SQLite** para persistência dos dados.

O SQLite é um banco de dados relacional que funciona como um arquivo local, não sendo necessário configurar um servidor de banco separado para executar o projeto.

## API

Principais endpoints:

### Autenticação

```text
POST /auth/register
POST /auth/login
```

### Pedidos

```text
POST   /orders
GET    /orders
GET    /orders/{id}
PATCH  /orders/{id}/status
```

Os endpoints de pedidos exigem autenticação.

## Objetivo

O projeto foi desenvolvido como um desafio técnico, com foco em:

- desenvolvimento de uma API REST;
- autenticação;
- persistência de dados;
- organização de código;
- regras de negócio;
- integração entre frontend e backend;
- utilização de boas práticas de desenvolvimento.