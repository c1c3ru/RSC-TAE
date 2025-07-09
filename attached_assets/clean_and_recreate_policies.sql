-- LIMPEZA E RECRIAÇÃO DE POLICIES SUPABASE
-- Execute este script no SQL Editor do Supabase

-- 1. Remover policies duplicadas ou antigas
DROP POLICY IF EXISTS "competences_select_all" ON public.competences;
DROP POLICY IF EXISTS "select_competences" ON public.competences;

DROP POLICY IF EXISTS "select_own_profile" ON public.user_profile;
DROP POLICY IF EXISTS "insert_own_profile" ON public.user_profile;
DROP POLICY IF EXISTS "update_own_profile" ON public.user_profile;
DROP POLICY IF EXISTS "delete_own_profile" ON public.user_profile;
DROP POLICY IF EXISTS "Permitir INSERT do próprio perfil" ON public.user_profile;
DROP POLICY IF EXISTS "Permitir SELECT do próprio perfil" ON public.user_profile;
DROP POLICY IF EXISTS "Permitir UPDATE do próprio perfil" ON public.user_profile;

DROP POLICY IF EXISTS "select_own_rsc" ON public.user_rsc;
DROP POLICY IF EXISTS "insert_own_rsc" ON public.user_rsc;
DROP POLICY IF EXISTS "update_own_rsc" ON public.user_rsc;
DROP POLICY IF EXISTS "delete_own_rsc" ON public.user_rsc;

-- 2. Ativar RLS nas tabelas (caso não esteja ativo)
ALTER TABLE public.competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rsc ENABLE ROW LEVEL SECURITY;

-- 3. Recriar apenas as policies corretas

-- Tabela: competences
CREATE POLICY "select_competences" ON public.competences
  FOR SELECT USING (true);

-- Tabela: user_profile
CREATE POLICY "select_own_profile" ON public.user_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "insert_own_profile" ON public.user_profile
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "update_own_profile" ON public.user_profile
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "delete_own_profile" ON public.user_profile
  FOR DELETE USING (auth.uid() = id);

-- Tabela: user_rsc
CREATE POLICY "select_own_rsc" ON public.user_rsc
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own_rsc" ON public.user_rsc
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_rsc" ON public.user_rsc
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "delete_own_rsc" ON public.user_rsc
  FOR DELETE USING (auth.uid() = user_id); 