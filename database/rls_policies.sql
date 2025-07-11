-- =====================================================
-- POLÍTICAS RLS (Row Level Security) PARA O SISTEMA RSC TAE
-- =====================================================

-- 1. HABILITAR RLS NAS TABELAS
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rsc ENABLE ROW LEVEL SECURITY;
ALTER TABLE competences ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS PARA TABELA user_profile

-- Política para SELECT (usuário pode ler apenas seu próprio perfil)
CREATE POLICY select_own_profile ON user_profile
    FOR SELECT
    USING (auth.uid() = id);

-- Política para INSERT (usuário pode inserir apenas seu próprio perfil)
CREATE POLICY insert_own_profile ON user_profile
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Política para UPDATE (usuário pode atualizar apenas seu próprio perfil)
CREATE POLICY update_own_profile ON user_profile
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Política para DELETE (usuário pode deletar apenas seu próprio perfil)
CREATE POLICY delete_own_profile ON user_profile
    FOR DELETE
    USING (auth.uid() = id);

-- 3. POLÍTICAS PARA TABELA user_rsc

-- Política para SELECT (usuário pode ler apenas suas próprias atividades)
CREATE POLICY select_own_rsc ON user_rsc
    FOR SELECT
    USING (auth.uid() = user_id);

-- Política para INSERT (usuário pode inserir apenas suas próprias atividades)
CREATE POLICY insert_own_rsc ON user_rsc
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE (usuário pode atualizar apenas suas próprias atividades)
CREATE POLICY update_own_rsc ON user_rsc
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Política para DELETE (usuário pode deletar apenas suas próprias atividades)
CREATE POLICY delete_own_rsc ON user_rsc
    FOR DELETE
    USING (auth.uid() = user_id);

-- 4. POLÍTICAS PARA TABELA competences

-- Política para SELECT (todos os usuários autenticados podem ler competências)
CREATE POLICY select_competences ON competences
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- 5. POLÍTICAS ALTERNATIVAS (se necessário)

-- Política mais permissiva para competências (permite acesso público)
-- CREATE POLICY select_competences_public ON competences
--     FOR SELECT
--     USING (true);

-- Política para administradores (se necessário)
-- CREATE POLICY admin_all ON user_profile
--     FOR ALL
--     USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- =====================================================
-- COMANDOS PARA VERIFICAR POLÍTICAS
-- =====================================================

-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('user_profile', 'user_rsc', 'competences');

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('user_profile', 'user_rsc', 'competences')
ORDER BY tablename, policyname;

-- =====================================================
-- COMANDOS PARA REMOVER POLÍTICAS (se necessário)
-- =====================================================

-- Remover políticas da tabela user_profile
-- DROP POLICY IF EXISTS select_own_profile ON user_profile;
-- DROP POLICY IF EXISTS insert_own_profile ON user_profile;
-- DROP POLICY IF EXISTS update_own_profile ON user_profile;
-- DROP POLICY IF EXISTS delete_own_profile ON user_profile;

-- Remover políticas da tabela user_rsc
-- DROP POLICY IF EXISTS select_own_rsc ON user_rsc;
-- DROP POLICY IF EXISTS insert_own_rsc ON user_rsc;
-- DROP POLICY IF EXISTS update_own_rsc ON user_rsc;
-- DROP POLICY IF EXISTS delete_own_rsc ON user_rsc;

-- Remover políticas da tabela competences
-- DROP POLICY IF EXISTS select_competences ON competences;

-- =====================================================
-- TESTES DE POLÍTICAS
-- =====================================================

-- Teste 1: Verificar se usuário pode ler seu próprio perfil
-- SELECT * FROM user_profile WHERE id = auth.uid();

-- Teste 2: Verificar se usuário pode inserir seu próprio perfil
-- INSERT INTO user_profile (id, email, name) VALUES (auth.uid(), 'test@test.com', 'Test User');

-- Teste 3: Verificar se usuário pode ler suas atividades
-- SELECT * FROM user_rsc WHERE user_id = auth.uid();

-- Teste 4: Verificar se usuário pode inserir atividade
-- INSERT INTO user_rsc (user_id, competence_id, points, description, date) 
-- VALUES (auth.uid(), 'CAT1', 10, 'Teste', NOW());

-- Teste 5: Verificar se usuário pode ler competências
-- SELECT * FROM competences LIMIT 5;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

/*
1. Estas políticas garantem que:
   - Usuários só podem acessar seus próprios dados
   - Usuários podem ler todas as competências
   - A segurança é mantida no nível da aplicação

2. Para aplicar estas políticas:
   - Execute este script no SQL Editor do Supabase
   - Verifique se não há conflitos com políticas existentes
   - Teste as operações após aplicar as políticas

3. Se houver problemas:
   - Verifique se o RLS está habilitado nas tabelas
   - Confirme se as políticas foram criadas corretamente
   - Teste com o componente RLSTest no frontend

4. Para desenvolvimento:
   - Pode ser necessário desabilitar RLS temporariamente
   - Use o componente RLSTest para diagnosticar problemas
   - Verifique os logs do Supabase para erros detalhados
*/ 