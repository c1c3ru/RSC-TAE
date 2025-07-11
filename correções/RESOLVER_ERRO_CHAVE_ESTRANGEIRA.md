# 🔧 Resolver Erro de Chave Estrangeira - Guia Completo

## 🚨 **PROBLEMA ATUAL**

O sistema está falhando ao criar atividades devido ao erro:
```
insert or update on table "user_rsc" violates foreign key constraint "user_rsc_user_id_fkey"
```

**Causa raiz**: Incompatibilidade entre a estrutura da tabela `user_profile` no banco e os campos que o código está tentando inserir.

## ✅ **SOLUÇÃO IMPLEMENTADA**

### **1. Script SQL Criado**
Arquivo: `database/update_user_profile_structure.sql`

**Execute este script no SQL Editor do Supabase:**
```sql
-- Adicionar campos que estão faltando
ALTER TABLE public.user_profile 
ADD COLUMN IF NOT EXISTS employee_number CHARACTER VARYING(255) NULL,
ADD COLUMN IF NOT EXISTS functional_category CHARACTER VARYING(255) NULL,
ADD COLUMN IF NOT EXISTS education CHARACTER VARYING(255) NULL;
```

### **2. Código Atualizado**
- `src/services/activityService.ts`: Removidos campos inexistentes
- `src/context/AuthContext.tsx`: Ajustado para usar apenas campos válidos

## 🔍 **PASSOS PARA RESOLVER**

### **Passo 1: Executar Script SQL**
1. Acesse: https://supabase.com/dashboard/project/nndkowmwzxfbonbldzsc
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo de `database/update_user_profile_structure.sql`
4. Clique em **Run**

### **Passo 2: Verificar Estrutura**
Execute no SQL Editor:
```sql
-- Verificar se os campos foram adicionados
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profile' 
AND table_schema = 'public'
ORDER BY ordinal_position;
```

### **Passo 3: Testar Sistema**
1. Faça login no sistema
2. Tente criar uma atividade
3. Verifique se o erro foi resolvido

## 🧪 **TESTE AUTOMATIZADO**

Execute o script de teste:
```bash
node scripts/test_user_profile_structure.js
```

Este script irá:
- ✅ Verificar a estrutura da tabela
- ✅ Testar inserção de perfil
- ✅ Verificar políticas RLS
- ✅ Fornecer recomendações

## 📋 **VERIFICAÇÃO MANUAL**

### **1. Teste de Criação de Perfil**
```sql
-- No SQL Editor do Supabase
INSERT INTO user_profile (id, email, name, job, date_singin)
VALUES ('test-id', 'teste@teste.com', 'Teste', 'Teste', NOW());
```

### **2. Teste de Criação de Atividade**
```sql
-- No SQL Editor do Supabase (após login)
INSERT INTO user_rsc (user_id, competence_id, quantity, value, data_inicio, data_fim)
VALUES (auth.uid(), 'CAT1-01', 1, 10.00, '2024-01-01', '2024-12-31');
```

## 🔧 **CÓDIGO CORRIGIDO**

### **Antes (causava erro):**
```typescript
{
  id: userId,
  email: tempEmail,
  name: null,
  employee_number: null, // ❌ Campo não existe
  job: null,
  functional_category: null, // ❌ Campo não existe
  date_singin: new Date().toISOString(),
  education: null // ❌ Campo não existe
}
```

### **Depois (funciona):**
```typescript
{
  id: userId,
  email: tempEmail,
  name: 'Usuário Temporário',
  job: null,
  date_singin: new Date().toISOString()
}
```

## 📊 **ESTRUTURA ATUAL vs ESPERADA**

### **Estrutura Atual (dump.sql):**
```sql
CREATE TABLE public.user_profile (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    idjob character varying(255),
    job character varying(255),
    profile character varying(50),
    date_singin timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
```

### **Estrutura Após Script SQL:**
```sql
CREATE TABLE public.user_profile (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    idjob character varying(255),
    job character varying(255),
    profile character varying(50),
    date_singin timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    employee_number character varying(255), -- ✅ Novo campo
    functional_category character varying(255), -- ✅ Novo campo
    education character varying(255) -- ✅ Novo campo
);
```

## 🚀 **PRÓXIMOS PASSOS**

1. **Execute o script SQL** no Supabase
2. **Teste a criação de atividades** no sistema
3. **Se ainda houver problemas**, execute o script de teste
4. **Verifique as políticas RLS** se necessário

## 📞 **SUPORTE**

Se o problema persistir após executar o script SQL:

1. **Verifique os logs** do Supabase
2. **Execute o script de teste** para diagnóstico
3. **Verifique as políticas RLS** no dashboard
4. **Teste manualmente** no SQL Editor

---

**Status**: ✅ Solução implementada  
**Próxima ação**: Executar script SQL no Supabase  
**Arquivos modificados**: 
- `database/update_user_profile_structure.sql`
- `src/services/activityService.ts`
- `src/context/AuthContext.tsx`
- `scripts/test_user_profile_structure.js` 