# Freela-CashFlow

Freela-CashFlow é uma aplicação full stack de controle financeiro mensal para freelancers, autônomos, estudantes que fazem trabalhos extras e pessoas com renda variável.

O objetivo do produto é responder, com clareza, perguntas comuns de quem não tem renda fixa:

- quanto está previsto para entrar no mês;
- quanto já foi recebido;
- quanto está previsto em despesas;
- quanto já foi pago;
- quais despesas ainda estão pendentes ou vencidas;
- qual é o saldo previsto;
- qual é o saldo real;
- qual percentual da renda já está comprometido.

O projeto contém uma API REST em Java/Spring Boot com MongoDB e um frontend em React/TypeScript consumindo dados reais da API.

## Status do Projeto

MVP finalizado.

Implementado no backend:

- Autenticação com cadastro, login e JWT.
- Isolamento de dados por usuário autenticado.
- CRUD de categorias.
- CRUD de receitas.
- CRUD de despesas.
- Marcação de receita como recebida.
- Marcação de despesa como paga.
- Filtros por mês e ano.
- Resumo financeiro mensal.
- Seed automático de dados reais de desenvolvimento com profile `dev`.
- Docker Compose com API + MongoDB.
- Dockerfile da aplicação.
- Swagger/OpenAPI.
- Testes unitários.

Implementado no frontend:

- Login e cadastro consumindo a API real.
- Armazenamento simples do JWT para desenvolvimento.
- Dashboard mensal autenticado.
- Filtro por mês e ano.
- Cards de resumo financeiro.
- Indicador de renda comprometida.
- Timeline de fluxo do mês.
- Lista de movimentações reais do mês.
- Tela de receitas.
- Tela de despesas.
- Tela de categorias.
- Tela de análises com gráficos simples baseados nos dados reais.
- Formulários para criar receita, despesa e categoria.
- Ação para resolver pendências marcando despesas como pagas.
- Tema claro/escuro.
- Sidebar colapsada com expansão no hover.
- Interface SaaS clean inspirada em Notion/Linear.

## Stack

Backend:

- Java 17
- Spring Boot 3.5.x
- Spring Web
- Spring Security
- Spring Data MongoDB
- Bean Validation
- JWT com `java-jwt`
- Springdoc OpenAPI
- JUnit 5
- Mockito
- Docker
- MongoDB 7

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- clsx
- tailwind-merge

## Estrutura do Projeto

```text
.
|-- src/                         Backend Spring Boot
|-- frontend/                    Frontend React/Vite
|-- docs/                        Documentos de planejamento
|-- docker-compose.yml
|-- Dockerfile
|-- pom.xml
`-- README.md
```

Arquitetura do backend:

```text
src/main/java/com/nicholas/freelacashflow
|
|-- auth
|-- category
|-- income
|-- expense
|-- summary
|-- config
|   `-- seed
|-- exception
|-- security
`-- user
```

Fluxo principal:

```text
Controller -> Service -> Repository -> MongoDB
```

Arquitetura do frontend:

```text
frontend/src
|
|-- components
|   |-- auth
|   |-- dashboard
|   `-- ui
|-- hooks
|-- lib
|-- pages
|-- services
`-- types
```

## Requisitos

- Java 17+
- Node.js 20+
- Docker Desktop
- Maven Wrapper incluso no projeto

## Rodando com Docker

Suba API + MongoDB:

```bash
docker compose up --build
```

A API ficará disponível em:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

## Rodando em Desenvolvimento

### 1. Subir MongoDB

```bash
docker compose up -d mongodb
```

### 2. Rodar backend

Linux/macOS:

```bash
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
$env:SPRING_PROFILES_ACTIVE="dev"
.\mvnw.cmd spring-boot:run
```

O profile `dev` ativa o seed de dados de desenvolvimento.

### 3. Rodar frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Variáveis de Ambiente

Backend:

| Variável | Padrão | Descrição |
|---|---|---|
| `SPRING_DATA_MONGODB_URI` | `mongodb://localhost:27017/freela_cashflow` | URI do MongoDB |
| `SERVER_PORT` | `8080` | Porta HTTP da API |
| `SPRING_PROFILES_ACTIVE` | vazio | Use `dev` para ativar o seed |
| `SECURITY_JWT_SECRET` | `freela-cashflow-development-secret-change-me` | Chave usada para assinar JWT |
| `SECURITY_JWT_ISSUER` | `freela-cashflow` | Issuer do token |
| `SECURITY_JWT_EXPIRATION_SECONDS` | `86400` | Expiração do token em segundos |

Frontend:

| Variável | Exemplo | Descrição |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | URL base da API |

Arquivo:

```text
frontend/.env
```

Exemplo:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Usuário de Desenvolvimento

Com o backend rodando em profile `dev`, o seed cria o usuário:

```text
Nome: Nicholas Silva
E-mail: nicholas.dev@freelacashflow.com
Senha: 123456
```

A senha é salva usando o mesmo `PasswordEncoder` da autenticação real.

## Seed de Desenvolvimento

Classe:

```text
src/main/java/com/nicholas/freelacashflow/config/seed/DevDataSeeder.java
```

Comportamento:

- roda apenas com `@Profile("dev")`;
- cria ou atualiza o usuário de desenvolvimento;
- remove categorias, receitas e despesas desse usuário;
- recria uma base limpa para testes;
- não roda em produção.

Dados criados:

- Categorias: Equipamentos, Internet, Alimentação, Transporte, Educação, Ferramentas, Assinaturas, Moradia, Saúde e Outros.
- Receitas do mês atual com status `RECEIVED` e `EXPECTED`.
- Receitas do mês anterior com status `RECEIVED`.
- Despesas do mês atual com status `PAID`, `PENDING` e `OVERDUE`.
- Despesas do mês anterior com status `PAID`.

## Funcionalidades do Frontend

### Autenticação

- Tela de login.
- Tela de cadastro.
- Armazenamento do JWT para desenvolvimento.
- Envio automático do header:

```http
Authorization: Bearer {token}
```

### Dashboard

O dashboard consome:

- `GET /api/monthly-summary?month={month}&year={year}`
- `GET /api/incomes?month={month}&year={year}`
- `GET /api/expenses?month={month}&year={year}`
- `GET /api/categories`

Recursos:

- resumo financeiro mensal;
- filtro por mês/ano;
- cards de receita, despesas e saldos;
- indicador de renda comprometida;
- alerta de pendências;
- resolução de pendências por despesa;
- timeline de fluxo do mês;
- lista de movimentações.

### Pendências

O botão `Resolver pendências` exibe despesas `PENDING` e `OVERDUE`.

Cada item pode ser marcado como pago com uma data de pagamento. A ação chama:

```http
PATCH /api/expenses/{expenseId}/pay
```

Payload:

```json
{
  "paidDate": "2026-05-27"
}
```

### Telas

- Resumo
- Análises
- Receitas
- Despesas
- Categorias

### Análises

A tela de análises mostra gráficos simples com:

- receita recebida;
- despesas pagas;
- saldo real;
- receitas previstas;
- receitas recebidas;
- despesas pendentes;
- despesas vencidas;
- despesas agrupadas por categoria.

## Endpoints Principais

### Autenticação

```http
POST /api/auth/register
POST /api/auth/login
```

Cadastro:

```json
{
  "name": "Nicholas Silva",
  "email": "nicholas@email.com",
  "password": "123456"
}
```

Login:

```json
{
  "email": "nicholas@email.com",
  "password": "123456"
}
```

Resposta:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "user_id",
    "name": "Nicholas Silva",
    "email": "nicholas@email.com"
  }
}
```

### Categorias

```http
POST   /api/categories
GET    /api/categories
GET    /api/categories/{categoryId}
PUT    /api/categories/{categoryId}
DELETE /api/categories/{categoryId}
```

Payload:

```json
{
  "name": "Equipamentos",
  "description": "Gastos com computador, periféricos e ferramentas"
}
```

### Receitas

```http
POST   /api/incomes
GET    /api/incomes
GET    /api/incomes?month=5&year=2026
GET    /api/incomes/{incomeId}
PUT    /api/incomes/{incomeId}
DELETE /api/incomes/{incomeId}
PATCH  /api/incomes/{incomeId}/receive
```

Criar receita:

```json
{
  "description": "Parcela 1 do projeto landing page",
  "amount": 1500.00,
  "expectedDate": "2026-05-05",
  "source": "Cliente Landing Page"
}
```

Marcar como recebida:

```json
{
  "receivedDate": "2026-05-05"
}
```

### Despesas

```http
POST   /api/expenses
GET    /api/expenses
GET    /api/expenses?month=5&year=2026
GET    /api/expenses/{expenseId}
PUT    /api/expenses/{expenseId}
DELETE /api/expenses/{expenseId}
PATCH  /api/expenses/{expenseId}/pay
```

Criar despesa:

```json
{
  "categoryId": "category_id",
  "description": "Parcela do notebook",
  "amount": 1000.00,
  "dueDate": "2026-05-08",
  "fixed": true
}
```

Marcar como paga:

```json
{
  "paidDate": "2026-05-08"
}
```

### Resumo Mensal

```http
GET /api/monthly-summary?month=5&year=2026
```

Resposta:

```json
{
  "month": 5,
  "year": 2026,
  "expectedIncome": 3950.00,
  "receivedIncome": 1850.00,
  "expectedExpenses": 1499.70,
  "paidExpenses": 1139.90,
  "pendingExpenses": 359.80,
  "expectedBalance": 2450.30,
  "realBalance": 710.10,
  "committedIncomePercentage": 37.97
}
```

## Regras de Negócio

- Receita não pode ter valor menor ou igual a zero.
- Despesa não pode ter valor menor ou igual a zero.
- Receita `RECEIVED` exige `receivedDate`.
- Receita `EXPECTED` não deve ter `receivedDate`.
- Despesa `PAID` exige `paidDate`.
- Despesa `PENDING` não deve ter `paidDate`.
- Despesa `OVERDUE` não deve ter `paidDate`.
- Dados financeiros são sempre isolados por usuário.
- Categoria usada em despesa precisa pertencer ao usuário autenticado.
- Despesa pendente com vencimento anterior à data atual aparece como `OVERDUE` na resposta.
- Resumo mensal é calculado dinamicamente.

Fórmulas:

```text
Saldo previsto = receitas previstas - despesas previstas
Saldo real = receitas recebidas - despesas pagas
Percentual comprometido = despesas previstas / receitas previstas * 100
```

## Collections MongoDB

```text
users
categories
incomes
expenses
```

O resumo mensal não possui collection própria. Ele é calculado a partir de `incomes` e `expenses`.

## Testes

Backend:

```bash
./mvnw test
```

Windows PowerShell:

```powershell
.\mvnw.cmd test
```

Frontend:

```bash
cd frontend
npm run build
```

Cobertura do backend:

- `CategoryService`
- `IncomeService`
- `ExpenseService`
- `MonthlySummaryService`
- carga de contexto Spring

Os testes de controller com Testcontainers foram removidos para manter o ciclo local de testes mais simples e rápido.

## Build

Backend:

```bash
./mvnw clean package
```

Frontend:

```bash
cd frontend
npm run build
```

Docker:

```bash
docker build -t freela-cashflow-api:local .
```

## Documentação Complementar

- `docs/freela-cashflow-brd.md`
- `docs/freela-cashflow-planejamento.md`
