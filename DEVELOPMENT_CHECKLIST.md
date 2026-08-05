# 🎯 Development Checklist - RXSAAS

Checklist obrigatório para **TODAS** as novas funcionalidades, páginas e endpoints.

## ✅ Antes de Implementar

- [ ] Definir tipos TypeScript corretos
- [ ] Documentar estrutura esperada
- [ ] Revisar padrões existentes
- [ ] Verificar se já existe algo similar

## ✅ Implementar Hook/Custom Hook

```typescript
// 1. Imports corretos
- [ ] Usar "use client" se for hook de cliente
- [ ] Importar tipos necessários
- [ ] Importar validadores de @/lib/validators

// 2. Tipos definidos
- [ ] Interface/Type para dados
- [ ] Estados tipados (useState<Type[]>)
- [ ] Retorno tipado da função

// 3. Validação
- [ ] Usar fetchWithValidation() em lugar de fetch()
- [ ] Tratar erros com try/catch
- [ ] Usar console.error() com emoji 🚨 para debug

// 4. Dependências
- [ ] useCallback tem array de dependências completo
- [ ] useEffect tem array de dependências correto
- [ ] Não há missing dependencies warnings

// 5. Retorno
- [ ] Retornar objeto com estado + setters
- [ ] Incluir refetch/retry function
- [ ] Incluir loading e error states
```

## ✅ Implementar Página/Componente

```typescript
// 1. Estrutura
- [ ] Usar "use client" se tiver interatividade
- [ ] Tipagem completa de props
- [ ] Validar props com validateComponentProps() se necessário

// 2. Dados
- [ ] Usar hooks customizados para data fetching
- [ ] Validar resposta da API
- [ ] Tratar estado de loading
- [ ] Tratar estado de erro

// 3. UI
- [ ] Seguir design system (paleta de cores)
- [ ] Usar componentes compartilhados
- [ ] Ser responsivo (mobile-first)
- [ ] Suportar dark mode

// 4. UX
- [ ] Mostrar loading state
- [ ] Mostrar empty state
- [ ] Mostrar erro state
- [ ] CTA (Call-to-Action) claro
```

## ✅ Implementar API Endpoint

```typescript
// 1. Arquivo correto
- [ ] Criar em src/app/api/[resource]/route.ts
- [ ] Seguir convenção de nomes

// 2. Métodos
- [ ] Definir apenas métodos necessários (GET, POST, etc)
- [ ] Cada método tem try/catch
- [ ] Retornar NextResponse.json() sempre

// 3. Validação
- [ ] Validar entrada com Zod schema
- [ ] Usar validateApiResponse() se aplicável
- [ ] Validar permissões se necessário

// 4. Resposta
- [ ] Retornar formato consistente: { success, data, error }
- [ ] Status code correto (200, 201, 400, 500)
- [ ] Mensagens de erro descritivas
```

## ✅ Implementar Service Layer

```typescript
// 1. Arquivo correto
- [ ] Criar em src/services/[name]Service.ts
- [ ] Exportar como objeto singleton: export const myService = { ... }

// 2. Métodos CRUD
- [ ] create(): Create new record
- [ ] read(id): Get single record
- [ ] list(): Get all records with filters
- [ ] update(id): Update record
- [ ] delete(id): Delete record

// 3. Validação
- [ ] Validar dados de entrada
- [ ] Tratar erros do banco
- [ ] Logar operações importantes

// 4. Tipo de Retorno
- [ ] Retornar tipo correto
- [ ] Nunca retornar null sem avisar
- [ ] Documentar possíveis exceções
```

## ✅ Testar Antes de Merge

```bash
# 1. Type Checking
- [ ] npm run type-check (zero errors)
- [ ] Sem any types (ou com justificativa)

# 2. Build
- [ ] npm run build (sem warnings)
- [ ] nextjs consegue compilar

# 3. Runtime
- [ ] Testar fluxo completo manualmente
- [ ] Testar error cases
- [ ] Testar edge cases
- [ ] Testar em mobile

# 4. Performance
- [ ] Página carrega em < 2s
- [ ] Sem console errors
- [ ] Sem console warnings
```

## ✅ Garantias de Qualidade

### 🚨 NUNCA fazer:
- ❌ Usar `any` type (use `unknown` se necessário)
- ❌ Não tratar erros
- ❌ Não validar input/output
- ❌ Deixar `console.log()` de debug
- ❌ Hardcoded values (use constantes)
- ❌ Endpoint sem validação
- ❌ Hook sem array de dependências

### ✅ SEMPRE fazer:
- ✅ Validar com `fetchWithValidation()`
- ✅ Tratar erros com try/catch
- ✅ Usar tipos TypeScript
- ✅ Documentar com comentários
- ✅ Testar manual antes de commitar
- ✅ Seguir padrões do projeto

## 📋 Exemplo: Nova Feature (Passo a Passo)

### 1. Criar validação
```typescript
// src/lib/validations/myfeature.ts
export const createMyFeatureSchema = z.object({
  name: z.string().min(2),
  // ... mais campos
});
```

### 2. Criar service
```typescript
// src/services/myFeatureService.ts
export const myFeatureService = {
  async create(data) {
    // validar, chamar DB, retornar resultado
  },
  // ... outros métodos CRUD
};
```

### 3. Criar API endpoint
```typescript
// src/app/api/myfeature/route.ts
import { fetchWithValidation } from "@/lib/validators";
// implement GET, POST com validação
```

### 4. Criar hook
```typescript
// src/hooks/useMyFeature.ts
import { fetchWithValidation } from "@/lib/validators";
// implementar com validação automática
```

### 5. Criar página
```typescript
// src/app/admin/myfeature/page.tsx
"use client";
import { useMyFeature } from "@/hooks/useMyFeature";
// usar hook, validar dados, renderizar UI
```

### 6. Testar
- [ ] Criar novo item funciona
- [ ] Listar items funciona
- [ ] Editar item funciona
- [ ] Deletar item funciona
- [ ] Tratamento de erro funciona
- [ ] UI responsiva em mobile

## 📞 Em Caso de Erro

### Checklist de Debug

1. **Erro de tipo TypeScript**
   - [ ] Verificar tipos de entrada/saída
   - [ ] Usar `satisfies` para validar
   - [ ] Rodar `npm run type-check`

2. **Erro de validação**
   - [ ] Verificar schema Zod
   - [ ] Verificar entrada de dados
   - [ ] Usar `validateBeforeSubmit()`

3. **Erro de API**
   - [ ] Verificar resposta no DevTools Network
   - [ ] Verificar formato JSON
   - [ ] Usar `fetchWithValidation()` para debug
   - [ ] Checar logs do servidor

4. **Erro de Hook**
   - [ ] Verificar array de dependências
   - [ ] Verificar se é "use client"
   - [ ] Usar React DevTools para debug
   - [ ] Testar em isolamento

## 🎓 Referências

- Validation Guide: `src/lib/VALIDATION_GUARDRAILS.md`
- Design System: Colors/Typography/Spacing
- API Patterns: Todos endpoints seguem padrão
- Hook Patterns: Todos hooks seguem padrão

---

**Última atualização**: 2026-08-05
**Responsável**: Development Team
