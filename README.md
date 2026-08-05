# RXSAAS - Sistema de Gestão para Bares e Restaurantes

SaaS completo para gerenciar cardápios digitais, pedidos e operações de bares e restaurantes.

## Stack Tecnológico

- **Frontend**: Next.js 15+ com React 19
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL com Prisma ORM
- **Language**: TypeScript
- **Authentication**: NextAuth.js

## Setup Inicial

### 1. Configurar Banco de Dados
Configure uma das opções em .env.local:
- PostgreSQL Local: postgresql://user:password@localhost:5432/rxsaas
- PostgreSQL Docker
- Prisma Cloud (https://cloud.prisma.io)

### 2. Setup do Prisma
\\\ash
npx prisma migrate dev --name init
\\\

### 3. Rodar o Servidor
\\\ash
npm run dev
\\\

Acesse: http://localhost:3000

## Estrutura de Pastas

\\\
src/
+-- app/
¦   +-- (auth)/              # Autenticação
¦   +-- (client)/            # Interface do cliente
¦   +-- (admin)/             # Painel administrativo
¦   +-- api/                 # API Routes
¦   +-- layout.tsx
+-- components/
¦   +-- ui/                  # shadcn/ui components
¦   +-- shared/              # Componentes compartilhados
¦   +-- client/              # Componentes do cliente
¦   +-- admin/               # Componentes do admin
+-- lib/
¦   +-- db.ts               # Cliente Prisma
¦   +-- utils.ts
+-- types/
¦   +-- index.ts            # TypeScript types
+-- prisma/
    +-- schema.prisma
\\\

## Status: ? Setup Completo

- [x] Next.js + TypeScript + Tailwind
- [x] shadcn/ui configurado
- [x] Prisma + PostgreSQL
- [x] Schema do banco de dados criado
- [x] Estrutura profissional de pastas
- [ ] Autenticação
- [ ] CRUD de categorias e produtos
- [ ] Fluxo de pedidos

## Próximos Passos

1. Configure PostgreSQL em .env.local
2. Execute: npx prisma migrate dev --name init
3. Implemente autenticação com NextAuth.js
4. Crie interfaces de cardápio e pedidos

---

**Status**: Em desenvolvimento  
**Versão**: 0.1.0
