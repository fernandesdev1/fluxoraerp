# Fluxora ERP

Sistema de gestão de estoque e vendas com atualização em tempo real.

Projeto desenvolvido com o objetivo de simular um cenário comum em pequenos negócios, onde o controle de produtos e vendas ainda é feito manualmente ou com ferramentas limitadas. A proposta foi centralizar essas operações e automatizar partes críticas como atualização de estoque e acompanhamento de vendas.

---

## Funcionalidades

* Cadastro, edição e remoção de produtos
* Controle de estoque com atualização automática
* Registro de vendas
* Histórico de vendas
* Alertas de estoque baixo
* Dashboard com resumo de receita e produtos mais vendidos
* Atualizações em tempo real via WebSocket
* Autenticação com JWT
* Controle básico de permissões (admin e funcionário)

---

## Stack utilizada

### Frontend

* React + TypeScript
* Vite
* Recharts
* Socket.io-client

### Backend

* Node.js + Express
* Prisma ORM
* SQLite (ambiente de desenvolvimento)
* Socket.io
* JWT
* Bcrypt

---

## Estrutura do projeto

```text
fluxora-erp/
├── client/
│   ├── src/
│   │   ├── features/
│   │   ├── components/
│   │   ├── context/
│   │   └── services/
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── prisma/
```

---

## Como executar

### Pré-requisitos

* Node.js 18 ou superior

---

### Backend

```bash
cd server
npm install

npx prisma migrate dev --name init
npm run seed

npm run dev
```

---

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Usuários de teste

| Tipo        | Email                                         | Senha    |
| ----------- | --------------------------------------------- | -------- |
| Admin       | [admin@fluxora.com](mailto:admin@fluxora.com) | admin123 |
| Funcionário | [emp@fluxora.com](mailto:emp@fluxora.com)     | user123  |

---

## Decisões técnicas

* Uso de WebSocket (Socket.io) para refletir alterações de estoque e vendas em tempo real
* Prisma para facilitar a modelagem e migração do banco
* SQLite para reduzir complexidade no setup local
* Separação do backend em camadas (controllers, services, routes)

---

## Limitações atuais

* Não possui suporte a múltiplas empresas (multi-tenant)
* Integrações externas (pagamento, APIs) ainda não implementadas
* Controle de permissões simplificado

---

## Possíveis melhorias

* Suporte a múltiplos estabelecimentos
* Integração com gateways de pagamento
* Migração para PostgreSQL em produção
* Sistema de relatórios mais completo
* Logs e monitoramento

---

## Autor

Projeto desenvolvido por Lindoberto Fernandes.
