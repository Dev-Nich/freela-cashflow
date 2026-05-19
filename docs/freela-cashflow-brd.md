# BRD — Freela-CashFlow

## 1. Informações do documento

| Campo | Valor |
|---|---|
| Nome do projeto | Freela-CashFlow |
| Tipo de documento | Business Requirements Document |
| Versão | 1.0 |
| Tecnologia principal | Java 17 + Spring Boot 3.5.x |
| Banco de dados | MongoDB |
| Tipo de aplicação | API REST |
| Público-alvo | Freelancers, autônomos e pessoas com renda variável |

## 2. Visão do produto

O **Freela-CashFlow** é uma aplicação backend para controle financeiro pessoal, voltada principalmente para freelancers e autônomos que recebem valores variáveis ou parcelados ao longo do mês.

O sistema permitirá cadastrar receitas, despesas, categorias e gerar um resumo mensal, ajudando o usuário a entender quanto tem previsto para receber, quanto já está comprometido e qual será seu saldo final estimado.

## 3. Problema de negócio

Muitas pessoas que trabalham como freelancers recebem em datas diferentes, em parcelas ou com valores variáveis. Isso torna difícil controlar o próprio dinheiro e responder perguntas importantes, como:

- Quanto vou receber no mês?
- Quanto já está comprometido com contas?
- Quanto posso gastar sem me enrolar?
- Quanto preciso guardar para pagar dívidas ou parcelas?
- Qual mês está mais apertado?

Essa falta de visibilidade pode causar atraso em pagamentos, mau planejamento financeiro e dificuldade para tomar decisões simples de consumo.

## 4. Objetivo de negócio

Criar uma API que permita ao usuário organizar suas receitas e despesas de forma simples, com foco em visão mensal e previsibilidade financeira.

O objetivo principal é ajudar o usuário a saber:

- quanto tem previsto para receber;
- quanto já recebeu;
- quanto tem previsto para pagar;
- quanto já pagou;
- quanto ainda está pendente;
- qual será o saldo previsto do mês;
- qual é o saldo real atual;
- qual percentual da renda está comprometido.

## 5. Público-alvo

O sistema é destinado a:

- freelancers;
- autônomos;
- estudantes que fazem trabalhos extras;
- pessoas que recebem por projeto;
- pessoas com renda variável;
- pessoas que recebem pagamentos em parcelas.

## 6. Escopo do MVP

A primeira versão do produto deve conter apenas o essencial para validar a ideia.

### Dentro do escopo

- Cadastro de categorias.
- Cadastro de receitas.
- Cadastro de despesas.
- Consulta de receitas por mês e ano.
- Consulta de despesas por mês e ano.
- Resumo mensal.
- Status de receitas.
- Status de despesas.
- Cadastro de usuário.
- Login.
- Autenticação JWT.
- Isolamento dos dados por usuário.
- Documentação Swagger.
- MongoDB com Docker.

### Fora do escopo inicial

- Frontend.
- Exportação de PDF.
- Gráficos avançados.
- Notificações.
- Importação de planilha.
- Integração bancária.
- Aplicativo mobile.

## 7. Escopo de evolução

Após o MVP funcional, o projeto pode evoluir com melhorias de produto e qualidade:

- Testes unitários e de integração mais completos.
- README profissional para portfólio.
- Dockerfile da aplicação.
- Deploy.
- Frontend.

## 8. Premissas

- O projeto será desenvolvido em Java 17.
- O framework backend será Spring Boot 3.5.x.
- O banco será MongoDB.
- A primeira versão deve incluir autenticação para aplicar conceitos de segurança com Spring Security.
- O resumo mensal será calculado dinamicamente, sem necessidade de salvar uma collection específica.
- O sistema será inicialmente uma API REST.

## 9. Restrições

- O projeto deve ser simples o suficiente para ser concluído como MVP.
- O foco inicial é backend, não frontend.
- O sistema não deve depender de integração com bancos reais.
- O sistema não deve tentar ser um ERP financeiro completo.
- As regras devem ser claras, testáveis e úteis para portfólio.

## 10. Requisitos funcionais

### RF01 — Gerenciar categorias

O sistema deve permitir criar, listar, consultar, atualizar e remover categorias de despesas.

Dados da categoria:

- nome;
- descrição;
- data de criação;
- data de atualização.

### RF02 — Gerenciar receitas

O sistema deve permitir criar, listar, consultar, atualizar e remover receitas.

Dados da receita:

- descrição;
- valor;
- data prevista;
- data de recebimento;
- status;
- fonte da receita;
- data de criação;
- data de atualização.

### RF03 — Marcar receita como recebida

O sistema deve permitir marcar uma receita como recebida.

Para isso, a data de recebimento deve ser informada.

### RF04 — Gerenciar despesas

O sistema deve permitir criar, listar, consultar, atualizar e remover despesas.

Dados da despesa:

- categoria;
- descrição;
- valor;
- data de vencimento;
- data de pagamento;
- status;
- indicação se é fixa;
- data de criação;
- data de atualização.

### RF05 — Marcar despesa como paga

O sistema deve permitir marcar uma despesa como paga.

Para isso, a data de pagamento deve ser informada.

### RF06 — Consultar receitas por mês

O sistema deve permitir consultar receitas filtrando por mês e ano.

Exemplo:

```http
GET /api/incomes?month=6&year=2026
```

### RF07 — Consultar despesas por mês

O sistema deve permitir consultar despesas filtrando por mês e ano.

Exemplo:

```http
GET /api/expenses?month=6&year=2026
```

### RF08 — Gerar resumo mensal

O sistema deve gerar um resumo financeiro mensal contendo:

- receita prevista;
- receita recebida;
- despesas previstas;
- despesas pagas;
- despesas pendentes;
- saldo previsto;
- saldo real;
- percentual da renda comprometida.

Exemplo:

```http
GET /api/monthly-summary?month=6&year=2026
```

### RF09 — Documentar API com Swagger

O sistema deve disponibilizar documentação dos endpoints via Swagger/OpenAPI.

### RF10 — Autenticação de usuário

O sistema deve permitir cadastro e login de usuários.

### RF11 — Isolamento por usuário

Cada usuário só poderá acessar seus próprios dados financeiros.

## 11. Requisitos não funcionais

### RNF01 — Linguagem

O sistema deve ser desenvolvido em Java 17.

### RNF02 — Framework

O sistema deve usar Spring Boot 3.5.x.

### RNF03 — Banco de dados

O sistema deve usar MongoDB.

### RNF04 — API REST

O sistema deve expor endpoints REST usando JSON.

### RNF05 — Validação

O sistema deve validar dados de entrada usando Bean Validation.

### RNF06 — Documentação

A API deve ser documentada com Swagger/OpenAPI.

### RNF07 — Segurança

A API deve usar autenticação JWT.

### RNF08 — Testabilidade

As regras de negócio devem ser implementadas em services para facilitar testes unitários.

### RNF09 — Portabilidade

O MongoDB deve poder ser executado via Docker Compose.

### RNF10 — Manutenibilidade

O projeto deve ter separação clara entre controller, service, repository, DTOs, documents e exceptions.

## 12. Regras de negócio

### RN01 — Valor da receita

O sistema não deve permitir cadastrar receita com valor menor ou igual a zero.

### RN02 — Valor da despesa

O sistema não deve permitir cadastrar despesa com valor menor ou igual a zero.

### RN03 — Receita recebida

O sistema não deve permitir marcar uma receita como recebida sem data de recebimento.

### RN04 — Despesa paga

O sistema não deve permitir marcar uma despesa como paga sem data de pagamento.

### RN05 — Despesa vencida

Uma despesa com status pendente e data de vencimento anterior à data atual deve ser considerada vencida.

### RN06 — Saldo previsto

O saldo previsto deve ser calculado da seguinte forma:

```text
Saldo previsto = total de receitas previstas - total de despesas previstas
```

### RN07 — Saldo real

O saldo real deve ser calculado da seguinte forma:

```text
Saldo real = total de receitas recebidas - total de despesas pagas
```

### RN08 — Percentual da renda comprometida

O percentual de renda comprometida deve ser calculado da seguinte forma:

```text
Percentual comprometido = despesas previstas / receitas previstas * 100
```

### RN09 — Separação por status

O sistema deve separar despesas pagas, pendentes, vencidas e canceladas.

### RN10 — Despesas fixas

O sistema deve permitir indicar se uma despesa é fixa.

## 13. Modelagem de dados

### Collection: users

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

### Collection: categories

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

### Collection: incomes

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

### Collection: expenses

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

## 14. Enums

### IncomeStatus

```java
public enum IncomeStatus {
    EXPECTED,
    RECEIVED,
    CANCELED
}
```

### ExpenseStatus

```java
public enum ExpenseStatus {
    PENDING,
    PAID,
    OVERDUE,
    CANCELED
}
```

## 15. Endpoints principais

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

### Auth

```http
POST /api/auth/register
POST /api/auth/login
```

## 16. Exemplo de resposta do resumo mensal

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

## 17. Critérios de sucesso do MVP

O MVP será considerado concluído quando:

- for possível cadastrar categorias;
- for possível cadastrar receitas;
- for possível cadastrar despesas;
- for possível consultar receitas por mês;
- for possível consultar despesas por mês;
- for possível gerar resumo mensal;
- for possível cadastrar usuário e fazer login;
- os endpoints financeiros estiverem protegidos por JWT;
- cada usuário acessar apenas seus próprios dados;
- as validações básicas estiverem funcionando;
- a API estiver documentada com Swagger;
- o MongoDB estiver configurado via Docker.

## 18. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Escopo crescer demais | Alto | Manter o MVP focado em autenticação, CRUDs financeiros e resumo mensal |
| Segurança atrasar o CRUD financeiro | Médio | Implementar autenticação mínima e evoluir regras avançadas depois |
| Modelagem NoSQL confusa | Médio | Usar documents simples e evitar relacionamentos complexos |
| Projeto parecer CRUD genérico | Alto | Destacar regras de negócio e resumo mensal |

## 19. Roadmap

### Etapa 1 — Fundação do projeto

```text
MongoDB com Docker
Configuração da aplicação
Swagger
Tratamento global de exceções
```

### Etapa 2 — Segurança

```text
Usuário
Login
JWT
Isolamento por usuário
```

### Etapa 3 — Fluxo financeiro

```text
Categorias
Receitas
Despesas
Resumo mensal
```

### Etapa 4 — Qualidade e evolução

```text
Testes unitários
Testes de integração
README profissional
Dockerfile
Frontend
Gráficos
PDF
Metas financeiras
Notificações
Deploy
```

## 20. Conclusão

O Freela-CashFlow será um projeto de portfólio com problema real, escopo controlado e boa demonstração de conhecimento backend.

A escolha por Java, Spring Boot e MongoDB permite desenvolver com rapidez sem perder valor técnico. O projeto mostra domínio de API REST, NoSQL, validações, regras de negócio, documentação e arquitetura organizada.
