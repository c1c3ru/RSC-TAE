
import { Competency } from '../context/CompetencyContext';

export const competencyItems: Competency[] = [
  // Categoria 1 - Atividades de Ensino
  {
    id: 'CAT1-01',
    category: 'CAT1',
    title: 'Desenvolvimento de material didático ou instrucional',
    type: 'Atividade',
    points_per_unit: 1.20,
    max_points: 12,
    unit: 'material',
    validation_rules: null
  },
  {
    id: 'CAT1-02', 
    category: 'CAT1',
    title: 'Participação em banca de trabalho de conclusão de curso de graduação',
    type: 'Atividade',
    points_per_unit: 1.00,
    max_points: 6,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT1-03',
    category: 'CAT1', 
    title: 'Participação em banca de trabalho de conclusão de curso de pós-graduação stricto sensu',
    type: 'Atividade',
    points_per_unit: 2.50,
    max_points: 4,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT1-04',
    category: 'CAT1',
    title: 'Orientação de trabalho de conclusão de curso de graduação',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'orientação',
    validation_rules: null
  },
  {
    id: 'CAT1-05',
    category: 'CAT1',
    title: 'Co-orientação de trabalho de conclusão de curso de graduação',
    type: 'Atividade',
    points_per_unit: 1.50,
    max_points: 6,
    unit: 'co-orientação',
    validation_rules: null
  },
  {
    id: 'CAT1-06',
    category: 'CAT1',
    title: 'Orientação de trabalho de conclusão de curso de pós-graduação stricto sensu',
    type: 'Atividade',
    points_per_unit: 5.00,
    max_points: 2,
    unit: 'orientação',
    validation_rules: null
  },
  {
    id: 'CAT1-07',
    category: 'CAT1',
    title: 'Co-orientação de trabalho de conclusão de curso de pós-graduação stricto sensu',
    type: 'Atividade',
    points_per_unit: 2.50,
    max_points: 4,
    unit: 'co-orientação',
    validation_rules: null
  },
  {
    id: 'CAT1-08',
    category: 'CAT1',
    title: 'Orientação de bolsista de iniciação científica',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'orientação',
    validation_rules: null
  },
  {
    id: 'CAT1-09',
    category: 'CAT1',
    title: 'Orientação de estagiário',
    type: 'Atividade',
    points_per_unit: 1.00,
    max_points: 10,
    unit: 'orientação',
    validation_rules: null
  },
  {
    id: 'CAT1-10',
    category: 'CAT1',
    title: 'Ministrar aulas em cursos de graduação ou pós-graduação',
    type: 'Atividade',
    points_per_unit: 0.30,
    max_points: 40,
    unit: 'hora-aula',
    validation_rules: null
  },
  {
    id: 'CAT1-11',
    category: 'CAT1',
    title: 'Ministrar palestras, oficinas ou cursos de extensão',
    type: 'Atividade',
    points_per_unit: 0.50,
    max_points: 24,
    unit: 'hora',
    validation_rules: null
  },
  {
    id: 'CAT1-12',
    category: 'CAT1',
    title: 'Tutoria em educação a distância',
    type: 'Atividade',
    points_per_unit: 0.20,
    max_points: 60,
    unit: 'hora',
    validation_rules: null
  },
  {
    id: 'CAT1-13',
    category: 'CAT1',
    title: 'Coordenação de curso de graduação ou pós-graduação',
    type: 'Atividade',
    points_per_unit: 8.00,
    max_points: 1,
    unit: 'coordenação',
    validation_rules: null
  },
  {
    id: 'CAT1-14',
    category: 'CAT1',
    title: 'Vice-coordenação de curso de graduação ou pós-graduação',
    type: 'Atividade',
    points_per_unit: 4.00,
    max_points: 2,
    unit: 'vice-coordenação',
    validation_rules: null
  },
  {
    id: 'CAT1-15',
    category: 'CAT1',
    title: 'Coordenação de área ou núcleo temático',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'coordenação',
    validation_rules: null
  },
  {
    id: 'CAT1-16',
    category: 'CAT1',
    title: 'Supervisão de estágio curricular',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'supervisão',
    validation_rules: null
  },
  {
    id: 'CAT1-17',
    category: 'CAT1',
    title: 'Participação em comissão de elaboração de projeto pedagógico',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT1-18',
    category: 'CAT1',
    title: 'Elaboração de questões para processos seletivos institucionais',
    type: 'Atividade',
    points_per_unit: 0.50,
    max_points: 24,
    unit: 'questão',
    validation_rules: null
  },
  {
    id: 'CAT1-19',
    category: 'CAT1',
    title: 'Correção de provas em processos seletivos institucionais',
    type: 'Atividade',
    points_per_unit: 0.10,
    max_points: 120,
    unit: 'prova',
    validation_rules: null
  },
  {
    id: 'CAT1-20',
    category: 'CAT1',
    title: 'Coordenação de projeto de ensino institucional',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'coordenação',
    validation_rules: null
  },

  // Categoria 2 - Atividades de Pesquisa
  {
    id: 'CAT2-01',
    category: 'CAT2',
    title: 'Publicação de artigo em periódico científico com Qualis A1',
    type: 'Atividade',
    points_per_unit: 10.00,
    max_points: 1,
    unit: 'publicação',
    validation_rules: null
  },
  {
    id: 'CAT2-02',
    category: 'CAT2',
    title: 'Publicação de artigo em periódico científico com Qualis A2',
    type: 'Atividade',
    points_per_unit: 8.00,
    max_points: 1,
    unit: 'publicação',
    validation_rules: null
  },
  {
    id: 'CAT2-03',
    category: 'CAT2',
    title: 'Publicação de artigo em periódico científico com Qualis B1',
    type: 'Atividade',
    points_per_unit: 6.00,
    max_points: 2,
    unit: 'publicação',
    validation_rules: null
  },
  {
    id: 'CAT2-04',
    category: 'CAT2',
    title: 'Publicação de artigo em periódico científico com Qualis B2',
    type: 'Atividade',
    points_per_unit: 4.00,
    max_points: 2,
    unit: 'publicação',
    validation_rules: null
  },
  {
    id: 'CAT2-05',
    category: 'CAT2',
    title: 'Publicação de artigo em periódico científico com Qualis B3',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'publicação',
    validation_rules: null
  },
  {
    id: 'CAT2-06',
    category: 'CAT2',
    title: 'Publicação de artigo em periódico científico com Qualis B4',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'publicação',
    validation_rules: null
  },
  {
    id: 'CAT2-07',
    category: 'CAT2',
    title: 'Publicação de artigo em periódico científico com Qualis B5',
    type: 'Atividade',
    points_per_unit: 1.00,
    max_points: 10,
    unit: 'publicação',
    validation_rules: null
  },
  {
    id: 'CAT2-08',
    category: 'CAT2',
    title: 'Publicação de livro por editora com ISBN',
    type: 'Atividade',
    points_per_unit: 8.00,
    max_points: 1,
    unit: 'publicação',
    validation_rules: null
  },
  {
    id: 'CAT2-09',
    category: 'CAT2',
    title: 'Publicação de capítulo de livro por editora com ISBN',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'publicação',
    validation_rules: null
  },
  {
    id: 'CAT2-10',
    category: 'CAT2',
    title: 'Publicação de trabalho completo em anais de evento científico',
    type: 'Atividade',
    points_per_unit: 1.50,
    max_points: 7,
    unit: 'publicação',
    validation_rules: null
  },
  {
    id: 'CAT2-11',
    category: 'CAT2',
    title: 'Publicação de resumo expandido em anais de evento científico',
    type: 'Atividade',
    points_per_unit: 0.75,
    max_points: 13,
    unit: 'publicação',
    validation_rules: null
  },
  {
    id: 'CAT2-12',
    category: 'CAT2',
    title: 'Publicação de resumo em anais de evento científico',
    type: 'Atividade',
    points_per_unit: 0.50,
    max_points: 20,
    unit: 'publicação',
    validation_rules: null
  },
  {
    id: 'CAT2-13',
    category: 'CAT2',
    title: 'Coordenação de projeto de pesquisa com financiamento externo',
    type: 'Atividade',
    points_per_unit: 5.00,
    max_points: 2,
    unit: 'coordenação',
    validation_rules: null
  },
  {
    id: 'CAT2-14',
    category: 'CAT2',
    title: 'Coordenação de projeto de pesquisa institucional',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'coordenação',
    validation_rules: null
  },
  {
    id: 'CAT2-15',
    category: 'CAT2',
    title: 'Participação em projeto de pesquisa com financiamento externo',
    type: 'Atividade',
    points_per_unit: 2.50,
    max_points: 4,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT2-16',
    category: 'CAT2',
    title: 'Participação em projeto de pesquisa institucional',
    type: 'Atividade',
    points_per_unit: 1.50,
    max_points: 7,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT2-17',
    category: 'CAT2',
    title: 'Registro de patente ou propriedade intelectual',
    type: 'Atividade',
    points_per_unit: 8.00,
    max_points: 1,
    unit: 'registro',
    validation_rules: null
  },
  {
    id: 'CAT2-18',
    category: 'CAT2',
    title: 'Desenvolvimento de produto tecnológico',
    type: 'Atividade',
    points_per_unit: 4.00,
    max_points: 2,
    unit: 'produto',
    validation_rules: null
  },
  {
    id: 'CAT2-19',
    category: 'CAT2',
    title: 'Organização de evento científico nacional',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'organização',
    validation_rules: null
  },
  {
    id: 'CAT2-20',
    category: 'CAT2',
    title: 'Organização de evento científico regional/local',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'organização',
    validation_rules: null
  },

  // Categoria 3 - Atividades de Extensão
  {
    id: 'CAT3-01',
    category: 'CAT3',
    title: 'Coordenação de programa de extensão',
    type: 'Atividade',
    points_per_unit: 5.00,
    max_points: 2,
    unit: 'coordenação',
    validation_rules: null
  },
  {
    id: 'CAT3-02',
    category: 'CAT3',
    title: 'Coordenação de projeto de extensão',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'coordenação',
    validation_rules: null
  },
  {
    id: 'CAT3-03',
    category: 'CAT3',
    title: 'Participação em programa de extensão',
    type: 'Atividade',
    points_per_unit: 2.50,
    max_points: 4,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT3-04',
    category: 'CAT3',
    title: 'Participação em projeto de extensão',
    type: 'Atividade',
    points_per_unit: 1.50,
    max_points: 7,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT3-05',
    category: 'CAT3',
    title: 'Coordenação de curso de extensão',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'coordenação',
    validation_rules: null
  },
  {
    id: 'CAT3-06',
    category: 'CAT3',
    title: 'Docência em curso de extensão (mínimo 20h)',
    type: 'Atividade',
    points_per_unit: 1.50,
    max_points: 7,
    unit: 'curso',
    validation_rules: null
  },
  {
    id: 'CAT3-07',
    category: 'CAT3',
    title: 'Participação em prestação de serviços à comunidade',
    type: 'Atividade',
    points_per_unit: 1.00,
    max_points: 10,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT3-08',
    category: 'CAT3',
    title: 'Organização de evento de extensão',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'organização',
    validation_rules: null
  },
  {
    id: 'CAT3-09',
    category: 'CAT3',
    title: 'Participação em atividade de extensão como palestrante',
    type: 'Atividade',
    points_per_unit: 1.00,
    max_points: 10,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT3-10',
    category: 'CAT3',
    title: 'Coordenação de visita técnica',
    type: 'Atividade',
    points_per_unit: 0.50,
    max_points: 20,
    unit: 'coordenação',
    validation_rules: null
  },
  {
    id: 'CAT3-11',
    category: 'CAT3',
    title: 'Acompanhamento de visita técnica',
    type: 'Atividade',
    points_per_unit: 0.25,
    max_points: 40,
    unit: 'acompanhamento',
    validation_rules: null
  },
  {
    id: 'CAT3-12',
    category: 'CAT3',
    title: 'Participação em comissão de avaliação de projetos de extensão',
    type: 'Atividade',
    points_per_unit: 1.00,
    max_points: 10,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT3-13',
    category: 'CAT3',
    title: 'Coordenação de atividade de divulgação científica',
    type: 'Atividade',
    points_per_unit: 1.50,
    max_points: 7,
    unit: 'coordenação',
    validation_rules: null
  },
  {
    id: 'CAT3-14',
    category: 'CAT3',
    title: 'Participação em atividade de divulgação científica',
    type: 'Atividade',
    points_per_unit: 0.75,
    max_points: 13,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT3-15',
    category: 'CAT3',
    title: 'Publicação de material de divulgação científica',
    type: 'Atividade',
    points_per_unit: 1.00,
    max_points: 10,
    unit: 'publicação',
    validation_rules: null
  },

  // Categoria 4 - Atividades de Gestão e Representação
  {
    id: 'CAT4-01',
    category: 'CAT4',
    title: 'Exercício de cargo de direção superior (Reitor, Vice-Reitor, Pró-Reitor)',
    type: 'Atividade',
    points_per_unit: 15.00,
    max_points: 1,
    unit: 'exercício',
    validation_rules: null
  },
  {
    id: 'CAT4-02',
    category: 'CAT4',
    title: 'Exercício de cargo de direção (Diretor de Campus, Diretor de Departamento)',
    type: 'Atividade',
    points_per_unit: 10.00,
    max_points: 1,
    unit: 'exercício',
    validation_rules: null
  },
  {
    id: 'CAT4-03',
    category: 'CAT4',
    title: 'Exercício de função gratificada (CD-3, CD-4, FG-1, FG-2)',
    type: 'Atividade',
    points_per_unit: 5.00,
    max_points: 2,
    unit: 'exercício',
    validation_rules: null
  },
  {
    id: 'CAT4-04',
    category: 'CAT4',
    title: 'Exercício de função gratificada (FG-3, FG-4, FG-5)',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'exercício',
    validation_rules: null
  },
  {
    id: 'CAT4-05',
    category: 'CAT4',
    title: 'Participação em comissão institucional permanente',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT4-06',
    category: 'CAT4',
    title: 'Participação em comissão institucional temporária',
    type: 'Atividade',
    points_per_unit: 1.00,
    max_points: 10,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT4-07',
    category: 'CAT4',
    title: 'Coordenação de comissão institucional',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'coordenação',
    validation_rules: null
  },
  {
    id: 'CAT4-08',
    category: 'CAT4',
    title: 'Representação institucional em órgãos externos',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'representação',
    validation_rules: null
  },
  {
    id: 'CAT4-09',
    category: 'CAT4',
    title: 'Participação em banca de concurso público',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT4-10',
    category: 'CAT4',
    title: 'Presidência de banca de concurso público',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'presidência',
    validation_rules: null
  },
  {
    id: 'CAT4-11',
    category: 'CAT4',
    title: 'Participação em processo de avaliação institucional externa',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT4-12',
    category: 'CAT4',
    title: 'Coordenação de processo de avaliação institucional interna',
    type: 'Atividade',
    points_per_unit: 4.00,
    max_points: 2,
    unit: 'coordenação',
    validation_rules: null
  },
  {
    id: 'CAT4-13',
    category: 'CAT4',
    title: 'Participação em processo de avaliação institucional interna',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT4-14',
    category: 'CAT4',
    title: 'Elaboração de relatório técnico institucional',
    type: 'Atividade',
    points_per_unit: 1.50,
    max_points: 7,
    unit: 'elaboração',
    validation_rules: null
  },
  {
    id: 'CAT4-15',
    category: 'CAT4',
    title: 'Coordenação de processo seletivo institucional',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'coordenação',
    validation_rules: null
  },

  // Categoria 5 - Atividades de Capacitação e Qualificação
  {
    id: 'CAT5-01',
    category: 'CAT5',
    title: 'Conclusão de curso de doutorado',
    type: 'Atividade',
    points_per_unit: 15.00,
    max_points: 1,
    unit: 'conclusão',
    validation_rules: null
  },
  {
    id: 'CAT5-02',
    category: 'CAT5',
    title: 'Conclusão de curso de mestrado',
    type: 'Atividade',
    points_per_unit: 10.00,
    max_points: 1,
    unit: 'conclusão',
    validation_rules: null
  },
  {
    id: 'CAT5-03',
    category: 'CAT5',
    title: 'Conclusão de curso de especialização (mínimo 360h)',
    type: 'Atividade',
    points_per_unit: 5.00,
    max_points: 2,
    unit: 'conclusão',
    validation_rules: null
  },
  {
    id: 'CAT5-04',
    category: 'CAT5',
    title: 'Participação em curso de capacitação (20h a 40h)',
    type: 'Atividade',
    points_per_unit: 0.50,
    max_points: 20,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT5-05',
    category: 'CAT5',
    title: 'Participação em curso de capacitação (40h a 80h)',
    type: 'Atividade',
    points_per_unit: 1.00,
    max_points: 10,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT5-06',
    category: 'CAT5',
    title: 'Participação em curso de capacitação (80h a 120h)',
    type: 'Atividade',
    points_per_unit: 1.50,
    max_points: 7,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT5-07',
    category: 'CAT5',
    title: 'Participação em curso de capacitação (acima de 120h)',
    type: 'Atividade',
    points_per_unit: 2.50,
    max_points: 4,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT5-08',
    category: 'CAT5',
    title: 'Participação em evento científico nacional',
    type: 'Atividade',
    points_per_unit: 1.00,
    max_points: 10,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT5-09',
    category: 'CAT5',
    title: 'Participação em evento científico internacional',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT5-10',
    category: 'CAT5',
    title: 'Participação em evento científico regional/local',
    type: 'Atividade',
    points_per_unit: 0.50,
    max_points: 20,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT5-11',
    category: 'CAT5',
    title: 'Obtenção de certificação profissional',
    type: 'Atividade',
    points_per_unit: 3.00,
    max_points: 3,
    unit: 'obtenção',
    validation_rules: null
  },
  {
    id: 'CAT5-12',
    category: 'CAT5',
    title: 'Participação em grupo de estudos institucional',
    type: 'Atividade',
    points_per_unit: 1.00,
    max_points: 10,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT5-13',
    category: 'CAT5',
    title: 'Coordenação de grupo de estudos institucional',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'coordenação',
    validation_rules: null
  },
  {
    id: 'CAT5-14',
    category: 'CAT5',
    title: 'Participação em missão de trabalho ou intercâmbio',
    type: 'Atividade',
    points_per_unit: 2.50,
    max_points: 4,
    unit: 'participação',
    validation_rules: null
  },
  {
    id: 'CAT5-15',
    category: 'CAT5',
    title: 'Aprendizado de idioma estrangeiro com certificação',
    type: 'Atividade',
    points_per_unit: 2.00,
    max_points: 5,
    unit: 'aprendizado',
    validation_rules: null
  }
] as const;

export const getCompetencyById = (id: string): Competency | undefined => {
  return competencyItems.find(item => item.id === id);
};

export const getCompetenciesByCategory = (category: string): Competency[] => {
  return competencyItems.filter(item => item.category === category);
};

export const getAllCategories = (): string[] => {
  const categories = new Set(competencyItems.map(item => item.category));
  return Array.from(categories).sort();
};

export const getCategoryName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    'CAT1': 'Atividades de Ensino',
    'CAT2': 'Atividades de Pesquisa', 
    'CAT3': 'Atividades de Extensão',
    'CAT4': 'Atividades de Gestão e Representação',
    'CAT5': 'Atividades de Capacitação e Qualificação'
  };
  
  return categoryNames[category] || category;
};

export const getMaxPointsByCategory = (category: string): number => {
  const categoryLimits: Record<string, number> = {
    'CAT1': 60,
    'CAT2': 50,
    'CAT3': 40,
    'CAT4': 30,
    'CAT5': 20
  };
  
  return categoryLimits[category] || 0;
};
