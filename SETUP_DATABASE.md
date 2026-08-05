# 🗄️ Configurar Banco de Dados

Você tem 2 opções: **Prisma Cloud (Recomendado - mais fácil)** ou **PostgreSQL Local/Docker**.

---

## ✅ Opção 1: Prisma Cloud (Recomendado - Rápido!)

### Passo 1: Criar uma conta (gratuita)
1. Acesse: https://cloud.prisma.io
2. Clique em "Sign Up"
3. Crie sua conta (use sua email: yuri.martins@ifood.com.br)

### Passo 2: Criar um banco de dados
1. No dashboard, clique "Create Database"
2. Escolha região (latency mais baixa)
3. Aguarde (~1-2 minutos)
4. Copie o **DATABASE_URL** completo

### Passo 3: Atualizar .env.local
Abra `.env.local` e substitua a linha:
```
DATABASE_URL="postgresql://..."
```

Cole a URL que copiou do Prisma Cloud.

### Passo 4: Rodar migração
```bash
npx prisma migrate dev --name init
```

Pronto! Seu banco está pronto. 🚀

---

## 📦 Opção 2: PostgreSQL Local

### Passo 1: Instalar PostgreSQL
- **Windows**: https://www.postgresql.org/download/windows/
- **Durante instalação**, anote a **senha** do usuário `postgres`

### Passo 2: Criar banco
```bash
# Abra Command Prompt ou PowerShell
createdb -U postgres rxsaas
```

Se não funcionar, use:
```bash
psql -U postgres -c "CREATE DATABASE rxsaas;"
```

### Passo 3: Atualizar .env.local
```
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/rxsaas"
```

### Passo 4: Rodar migração
```bash
npx prisma migrate dev --name init
```

---

## 🐳 Opção 3: PostgreSQL com Docker

### Pré-requisito: Docker instalado

### Passo 1: Subir container PostgreSQL
```bash
docker run --name rxsaas-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=rxsaas \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### Passo 2: .env.local já está pronto
```
DATABASE_URL="postgresql://user:password@localhost:5432/rxsaas"
```

### Passo 3: Rodar migração
```bash
npx prisma migrate dev --name init
```

### Parar container depois:
```bash
docker stop rxsaas-postgres
docker rm rxsaas-postgres
```

---

## 🚀 Próximo Passo: Rodar a Migração

Escolha uma das opções acima e execute:

```bash
cd C:\Users\yuriv\Desktop\Mentoria I.A\rxsaas

# Rodar a migração (cria as tabelas no banco)
npx prisma migrate dev --name init

# Se tudo funcionar, você verá:
# ✔ Generated Prisma Client (X.X.X)
# ✔ Ran 1 migration
# ✔ Successfully applied migrations
```

---

## ✅ Testar Conexão

```bash
# Abrir Prisma Studio (visualizador do banco)
npx prisma studio

# Você verá um navegador abrir em http://localhost:5555
# Poderá ver/editar todas as tabelas
```

---

## ❓ Erros Comuns

### "Can't reach database"
- Verifique se PostgreSQL está rodando
- Verifique DATABASE_URL em .env.local
- Teste: `psql -U postgres -d rxsaas` (se local)

### "permission denied"
- PostgreSQL não está rodando
- Ou a senha está incorreta

### "database "rxsaas" already exists"
- Banco já foi criado antes
- Use diferente: `createdb -U postgres rxsaas2`

---

## 💡 Recomendação

Para começar **rápido** (ideal para desenvolvimento):
→ **Use Prisma Cloud** (1 minuto)

Para **produção** ou aprender Docker:
→ **Use Docker** (mais profissional)

---

Qual opção você escolhe? Me avise após configurar! 🚀
