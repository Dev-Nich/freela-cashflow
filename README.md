# Freela-CashFlow

API REST para freelancers e profissionais autonomos controlarem receitas, despesas e fluxo de caixa mensal.

O projeto resolve um problema comum de quem recebe renda variavel: saber quanto esta previsto para entrar, quanto ja foi recebido, quanto esta comprometido com despesas e qual sera o saldo real e previsto do mes.

## Status

MVP backend em desenvolvimento avancado.

Implementado:

- Autenticacao com cadastro, login e JWT.
- Isolamento de dados por usuario autenticado.
- CRUD de categorias.
- CRUD de receitas.
- CRUD de despesas.
- Marcacao de receita como recebida.
- Marcacao de despesa como paga.
- Filtros por mes e ano.
- Resumo financeiro mensal.
- MongoDB via Docker Compose.
- Dockerfile da aplicacao.
- Testes unitarios de services principais.
- Swagger/OpenAPI via Springdoc.

## Stack

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

## Arquitetura

O projeto usa uma arquitetura em camadas organizada por feature.

```text
src/main/java/com/nicholas/freelacashflow
|
|-- auth
|   |-- controller
|   |-- dto
|   |-- exception
|   `-- service
|
|-- category
|   |-- controller
|   |-- document
|   |-- dto
|   |-- exception
|   |-- repository
|   `-- service
|
|-- income
|   |-- controller
|   |-- document
|   |-- dto
|   |-- enums
|   |-- exception
|   |-- repository
|   `-- service
|
|-- expense
|   |-- controller
|   |-- document
|   |-- dto
|   |-- enums
|   |-- exception
|   |-- repository
|   `-- service
|
|-- summary
|   |-- controller
|   |-- dto
|   `-- service
|
|-- config
|-- exception
|-- security
`-- user
    |-- document
    |-- dto
    `-- repository
```

Fluxo principal:

```text
Controller -> Service -> Repository -> MongoDB
```

Responsabilidades:

- `controller`: entrada HTTP e contratos REST.
- `service`: regras de negocio e isolamento por usuario.
- `repository`: acesso ao MongoDB via Spring Data.
- `document`: modelo persistido em collections MongoDB.
- `dto`: payloads de entrada e saida da API.
- `security`: JWT, usuario autenticado e filtro de seguranca.
- `exception`: tratamento padronizado de erros.

## Requisitos

- Java 17+
- Docker Desktop
- Maven Wrapper incluso no projeto

## Rodando localmente

Suba o MongoDB:

```bash
docker compose up -d
```

Rode a API:

```bash
./mvnw spring-boot:run
```

No Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

A API ficara disponivel em:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

## Variaveis de ambiente

A aplicacao possui valores padrao para ambiente local, mas pode ser configurada por variaveis:

| Variavel | Padrao | Descricao |
|---|---|---|
| `SPRING_DATA_MONGODB_URI` | `mongodb://localhost:27017/freela_cashflow` | URI do MongoDB |
| `SERVER_PORT` | `8080` | Porta HTTP da API |
| `SECURITY_JWT_SECRET` | `freela-cashflow-development-secret-change-me` | Chave usada para assinar JWT |
| `SECURITY_JWT_ISSUER` | `freela-cashflow` | Issuer do token |
| `SECURITY_JWT_EXPIRATION_SECONDS` | `86400` | Expiracao do token em segundos |

Para producao, troque obrigatoriamente `SECURITY_JWT_SECRET`.

## Docker

Build da imagem:

```bash
docker build -t freela-cashflow-api:local .
```

Rodando a API em container apontando para o Mongo local do host:

```bash
docker run --rm -p 8080:8080 \
  -e SPRING_DATA_MONGODB_URI=mongodb://host.docker.internal:27017/freela_cashflow \
  -e SECURITY_JWT_SECRET=change-this-secret \
  freela-cashflow-api:local
```

No PowerShell:

```powershell
docker run --rm -p 8080:8080 `
  -e SPRING_DATA_MONGODB_URI=mongodb://host.docker.internal:27017/freela_cashflow `
  -e SECURITY_JWT_SECRET=change-this-secret `
  freela-cashflow-api:local
```

## Autenticacao

Cadastro:

```http
POST /api/auth/register
```

```json
{
  "name": "Nicholas Silva",
  "email": "nicholas@email.com",
  "password": "123456"
}
```

Login:

```http
POST /api/auth/login
```

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

Use o token nos endpoints protegidos:

```http
Authorization: Bearer jwt-token
```

## Endpoints principais

### Categorias

```http
POST   /api/categories
GET    /api/categories
GET    /api/categories/{categoryId}
PUT    /api/categories/{categoryId}
DELETE /api/categories/{categoryId}
```

Exemplo:

```json
{
  "name": "Equipamentos",
  "description": "Gastos com computador, perifericos e ferramentas"
}
```

### Receitas

```http
POST   /api/incomes
GET    /api/incomes
GET    /api/incomes?month=6&year=2026
GET    /api/incomes/{incomeId}
PUT    /api/incomes/{incomeId}
DELETE /api/incomes/{incomeId}
PATCH  /api/incomes/{incomeId}/receive
```

Criar receita:

```json
{
  "description": "Parcela 1 do freelance",
  "amount": 1500.00,
  "expectedDate": "2026-06-05",
  "source": "Projeto freelance"
}
```

Marcar como recebida:

```json
{
  "receivedDate": "2026-06-06"
}
```

### Despesas

```http
POST   /api/expenses
GET    /api/expenses
GET    /api/expenses?month=6&year=2026
GET    /api/expenses/{expenseId}
PUT    /api/expenses/{expenseId}
DELETE /api/expenses/{expenseId}
PATCH  /api/expenses/{expenseId}/pay
```

Criar despesa:

```json
{
  "categoryId": "category_id",
  "description": "Parcela do PC",
  "amount": 1000.00,
  "dueDate": "2026-06-17",
  "fixed": true
}
```

Marcar como paga:

```json
{
  "paidDate": "2026-06-17"
}
```

### Resumo mensal

```http
GET /api/monthly-summary?month=6&year=2026
```

Exemplo de resposta:

```json
{
  "month": 6,
  "year": 2026,
  "expectedIncome": 3000.00,
  "receivedIncome": 1500.00,
  "expectedExpenses": 1200.00,
  "paidExpenses": 1000.00,
  "pendingExpenses": 200.00,
  "expectedBalance": 1800.00,
  "realBalance": 500.00,
  "committedIncomePercentage": 40.00
}
```

## Regras de negocio

- Receita nao pode ter valor menor ou igual a zero.
- Despesa nao pode ter valor menor ou igual a zero.
- Receita recebida exige `receivedDate`.
- Despesa paga exige `paidDate`.
- Dados financeiros sao sempre isolados por usuario.
- Categoria usada em despesa precisa pertencer ao usuario autenticado.
- Despesa pendente com vencimento anterior a data atual aparece como `OVERDUE` na resposta.
- Resumo mensal e calculado dinamicamente.

Formulas:

```text
Saldo previsto = receitas previstas - despesas previstas
Saldo real = receitas recebidas - despesas pagas
Percentual comprometido = despesas previstas / receitas previstas * 100
```

## Collections

Collections principais:

```text
users
categories
incomes
expenses
```

O resumo mensal nao possui collection propria. Ele e calculado a partir de `incomes` e `expenses`.

## Testes

Rodar todos os testes:

```bash
./mvnw test
```

No Windows PowerShell:

```powershell
.\mvnw.cmd test
```

Cobertura atual:

- `CategoryService`
- `IncomeService`
- `ExpenseService`
- `MonthlySummaryService`
- carga de contexto Spring

## Documentacao complementar

Documentos de planejamento:

- `docs/freela-cashflow-brd.md`
- `docs/freela-cashflow-planejamento.md`

## Roadmap

Proximos passos sugeridos:

- Melhorar cobertura de testes de controllers.
- Criar testes de integracao com MongoDB.
- Adicionar pipeline de CI.
- Criar Docker Compose completo com API + MongoDB.
- Melhorar documentacao Swagger com descricoes por endpoint.
- Criar frontend.
