# Freela-CashFlow — Planejamento do Projeto

## 1. Ideia do projeto

O **Freela-CashFlow** será uma aplicação backend feita em **Java com Spring Boot** para ajudar freelancers, autônomos e pessoas com renda variável a controlar receitas, despesas e saldo mensal.

O foco do projeto é resolver um problema real: muitas pessoas recebem em datas diferentes, às vezes em parcelas, e não sabem exatamente quanto podem gastar, quanto já está comprometido e se o mês vai fechar positivo ou negativo.

## 2. Problema que o projeto resolve

Freelancers normalmente não recebem como trabalhadores CLT, com salário fixo em uma única data. Eles podem receber:

- uma parte no começo do mês;
- outra parte entre os dias 15 e 20;
- valores extras por demanda;
- pagamentos atrasados;
- pagamentos variáveis por projeto.

Com isso, fica difícil responder perguntas simples como:

- Quanto vou receber este mês?
- Quanto já está comprometido com contas?
- Quanto posso gastar sem me enrolar?
- Quanto preciso guardar para pagar parcelas?
- Qual mês está mais apertado?

## 3. Nome do projeto

Nome principal:

```text
Freela-CashFlow
```

Nome do repositório:

```text
freela-cashflow
```

Descrição para o GitHub:

```text
API for freelancers to manage income, expenses and monthly cash flow.
```

## 4. Objetivo do sistema

Criar uma API REST para controle financeiro simples, focada em pessoas que recebem renda variável ou parcelada.

O sistema deve permitir que o usuário cadastre receitas, despesas, categorias e consulte um resumo mensal com saldo previsto, saldo real e percentual da renda comprometida.

## 5. Diferencial do projeto

O diferencial não é ser apenas mais um sistema financeiro genérico.

O foco será em pessoas que recebem em partes, como freelancers, autônomos, estudantes que fazem bicos ou pessoas que recebem por projeto.

Exemplo:

```text
Receita 1:
Descrição: Parcela 1 do freelance
Valor: R$ 1.500,00
Data prevista: 5º dia útil

Receita 2:
Descrição: Parcela 2 do freelance
Valor: R$ 1.500,00
Data prevista: entre dia 15 e 20

Despesa:
Descrição: Parcela do PC
Valor: R$ 1.000,00
Vencimento: dia 17
```

O sistema poderia mostrar algo como:

```text
Depois de pagar a parcela do PC, seu saldo previsto será de R$ 2.000,00.
```

Ou:

```text
Atenção: 70% da sua renda do mês já está comprometida.
```

## 6. Stack definida

A decisão final foi fazer o projeto com **Java + Spring Boot + MongoDB**.

Stack principal:

```text
Java 17
Spring Boot 3.5.x
Spring Web
Spring Data MongoDB
Spring Security
JWT
MongoDB
Bean Validation
Swagger/OpenAPI
JUnit 5
Mockito
Docker
```

Frontend futuro:

```text
React
TypeScript
Axios
TailwindCSS
```

## 7. Por que MongoDB?

O banco escolhido foi o **MongoDB**, porque é uma opção NoSQL comum no mercado, tem boa integração com Java e Spring Boot e permite desenvolver um MVP mais rápido.

Vantagens para este projeto:

- integração simples com Spring Data MongoDB;
- menos complexidade inicial de modelagem relacional;
- bom para armazenar documentos financeiros simples;
- fácil de subir com Docker;
- conhecido no mercado;
- adequado para um projeto de portfólio.

## 8. Dependências do projeto

No Spring Initializr, usar:

```text
Spring Web
Spring Data MongoDB
Validation
Spring Security
Lombok
Spring Boot DevTools
```

Dependências adicionais no `pom.xml`:

```text
Springdoc OpenAPI
Java JWT
```

## 9. Dependências extras recomendadas

### Swagger/OpenAPI

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.8.9</version>
</dependency>
```

### JWT

```xml
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>4.5.0</version>
</dependency>
```

## 10. Collections do MongoDB

Como o projeto usará MongoDB, não teremos tabelas relacionais. Teremos collections.

Collections principais:

```text
users
categories
incomes
expenses
```

O resumo mensal não precisa ser salvo no banco na primeira versão. Ele pode ser calculado dinamicamente pela aplicação.

## 11. Estrutura dos documentos

### User

```json
{
  "_id": "user_id",
  "name": "Nicholas Silva",
  "email": "nicholas@email.com",
  "password": "hashed_password",
  "createdAt": "2026-05-18T10:00:00",
  "updatedAt": "2026-05-18T10:00:00"
}
```

### Category

```json
{
  "_id": "category_id",
  "userId": "user_id",
  "name": "Equipamentos",
  "description": "Gastos com computador, periféricos e ferramentas",
  "createdAt": "2026-05-18T10:00:00",
  "updatedAt": "2026-05-18T10:00:00"
}
```

### Income

```json
{
  "_id": "income_id",
  "userId": "user_id",
  "description": "Parcela 1 do freelance",
  "amount": 1500.00,
  "expectedDate": "2026-06-05",
  "receivedDate": null,
  "status": "EXPECTED",
  "source": "Projeto freelance",
  "createdAt": "2026-05-18T10:00:00",
  "updatedAt": "2026-05-18T10:00:00"
}
```

### Expense

```json
{
  "_id": "expense_id",
  "userId": "user_id",
  "categoryId": "category_id",
  "description": "Parcela do PC",
  "amount": 1000.00,
  "dueDate": "2026-06-17",
  "paidDate": null,
  "status": "PENDING",
  "fixed": true,
  "createdAt": "2026-05-18T10:00:00",
  "updatedAt": "2026-05-18T10:00:00"
}
```

## 12. Estrutura de pastas recomendada

```text
src/main/java/com/nicholas/freelafinance
│
├── config
├── controller
├── domain
│   ├── document
│   └── enums
├── dto
│   ├── request
│   └── response
├── exception
├── repository
├── security
├── service
└── mapper
```

Como será usado MongoDB, a pasta será `domain/document`, e não `domain/entity`.

## 13. MVP inicial

A primeira versão deve ser simples e objetiva, mas já deve incluir autenticação para aplicar conhecimentos de segurança com Spring Security.

Escopo do MVP:

```text
CRUD de categorias
CRUD de receitas
CRUD de despesas
Resumo mensal
Filtro por mês e ano
Cadastro de usuário
Login
JWT
Dados separados por usuário
Swagger
MongoDB com Docker
```

## 14. Segurança no MVP

A autenticação faz parte do escopo principal do projeto. O objetivo é demonstrar conhecimento prático de Spring Security sem transformar o MVP em um sistema grande demais.

Escopo de segurança:

```text
Cadastro de usuário
Login
JWT
Dados separados por usuário
Proteção dos endpoints financeiros
```

## 15. Funcionalidades principais

### Cadastro e login de usuário

O usuário poderá criar conta e fazer login usando e-mail e senha.

### Cadastro de receitas

O usuário poderá cadastrar receitas previstas e recebidas.

### Cadastro de despesas

O usuário poderá cadastrar despesas fixas e variáveis.

### Categorias de gastos

O usuário poderá organizar despesas por categoria.

### Controle por mês

O usuário poderá filtrar receitas e despesas por mês e ano.

### Resumo mensal

O sistema calculará os principais indicadores financeiros do mês.

### Status de pagamento

Receitas e despesas terão status para indicar se estão previstas, recebidas, pagas, pendentes, vencidas ou canceladas.

## 16. Endpoints previstos

### Auth

```http
POST /api/auth/register
POST /api/auth/login
```

### Categories

```http
POST /api/categories
GET /api/categories
GET /api/categories/{id}
PUT /api/categories/{id}
DELETE /api/categories/{id}
```

### Incomes

```http
POST /api/incomes
GET /api/incomes
GET /api/incomes/{id}
PUT /api/incomes/{id}
DELETE /api/incomes/{id}
PATCH /api/incomes/{id}/receive
```

### Expenses

```http
POST /api/expenses
GET /api/expenses
GET /api/expenses/{id}
PUT /api/expenses/{id}
DELETE /api/expenses/{id}
PATCH /api/expenses/{id}/pay
```

### Monthly Summary

```http
GET /api/monthly-summary?month=6&year=2026
```

## 17. Regras de negócio principais

- O usuário não pode criar receita com valor menor ou igual a zero.
- O usuário não pode criar despesa com valor menor ou igual a zero.
- O usuário não pode marcar uma receita como recebida sem informar a data de recebimento.
- O usuário não pode marcar uma despesa como paga sem informar a data de pagamento.
- O sistema deve calcular o saldo previsto do mês.
- O sistema deve calcular o saldo real do mês.
- O sistema deve indicar quanto da renda mensal já está comprometida.
- O sistema deve separar despesas pagas, pendentes e vencidas.
- O sistema deve permitir despesas fixas mensais.
- O sistema deve gerar o resumo mensal automaticamente.

## 18. Fórmulas principais

### Saldo previsto

```text
Saldo previsto = receitas previstas - despesas previstas
```

### Saldo real

```text
Saldo real = receitas recebidas - despesas pagas
```

### Percentual de renda comprometida

```text
Percentual comprometido = despesas previstas / receitas previstas * 100
```

## 19. Ordem recomendada de desenvolvimento

```text
1. Criar projeto Spring Boot.
2. Configurar MongoDB com Docker.
3. Configurar application.properties.
4. Criar documento User.
5. Criar repository de User.
6. Criar cadastro e login.
7. Configurar Spring Security.
8. Criar geração e validação de JWT.
9. Isolar dados por usuário.
10. Criar documento Category.
11. Criar repository de Category.
12. Criar service de Category.
13. Criar controller de Category.
14. Criar documento Income.
15. Criar CRUD de Income.
16. Criar documento Expense.
17. Criar CRUD de Expense.
18. Criar MonthlySummaryService.
19. Criar endpoint de resumo mensal.
20. Configurar Swagger.
21. Criar testes unitários.
22. Criar README profissional.
23. Dockerizar a aplicação.
```

## 20. Docker Compose inicial

Arquivo:

```text
docker-compose.yml
```

Conteúdo:

```yaml
services:
  mongodb:
    image: mongo:7
    container_name: freela-cashflow-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: freela_cashflow
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## 21. application.properties inicial

Arquivo:

```text
src/main/resources/application.properties
```

Conteúdo:

```properties
spring.application.name=freela-cashflow
spring.data.mongodb.uri=mongodb://localhost:27017/freela_cashflow

server.port=8080
```

## 22. Futuras melhorias

Depois do MVP, o projeto pode evoluir com:

```text
Exportação de relatório em PDF
Gráficos
Metas financeiras
Notificações de vencimento
Importação por planilha
Dashboard frontend
Deploy com Docker
CI/CD com GitHub Actions
```

## 23. Valor para portfólio

Esse projeto é bom para portfólio porque mostra que o desenvolvedor sabe transformar uma dor real em software.

Ele permite demonstrar:

- API REST;
- Java com Spring Boot;
- MongoDB;
- autenticação JWT;
- validações;
- regras de negócio;
- filtros por mês;
- dashboard/resumo financeiro;
- documentação com Swagger;
- testes;
- Docker;
- organização profissional de projeto.
