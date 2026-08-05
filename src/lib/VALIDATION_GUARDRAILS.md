# 🛡️ Validation Guardrails - RXSAAS

Documento de referência para validação segura de dados em todo o projeto.

## 📋 Tipos de Validações

### 1. **API Response Validation**
```typescript
import { validateApiResponse } from "@/lib/validators";

// ✅ CORRETO
const response = await fetch("/api/categories");
const data = await response.json();
const validated = validateApiResponse(data);
// Garante que: response !== null, é um objeto, tem campo 'success'
```

### 2. **Form Data Validation**
```typescript
import { validateFormData, validateBeforeSubmit } from "@/lib/validators";

// ✅ CORRETO - Simples
const data = { name: "Pizza", description: "Delicious" };
validateFormData(data, ["name"]);

// ✅ CORRETO - Com validadores customizados
validateBeforeSubmit(data, ["name"], {
  name: (value) => typeof value === "string" && value.length >= 2,
  description: (value) => value === "" || typeof value === "string",
});
```

### 3. **Hook Initialization**
```typescript
import { createValidatedHook } from "@/lib/validators";

// ✅ CORRETO
export function useMyHook() {
  return createValidatedHook("useMyHook", () => {
    const [state, setState] = useState(null);
    return { state, setState };
  });
}
```

### 4. **Component Props Validation**
```typescript
import { validateComponentProps } from "@/lib/validators";

interface MyComponentProps {
  name: string;
  count: number;
}

export function MyComponent(props: MyComponentProps) {
  validateComponentProps(props, {
    name: "string",
    count: "number",
  });

  return <div>{props.name}: {props.count}</div>;
}
```

### 5. **Fetch with Validation**
```typescript
import { fetchWithValidation } from "@/lib/validators";

// ✅ CORRETO - Valida automaticamente
const data = await fetchWithValidation("/api/categories");
// Garante: resposta OK, é JSON válido, tem campo 'success'
```

## 🚨 Erros Comuns Prevenidos

| Erro | Causa | Guardrail |
|------|-------|-----------|
| `Cannot read property 'success' of null` | API retorna null | `validateApiResponse()` |
| `Unexpected end of JSON input` | Resposta não é JSON | `fetchWithValidation()` |
| `Expected ',', got '('` | Erro de sintaxe em hooks | `createValidatedHook()` |
| `Missing required field` | Form incompleto | `validateBeforeSubmit()` |
| `TypeError: Cannot read property 'map' of undefined` | Array vazio não tratado | `validateApiResponse()` |

## 📝 Checklist de Implementação

Ao criar novos endpoints, hooks ou componentes:

- [ ] API response tem validação?
- [ ] Form data é validado antes de submit?
- [ ] Hook dependencies estão corretas?
- [ ] Component props têm tipos definidos?
- [ ] Tratamento de erros está presente?
- [ ] Mensagens de erro são descritivas?

## 🔄 Padrão Recomendado para CRUD

```typescript
// ✅ PADRÃO SEGURO PARA CRIAR CATEGORIA

// 1. Validar form
validateBeforeSubmit(formData, ["name", "description"], {
  name: (v) => v && v.length >= 2,
});

// 2. Fazer requisição com validação
const response = await fetchWithValidation("/api/categories", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});

// 3. Processar resposta validada
if (response.success) {
  router.push("/admin/categories");
}
```

## 🧪 Teste os Guardrails

```bash
# Validação de API Response
node -e "
const validators = require('./lib/validators');
try {
  validators.validators.validateApiResponse(null);
} catch(e) {
  console.log('✅ Caught:', e.message);
}
"
```

## 📚 Referência Rápida

```typescript
// Import
import { 
  validators,
  validateApiResponse,
  validateBeforeSubmit,
  fetchWithValidation,
  createValidatedHook,
} from "@/lib/validators";

// Use
validators.validateApiResponse(data)
validators.validateFormData(data, ["field1"])
validators.validateHookInit([dep1, dep2])
validators.validateComponentProps(props, schema)
validators.validateDbConnection(db)
```

## 🎯 Próximas Etapas

1. ✅ Aplicar guardrails em todos os hooks
2. ✅ Aplicar guardrails em todos os endpoints API
3. ✅ Adicionar testes unitários para validadores
4. ✅ Integrar com logging para rastrear erros
