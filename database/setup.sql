


-- Create user_profile table
CREATE TABLE IF NOT EXISTS public.user_profile (
  id UUID NOT NULL,
  email CHARACTER VARYING(255) NOT NULL,
  name CHARACTER VARYING(255) NOT NULL,
  idjob CHARACTER VARYING(255) NULL,
  job CHARACTER VARYING(255) NULL,
  escolaridade CHARACTER VARYING(255) NULL, -- Novo campo para escolaridade
  profile CHARACTER VARYING(50) NULL,
  date_singin TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_pkey PRIMARY KEY (id),
  CONSTRAINT user_email_key UNIQUE (email),
  CONSTRAINT user_name_key UNIQUE (name)
) TABLESPACE pg_default;

-- Create competences table
CREATE TABLE IF NOT EXISTS public.competences (
  id CHARACTER VARYING(50) NOT NULL,
  category CHARACTER VARYING(255) NOT NULL,
  title CHARACTER VARYING(255) NOT NULL,
  type CHARACTER VARYING(50) NOT NULL,
  points_per_unit NUMERIC(5, 2) NOT NULL,
  max_points NUMERIC(5, 2) NOT NULL,
  unit CHARACTER VARYING(50) NOT NULL,
  validation_rules JSONB NULL,
  CONSTRAINT competences_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create user_rsc table
CREATE TABLE IF NOT EXISTS public.user_rsc (
  id BIGSERIAL NOT NULL,
  user_id UUID NOT NULL,
  competence_id CHARACTER VARYING(50) NOT NULL,
  quantity NUMERIC NOT NULL,
  value NUMERIC(10, 2) NOT NULL,
  data_inicio DATE NULL,
  data_fim DATE NULL,
  date_awarded TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_atualizacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT user_rsc_pkey PRIMARY KEY (id),
  CONSTRAINT user_rsc_competence_id_fkey FOREIGN KEY (competence_id) REFERENCES competences (id) ON DELETE CASCADE,
  CONSTRAINT user_rsc_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profile (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_rsc_user_id ON public.user_rsc USING btree (user_id) TABLESPACE pg_default;

-- Enable RLS on tables
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rsc ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profile
CREATE POLICY "Users can view own profile" ON public.user_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profile
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profile
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for competences
CREATE POLICY "Everyone can view competences" ON public.competences
  FOR SELECT USING (true);

-- Create policies for user_rsc
CREATE POLICY "Users can view own rsc records" ON public.user_rsc
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rsc records" ON public.user_rsc
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rsc records" ON public.user_rsc
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rsc records" ON public.user_rsc
  FOR DELETE USING (auth.uid() = user_id);

-- Insert sample competences data
INSERT INTO "public"."competences" ("id", "category", "title", "type", "points_per_unit", "max_points", "unit", "validation_rules") VALUES ('CAT1-01', 'Administrativas', 'Fiscalização de contratos', 'MONTHS', '0.10', '100.00', 'meses', '{"max": 24, "min": 1, "docs": ["portaria"], "integer": true}'), ('CAT1-02', 'Administrativas', 'Gestão de convênios', 'MONTHS', '0.20', '100.00', 'meses', '{"min": 6, "docs": ["portaria", "relatorio"], "multiple": 6}'), ('CAT1-03', 'Administrativas', 'Comissões de corregedoria', 'EVENTS', '2.50', '100.00', 'comissões', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-04', 'Administrativas', 'Processos licitatórios', 'EVENTS', '1.00', '100.00', 'processos', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-05', 'Administrativas', 'Desenvolvimento institucional', 'HOURS', '0.05', '100.00', 'horas', '{"max": 400, "min": 20, "docs": ["relatorio"]}'), ('CAT1-06', 'Administrativas', 'Elaboração de editais', 'EVENTS', '0.10', '100.00', 'editais', '{"min": 1, "docs": ["edital"]}'), ('CAT1-07', 'Administrativas', 'Elaboração de notas técnicas', 'EVENTS', '1.00', '100.00', 'notas', '{"min": 1, "docs": ["nota"]}'), ('CAT1-08', 'Administrativas', 'Elogio profissional', 'EVENTS', '1.00', '100.00', 'elogios', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-09', 'Administrativas', 'Organização de processo seletivo', 'EVENTS', '1.00', '100.00', 'processos', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-10', 'Administrativas', 'Participação em comissão de políticas públicas', 'EVENTS', '1.00', '100.00', 'comissões', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-11', 'Administrativas', 'Participação em comissões permanentes', 'EVENTS', '1.00', '100.00', 'comissões', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-12', 'Administrativas', 'Participação em conselhos profissionais', 'EVENTS', '0.50', '100.00', 'conselhos', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-13', 'Administrativas', 'Participação em brigadas de incêndio', 'MONTHS', '0.05', '100.00', 'meses', '{"min": 1, "docs": ["certificado"]}'), ('CAT1-14', 'Administrativas', 'Ações voluntárias', 'EVENTS', '1.00', '100.00', 'ações', '{"min": 1, "docs": ["certificado"]}'), ('CAT1-15', 'Administrativas', 'Participação em conselhos superiores', 'EVENTS', '2.50', '100.00', 'conselhos', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-16', 'Administrativas', 'Representação institucional', 'EVENTS', '1.00', '100.00', 'representações', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-17', 'Administrativas', 'Coordenação de comissões', 'EVENTS', '2.50', '100.00', 'comissões', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-18', 'Administrativas', 'Exercício em cargo de direção', 'MONTHS', '0.25', '100.00', 'meses', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-19', 'Administrativas', 'Exercício em função gratificada', 'MONTHS', '0.10', '100.00', 'meses', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-20', 'Administrativas', 'Responsabilidade por setor', 'MONTHS', '0.10', '100.00', 'meses', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-21', 'Administrativas', 'Substituição de função', 'MONTHS', '0.25', '100.00', 'meses', '{"min": 1, "docs": ["portaria"]}'), ('CAT1-22', 'Administrativas', 'Participação sindical', 'EVENTS', '2.50', '100.00', 'mandatos', '{"min": 1, "docs": ["ata"]}'), ('CAT2-01', 'Experiência', 'Tempo de serviço público', 'MONTHS', '0.10', '120.00', 'meses', '{"min": 12, "docs": ["declaracao"], "multiple": 12}'), ('CAT2-02', 'Experiência', 'Atuação em órgãos externos', 'MONTHS', '0.05', '100.00', 'meses', '{"min": 6, "docs": ["declaracao"]}'), ('CAT2-03', 'Experiência', 'Trabalho em organismos internacionais', 'YEARS', '1.50', '100.00', 'anos', '{"min": 1, "docs": ["contrato"]}'), ('CAT2-04', 'Experiência', 'Experiência no Ministério da Educação', 'MONTHS', '0.05', '99.00', 'meses', '{"min": 6, "docs": ["declaracao"]}'), ('CAT2-05', 'Experiência', 'Coordenação de equipes', 'MONTHS', '0.15', '100.00', 'meses', '{"min": 1, "docs": ["portaria"]}'), ('CAT2-06', 'Experiência', 'Gestão de crises institucionais', 'EVENTS', '3.00', '100.00', 'eventos', '{"min": 1, "docs": ["relatorio"]}'), ('CAT2-07', 'Experiência', 'Implementação de políticas públicas', 'EVENTS', '2.00', '100.00', 'políticas', '{"min": 1, "docs": ["portaria"]}'), ('CAT2-08', 'Experiência', 'Participação em escolas de governo', 'YEARS', '0.50', '100.00', 'anos', '{"min": 1, "docs": ["certificado"]}'), ('CAT2-09', 'Experiência', 'Atuação em agências reguladoras', 'YEARS', '1.00', '100.00', 'anos', '{"min": 1, "docs": ["declaracao"]}'), ('CAT2-10', 'Experiência', 'Consultoria técnica especializada', 'EVENTS', '1.00', '100.00', 'consultorias', '{"min": 1, "docs": ["contrato"]}'), ('CAT2-11', 'Experiência', 'Participação em programas governamentais', 'EVENTS', '1.00', '100.00', 'programas', '{"min": 1, "docs": ["portaria"]}'), ('CAT2-12', 'Experiência', 'Coordenação de fiscalização de concurso', 'EVENTS', '0.50', '100.00', 'concursos', '{"min": 1, "docs": ["portaria"]}'), ('CAT2-13', 'Experiência', 'Logística de concurso público', 'EVENTS', '0.50', '100.00', 'concursos', '{"min": 1, "docs": ["declaracao"]}'), ('CAT2-14', 'Experiência', 'Participação em conselho fiscal', 'EVENTS', '2.50', '100.00', 'mandatos', '{"min": 1, "docs": ["ata"]}'), ('CAT2-15', 'Experiência', 'Membro de comissão eleitoral', 'EVENTS', '1.00', '100.00', 'comissoes', '{"min": 1, "docs": ["portaria"]}'), ('CAT2-16', 'Experiência', 'Jurado em concursos', 'EVENTS', '0.50', '100.00', 'concursos', '{"min": 1, "docs": ["portaria"]}'), ('CAT2-17', 'Experiência', 'Membro de conselho profissional', 'EVENTS', '0.50', '100.00', 'mandatos', '{"min": 1, "docs": ["ata"]}'), ('CAT2-18', 'Experiência', 'Supervisão da carreira', 'YEARS', '0.25', '100.00', 'anos', '{"min": 1, "docs": ["portaria"]}'), ('CAT3-01', 'Formação', 'Certificação em LIBRAS', 'HOURS', '0.20', '100.00', 'horas', '{"min": 20, "docs": ["certificado"], "certifier": ["MEC", "INES"]}'), ('CAT3-02', 'Formação', 'Curso técnico', 'HOURS', '0.10', '100.00', 'horas', '{"min": 40, "docs": ["diploma"], "certifier": ["SENAI", "SENAC"]}'), ('CAT3-03', 'Formação', 'Pós-graduação lato sensu', 'CREDITS', '0.50', '100.00', 'créditos', '{"min": 360, "docs": ["diploma"]}'), ('CAT3-04', 'Formação', 'Certificação profissional', 'HOURS', '0.15', '100.00', 'horas', '{"min": 50, "docs": ["certificado"]}'), ('CAT3-05', 'Formação', 'Disciplinas isoladas de graduação', 'CREDITS', '0.30', '100.00', 'créditos', '{"min": 4, "docs": ["historico"]}'), ('CAT3-06', 'Formação', 'Proficiência em língua estrangeira', 'EVENTS', '5.00', '100.00', 'certificações', '{"min": 1, "docs": ["certificado"], "tests": ["TOEFL", "IELTS"]}'), ('CAT4-01', 'Produção', 'Artigo científico', 'EVENTS', '1.50', '100.00', 'artigos', '{"min": 1, "docs": ["artigo"], "issn": true}'), ('CAT4-02', 'Produção', 'Patente registrada', 'EVENTS', '5.00', '100.00', 'patentes', '{"min": 1, "docs": ["certificado"], "inpi": true}'), ('CAT4-03', 'Produção', 'Livro publicado', 'EVENTS', '3.00', '100.00', 'livros', '{"min": 1, "docs": ["livro"], "isbn": true}'), ('CAT4-04', 'Produção', 'Software desenvolvido', 'EVENTS', '4.00', '100.00', 'softwares', '{"min": 1, "docs": ["codigo"], "repository": true}'), ('CAT4-05', 'Produção', 'Capítulo de livro', 'EVENTS', '1.00', '100.00', 'capítulos', '{"min": 1, "docs": ["livro"], "isbn": true}'), ('CAT4-06', 'Produção', 'Projeto gráfico', 'EVENTS', '2.00', '100.00', 'projetos', '{"min": 1, "docs": ["projeto"]}'), ('CAT4-07', 'Produção', 'Edição de mídia técnica', 'EVENTS', '1.00', '100.00', 'edições', '{"min": 1, "docs": ["midia"]}'), ('CAT4-08', 'Produção', 'Edição de roteiros', 'EVENTS', '0.50', '100.00', 'roteiros', '{"min": 1, "docs": ["roteiro"]}'), ('CAT4-09', 'Produção', 'Revisão técnica de publicação', 'EVENTS', '1.00', '100.00', 'revisões', '{"min": 1, "docs": ["publicacao"]}'), ('CAT4-10', 'Produção', 'Liderança de grupo de pesquisa', 'EVENTS', '2.50', '100.00', 'grupos', '{"min": 1, "docs": ["portaria"]}'), ('CAT4-11', 'Produção', 'Avaliação de trabalhos acadêmicos', 'EVENTS', '1.00', '100.00', 'avaliações', '{"min": 1, "docs": ["ata"]}'), ('CAT4-12', 'Produção', 'Prêmio profissional', 'EVENTS', '2.50', '100.00', 'prêmios', '{"min": 1, "docs": ["diploma"]}'), ('CAT5-01', 'Eventos', 'Organização de seminário', 'EVENTS', '1.00', '100.00', 'eventos', '{"min": 1, "docs": ["certificado"]}'), ('CAT5-02', 'Eventos', 'Participação em congresso', 'HOURS', '0.05', '100.00', 'horas', '{"min": 10, "docs": ["certificado"]}'), ('CAT5-03', 'Eventos', 'Apresentação de trabalho', 'EVENTS', '0.80', '100.00', 'trabalhos', '{"min": 1, "docs": ["programacao"]}'), ('CAT5-04', 'Eventos', 'Coordenação de projeto', 'MONTHS', '0.30', '100.00', 'meses', '{"min": 6, "docs": ["portaria"]}'), ('CAT5-05', 'Eventos', 'Banca examinadora', 'EVENTS', '0.50', '100.00', 'bancas', '{"min": 1, "docs": ["portaria"]}'), ('CAT5-06', 'Eventos', 'Comissão organizadora', 'EVENTS', '1.00', '100.00', 'comissoes', '{"min": 1, "docs": ["portaria"]}'), ('CAT5-07', 'Eventos', 'Mediação de mesa redonda', 'EVENTS', '0.50', '100.00', 'mediacoes', '{"min": 1, "docs": ["programacao"]}'), ('CAT5-08', 'Eventos', 'Ministração de minicurso', 'HOURS', '0.10', '100.00', 'horas', '{"min": 10, "docs": ["programacao"]}'), ('CAT5-09', 'Eventos', 'Participação em feira', 'EVENTS', '0.20', '100.00', 'feiras', '{"min": 1, "docs": ["certificado"]}'), ('CAT5-10', 'Eventos', 'Organização de mostra cultural', 'EVENTS', '1.00', '100.00', 'mostras', '{"min": 1, "docs": ["portaria"]}'), ('CAT5-11', 'Eventos', 'Coordenação de implantação de unidade', 'EVENTS', '2.50', '100.00', 'unidades', '{"min": 1, "docs": ["portaria"]}'), ('CAT5-12', 'Eventos', 'Participação em projeto de pesquisa', 'MONTHS', '0.20', '100.00', 'meses', '{"min": 6, "docs": ["relatorio"]}'), ('CAT5-13', 'Eventos', 'Desenvolvimento de protótipo', 'EVENTS', '2.50', '100.00', 'protótipos', '{"min": 1, "docs": ["relatorio"]}'), ('CAT5-14', 'Eventos', 'Transferência de tecnologia', 'EVENTS', '5.00', '100.00', 'contratos', '{"min": 1, "docs": ["contrato"]}'), ('CAT5-15', 'Eventos', 'Projeto pedagógico de curso', 'EVENTS', '2.50', '100.00', 'projetos', '{"min": 1, "docs": ["portaria"]}'), ('CAT5-16', 'Eventos', 'Participação em evento filantrópico', 'EVENTS', '0.50', '100.00', 'eventos', '{"min": 1, "docs": ["certificado"]}'), ('CAT5-17', 'Eventos', 'Avaliação de projeto institucional', 'EVENTS', '1.00', '100.00', 'avaliações', '{"min": 1, "docs": ["parecer"]}'), ('CAT5-18', 'Eventos', 'Participação em conselho editorial', 'EVENTS', '2.50', '100.00', 'conselhos', '{"min": 1, "docs": ["portaria"]}'), ('CAT5-19', 'Eventos', 'Organização de competição esportiva', 'EVENTS', '1.00', '100.00', 'competições', '{"min": 1, "docs": ["portaria"]}'), ('CAT5-20', 'Eventos', 'Coordenação de atividade extensionista', 'MONTHS', '0.20', '100.00', 'meses', '{"min": 6, "docs": ["portaria"]}'), ('CAT6-01', 'Ensino', 'Orientação de estágio', 'EVENTS', '0.50', '100.00', 'orientações', '{"min": 1, "docs": ["termo"]}'), ('CAT6-02', 'Ensino', 'Preceptoria em residência', 'MONTHS', '0.10', '100.00', 'meses', '{"min": 6, "docs": ["portaria"]}'), ('CAT6-03', 'Ensino', 'Tutoria acadêmica', 'HOURS', '0.02', '100.00', 'horas', '{"min": 10, "docs": ["relatorio"]}'), ('CAT6-04', 'Ensino', 'Elaboração de material didático', 'EVENTS', '0.70', '100.00', 'materiais', '{"min": 1, "docs": ["material"]}'), ('CAT6-05', 'Ensino', 'Correção de provas', 'EVENTS', '0.10', '100.00', 'provas', '{"min": 10, "docs": ["lista"]}'), ('CAT6-06', 'Ensino', 'Avaliação de curso pelo INEP', 'EVENTS', '2.50', '100.00', 'avaliações', '{"min": 1, "docs": ["portaria"]}'), ('CAT6-07', 'Ensino', 'Elaboração de itens para concurso', 'EVENTS', '1.00', '100.00', 'itens', '{"min": 5, "docs": ["lista"]}'), ('CAT6-08', 'Ensino', 'Orientação de bolsista', 'MONTHS', '0.05', '100.00', 'meses', '{"min": 6, "docs": ["termo"]}'), ('CAT6-09', 'Ensino', 'Apoio a preceptoria', 'MONTHS', '0.10', '100.00', 'meses', '{"min": 1, "docs": ["declaracao"]}')
ON CONFLICT (id) DO NOTHING;

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_user_rsc_updated_at 
  BEFORE UPDATE ON user_rsc 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
