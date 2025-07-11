# 🔧 Diagnóstico e Solução do Erro de Chave Estrangeira

## 🚨 **PROBLEMA IDENTIFICADO**

O erro `insert or update on table "user_rsc" violates foreign key constraint "user_rsc_user_id_fkey"` está ocorrendo porque:

1. **Incompatibilidade de estrutura**: O código está tentando inserir campos que não existem na tabela `user_profile`
2. **Falha na criação do perfil**: Devido aos campos inexistentes, o perfil não é criado
3. **Violação de chave estrangeira**: A tabela `user_rsc` tem uma constraint que exige que o `user_id` exista na tabela `user_profile`

## 📊 **ANÁLISE DETALHADA**

### **Estrutura Atual da Tabela (dump.sql):**
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

### **Campos que o Código Tenta Usar (mas não existem):**
- `employee_number`
- `functional_category` 
- `education`

## ✅ **SOLUÇÃO IMPLEMENTADA**

### **1. Script SQL para Atualizar a Estrutura**
Execute o arquivo `database/update_user_profile_structure.sql` no SQL Editor do Supabase:

```sql
-- Adicionar campos que estão faltando
ALTER TABLE public.user_profile 
ADD COLUMN IF NOT EXISTS employee_number CHARACTER VARYING(255) NULL,
ADD COLUMN IF NOT EXISTS functional_category CHARACTER VARYING(255) NULL,
ADD COLUMN IF NOT EXISTS education CHARACTER VARYING(255) NULL;
```

### **2. Código Atualizado**
O código foi atualizado para usar apenas os campos que existem na tabela atual:

```typescript
// Antes (causava erro)
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

// Depois (funciona)
{
  id: userId,
  email: tempEmail,
  name: 'Usuário Temporário',
  job: null,
  date_singin: new Date().toISOString()
}
```

## 🔍 **PASSOS PARA CORRIGIR**

### **Passo 1: Executar Script SQL**
1. Acesse o Supabase Dashboard
2. Vá para SQL Editor
3. Execute o script `database/update_user_profile_structure.sql`

### **Passo 2: Verificar Estrutura**
```sql
-- Verificar se os campos foram adicionados
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profile' 
AND table_schema = 'public';
```

### **Passo 3: Testar Criação de Atividade**
1. Faça login no sistema
2. Tente criar uma atividade
3. Verifique se o erro foi resolvido

## 📋 **VERIFICAÇÃO DE POLÍTICAS RLS**

Certifique-se de que as políticas RLS estão corretas:

```sql
-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('user_profile', 'user_rsc', 'competences')
ORDER BY tablename, policyname;
```

### **Políticas Necessárias:**
```sql
-- user_profile
CREATE POLICY "select_own_profile" ON user_profile FOR SELECT USING (auth.uid() = id);
CREATE POLICY "insert_own_profile" ON user_profile FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own_profile" ON user_profile FOR UPDATE USING (auth.uid() = id);

-- user_rsc
CREATE POLICY "select_own_rsc" ON user_rsc FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own_rsc" ON user_rsc FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 🧪 **TESTE DE FUNCIONAMENTO**

### **1. Teste de Criação de Perfil**
```sql
-- Verificar se usuário pode criar perfil
INSERT INTO user_profile (id, email, name, job, date_singin)
VALUES (auth.uid(), 'teste@teste.com', 'Teste', 'Teste', NOW());
```

### **2. Teste de Criação de Atividade**
```sql
-- Verificar se usuário pode criar atividade
INSERT INTO user_rsc (user_id, competence_id, quantity, value, data_inicio, data_fim)
VALUES (auth.uid(), 'CAT1-01', 1, 10.00, '2024-01-01', '2024-12-31');
```

## 📝 **NOTAS IMPORTANTES**

1. **Backup**: Faça backup do banco antes de executar alterações
2. **Teste**: Teste em ambiente de desenvolvimento primeiro
3. **Monitoramento**: Monitore os logs após as alterações
4. **Rollback**: Tenha um plano de rollback caso algo dê errado

## 🔄 **PRÓXIMOS PASSOS**

1. Execute o script SQL no Supabase
2. Teste a criação de atividades
3. Se ainda houver problemas, verifique as políticas RLS
4. Use o componente RLSTest para diagnosticar problemas

---

**Status**: ✅ Solução implementada  
**Próxima ação**: Executar script SQL no Supabase 