# 📊 Schema Prisma - Explicação dos Modelos

## Conceitos Fundamentais

### ✅ O que é um Schema Prisma?
Um arquivo que descreve a **estrutura do seu banco de dados**:
- Tabelas (Models)
- Campos de cada tabela
- Tipos de dados
- Relações entre tabelas
- Validações

### ✅ O que é uma Migração?
Um **arquivo de histórico** que rastreia todas as mudanças no banco:
1. Você edita `schema.prisma`
2. Executa `npx prisma migrate dev --name descricao`
3. Prisma gera um arquivo SQL com as mudanças
4. Executa no banco de dados
5. Salva o histórico em `prisma/migrations/`

---

## 📦 Modelos do RXSAAS

### **1️⃣ User (Usuários)**
```
├── id (String) - ID único
├── email (String) - Email único
├── name (String?) - Nome opcional
├── password (String) - Senha
├── type (ADMIN ou CUSTOMER) - Tipo de usuário
├── ownedRestaurant - Restaurante que gerencia (se for ADMIN)
├── orders - Pedidos que fez (se for CUSTOMER)
├── favoriteProducts - Produtos favoritados
├── createdAt (DateTime) - Data de criação
└── updatedAt (DateTime) - Data de última atualização
```

**Tipo**: ADMIN (gerencia restaurante) ou CUSTOMER (faz pedidos)

---

### **2️⃣ Restaurant (Restaurante)**
```
├── id (String) - ID único
├── name (String) - Nome do restaurante
├── slug (String) - URL-friendly (ex: "meu-restaurante")
├── description (String?) - Descrição
├── email (String?) - Email de contato
├── phone (String?) - Telefone
├── owner (User) - Dono do restaurante
├── categories - Categorias do cardápio
├── products - Produtos/pratos
├── orders - Pedidos recebidos
├── promotions - Promoções ativas
├── createdAt (DateTime)
└── updatedAt (DateTime)
```

**Multi-tenant**: Cada restaurante é isolado (dados de um não afetam outro)

---

### **3️⃣ Category (Categoria do Cardápio)**
```
├── id (String)
├── name (String) - Nome (ex: "Pizzas")
├── description (String?)
├── image (String?) - URL da imagem
├── order (Int) - Ordem de exibição (0, 1, 2...)
├── isActive (Boolean) - Se está visível
├── restaurant - Restaurante dono
├── products - Produtos nesta categoria
├── createdAt (DateTime)
└── updatedAt (DateTime)
```

**Módulo**: Cardápio Digital - Admin ✅

---

### **4️⃣ Product (Produto/Prato)**
```
├── id (String)
├── name (String) - Nome do prato
├── description (String?)
├── price (Decimal) - Preço
├── image (String?) - Foto do prato
├── nutritionInfo (String?) - Info nutricional (JSON)
├── allergens (String?) - Alérgenos (JSON array)
├── ingredients (String?) - Ingredientes (JSON array)
├── isActive (Boolean) - Se está ativo
├── isAvailable (Boolean) - Se está disponível agora
├── isFeatured (Boolean) - Se é destaque
├── salesCount (Int) - Contador de vendas (mais vendidos)
├── availableFrom (String?) - Horário início (HH:MM)
├── availableTo (String?) - Horário fim (HH:MM)
├── availableDays (String?) - Dias disponíveis (JSON: [0,1,2...])
├── productType - REGULAR, COMBO, KIT ou SEASONAL
├── category - Categoria do produto
├── optionGroups - Opcionais (tamanhos, sabores, etc)
├── favoritedBy - Usuários que favoritaram
├── order (Int) - Ordem de exibição
├── createdAt (DateTime)
└── updatedAt (DateTime)
```

**Módulos**: Cardápio Digital (Cliente + Admin) ✅

**ProductType**:
- `REGULAR`: Prato comum
- `COMBO`: Combo de produtos
- `KIT`: Kit de produtos
- `SEASONAL`: Produto sazonal

---

### **5️⃣ ProductOptionGroup (Grupo de Opcionais)**
```
├── id (String)
├── name (String) - Nome (ex: "Tamanho")
├── type - SIZE, FLAVOR, ADDITIONAL, REMOVAL, CUSTOM
├── description (String?)
├── isRequired (Boolean) - Obrigatório ou opcional
├── minSelect (Int) - Mínimo de seleções
├── maxSelect (Int?) - Máximo de seleções (null = sem limite)
├── allowMultiple (Boolean) - Permite selecionar vários
├── product - Produto dono
├── options - Opções disponíveis
├── order (Int) - Ordem de exibição
├── createdAt (DateTime)
└── updatedAt (DateTime)
```

**Exemplo**: Um pizza pode ter:
- Grupo "Tamanho" (obrigatório): Pequeno, Médio, Grande
- Grupo "Adicionais" (opcional): Fritas, Refrigerante, Sobremesa

**Módulo**: Opcionais e Combos ✅

---

### **6️⃣ ProductOption (Opção de Produto)**
```
├── id (String)
├── name (String) - Nome (ex: "Grande")
├── price (Decimal) - Preço adicional
├── isActive (Boolean)
├── group - Grupo dono
├── order (Int) - Ordem de exibição
├── createdAt (DateTime)
└── updatedAt (DateTime)
```

**Exemplo**: Se o grupo é "Tamanho":
- Opção "Pequeno" (preço +0)
- Opção "Médio" (preço +5)
- Opção "Grande" (preço +10)

---

### **7️⃣ FavoriteProduct (Favoritos)**
```
├── id (String)
├── customer - Usuário que favoritou
├── product - Produto favoritado
├── createdAt (DateTime)
```

**Restrição**: Cada cliente pode favoritar cada produto uma vez

**Módulo**: Cardápio Digital - Cliente ✅

---

### **8️⃣ Promotion (Promoção)**
```
├── id (String)
├── code (String) - Código único (ex: "PROMO20")
├── description (String?)
├── discountType - PERCENTAGE ou FIXED
├── discountValue (Decimal) - Valor do desconto
├── minOrderValue (Decimal?) - Mínimo de pedido
├── maxUses (Int?) - Máximo de usos
├── usedCount (Int) - Vezes usada
├── startsAt (DateTime) - Início da promoção
├── endsAt (DateTime) - Fim da promoção
├── applicableProducts (String?) - Produtos (JSON array)
├── restaurant - Restaurante dono
├── isActive (Boolean)
├── createdAt (DateTime)
└── updatedAt (DateTime)
```

**Exemplo**: Código "PROMO20" = 20% de desconto

**Módulo**: Cardápio Digital - Admin ✅

---

### **9️⃣ Order (Pedido)**
```
├── id (String)
├── orderNumber (String) - Número único do pedido
├── status - PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED
├── orderType - PICKUP (balcão), DELIVERY (entrega), DINE_IN (comer no local)
├── separationType - COUNTER (balcão), DELIVERY (delivery), TABLE (mesa)
├── restaurant - Restaurante que recebeu
├── customer - Cliente que fez
├── items - Itens do pedido
├── subtotal (Decimal) - Subtotal
├── tax (Decimal) - Impostos
├── discount (Decimal) - Desconto
├── tip (Decimal) - Gorjeta
├── total (Decimal) - Total
├── couponCode (String?) - Cupom usado
├── scheduledFor (DateTime?) - Quando entregar/retirar
├── notes (String?) - Observações
├── prepTime (Int?) - Tempo de preparo em minutos
├── createdAt (DateTime)
├── updatedAt (DateTime)
└── completedAt (DateTime?)
```

**OrderType**:
- `PICKUP`: Cliente retira no balcão
- `DELIVERY`: Entrega em domicílio
- `DINE_IN`: Cliente come no local

**Módulo**: Pedidos - Cliente + Restaurante ✅

---

### **🔟 OrderItem (Item do Pedido)**
```
├── id (String)
├── quantity (Int) - Quantidade
├── order - Pedido dono
├── product - Produto pedido
├── unitPrice (Decimal) - Preço unitário (congelado do pedido)
├── modifiers - Modificadores (tamanho, adicionais, etc)
├── notes (String?) - Notas especiais
└── createdAt (DateTime)
```

**Módulo**: Pedidos ✅

---

### **1️⃣1️⃣ OrderItemModifier (Modificador do Item)**
```
├── id (String)
├── item - Item dono
├── option - Opção selecionada
├── quantity (Int) - Quantidade (ex: 2 adicionais)
├── price (Decimal) - Preço congelado
└── createdAt (DateTime)
```

**Exemplo**: Item pizza com:
- Tamanho Grande (+10)
- Fritas (+5)

---

## 📊 Relações Entre Modelos

```
User (ADMIN)
  └── owns → Restaurant
       ├── has many → Category
       ├── has many → Product
       │    ├── has many → ProductOptionGroup
       │    │    └── has many → ProductOption
       │    └── favoritedBy → FavoriteProduct ← User (CUSTOMER)
       ├── has many → Promotion
       └── has many → Order
            └── has many → OrderItem
                 ├── references → Product
                 └── has many → OrderItemModifier
                      └── references → ProductOption

User (CUSTOMER)
  ├── places → Order
  └── favorites → FavoriteProduct
```

---

## 🔧 Tipos de Dados Usados

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `String` | Texto | "Pizza Margherita" |
| `Decimal(10,2)` | Decimal de até 10 dígitos, 2 casas | 19.99 |
| `Int` | Número inteiro | 5 |
| `Boolean` | Verdadeiro/Falso | true |
| `DateTime` | Data e hora | 2024-08-04T10:30:00Z |
| `enum` | Opções fixas | "ADMIN" \| "CUSTOMER" |
| `String?` | Texto opcional | null ou "texto" |

---

## 💾 Chaves Especiais

| Símbolo | Significado | Exemplo |
|---------|------------|---------|
| `@id` | Chave primária | `id String @id @default(cuid())` |
| `@unique` | Valor único | `email String @unique` |
| `@default()` | Valor padrão | `isActive Boolean @default(true)` |
| `@relation` | Relacionamento | `owner User @relation(...)` |
| `@db.Decimal()` | Tipo específico | `price Decimal @db.Decimal(10, 2)` |
| `@@unique` | Combinação única | `@@unique([userId, productId])` |
| `@@index` | Índice para busca rápida | `@@index([restaurantId])` |

---

## 🚀 Próximos Passos

1. ✅ Entender o schema (você está lendo agora!)
2. ⏭️ Rodar a migração: `npx prisma migrate dev --name init`
3. ⏭️ Gerar tipos TypeScript: `npx prisma generate`
4. ⏭️ Explorar dados: `npx prisma studio`
5. ⏭️ Criar APIs e componentes

---

**Toda vez que você altera `schema.prisma`, execute uma migração!**
