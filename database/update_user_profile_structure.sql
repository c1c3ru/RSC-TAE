-- =====================================================
-- ATUALIZAÇÃO DA ESTRUTURA DA TABELA user_profile
-- =====================================================

-- Adicionar campos que estão faltando na tabela user_profile
ALTER TABLE public.user_profile 
ADD COLUMN IF NOT EXISTS employee_number CHARACTER VARYING(255) NULL,
ADD COLUMN IF NOT EXISTS functional_category CHARACTER VARYING(255) NULL,
ADD COLUMN IF NOT EXISTS education CHARACTER VARYING(255) NULL;

-- Renomear campo 'escolaridade' para 'education' se existir
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profile' 
        AND column_name = 'escolaridade'
    ) THEN
        ALTER TABLE public.user_profile RENAME COLUMN escolaridade TO education;
    END IF;
END $$;

-- Verificar se a estrutura está correta
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profile' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- COMANDOS PARA VERIFICAR A ESTRUTURA ATUAL
-- =====================================================

-- Verificar estrutura atual da tabela
\d user_profile

-- Verificar dados existentes
SELECT * FROM user_profile LIMIT 5;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

/*
1. Este script adiciona os campos que o código está tentando usar:
   - employee_number: Número de matrícula do funcionário
   - functional_category: Categoria funcional
   - education: Escolaridade/educação

2. Se o campo 'escolaridade' existir, ele será renomeado para 'education'

3. Execute este script no SQL Editor do Supabase antes de testar o sistema

4. Após executar, verifique se os campos foram adicionados corretamente
*/ 