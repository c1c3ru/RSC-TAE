
import { CompetencyItem } from '../context/CompetencyContext';

export const competencyItems: CompetencyItem[] = [
  // Categoria 1 - Atividades de Ensino
  {
    id: 'CAT1-01',
    category: 'CAT1',
    description: 'Desenvolvimento de material didático ou instrucional',
    value: 1.20,
    maxQuantity: 12,
    unit: 'material'
  },
  {
    id: 'CAT1-02', 
    category: 'CAT1',
    description: 'Participação em banca de trabalho de conclusão de curso de graduação',
    value: 1.00,
    maxQuantity: 6,
    unit: 'participação'
  },
  {
    id: 'CAT1-03',
    category: 'CAT1', 
    description: 'Participação em banca de trabalho de conclusão de curso de pós-graduação stricto sensu',
    value: 2.50,
    maxQuantity: 4,
    unit: 'participação'
  },
  {
    id: 'CAT1-04',
    category: 'CAT1',
    description: 'Orientação de trabalho de conclusão de curso de graduação',
    value: 3.00,
    maxQuantity: 3,
    unit: 'orientação'
  },
  {
    id: 'CAT1-05',
    category: 'CAT1',
    description: 'Co-orientação de trabalho de conclusão de curso de graduação',
    value: 1.50,
    maxQuantity: 6,
    unit: 'co-orientação'
  },
  {
    id: 'CAT1-06',
    category: 'CAT1',
    description: 'Orientação de trabalho de conclusão de curso de pós-graduação stricto sensu',
    value: 5.00,
    maxQuantity: 2,
    unit: 'orientação'
  },
  {
    id: 'CAT1-07',
    category: 'CAT1',
    description: 'Co-orientação de trabalho de conclusão de curso de pós-graduação stricto sensu',
    value: 2.50,
    maxQuantity: 4,
    unit: 'co-orientação'
  },
  {
    id: 'CAT1-08',
    category: 'CAT1',
    description: 'Orientação de bolsista de iniciação científica',
    value: 2.00,
    maxQuantity: 5,
    unit: 'orientação'
  },
  {
    id: 'CAT1-09',
    category: 'CAT1',
    description: 'Orientação de estagiário',
    value: 1.00,
    maxQuantity: 10,
    unit: 'orientação'
  },
  {
    id: 'CAT1-10',
    category: 'CAT1',
    description: 'Ministrar aulas em cursos de graduação ou pós-graduação',
    value: 0.30,
    maxQuantity: 40,
    unit: 'hora-aula'
  },
  {
    id: 'CAT1-11',
    category: 'CAT1',
    description: 'Ministrar palestras, oficinas ou cursos de extensão',
    value: 0.50,
    maxQuantity: 24,
    unit: 'hora'
  },
  {
    id: 'CAT1-12',
    category: 'CAT1',
    description: 'Tutoria em educação a distância',
    value: 0.20,
    maxQuantity: 60,
    unit: 'hora'
  },
  {
    id: 'CAT1-13',
    category: 'CAT1',
    description: 'Coordenação de curso de graduação ou pós-graduação',
    value: 8.00,
    maxQuantity: 1,
    unit: 'coordenação'
  },
  {
    id: 'CAT1-14',
    category: 'CAT1',
    description: 'Vice-coordenação de curso de graduação ou pós-graduação',
    value: 4.00,
    maxQuantity: 2,
    unit: 'vice-coordenação'
  },
  {
    id: 'CAT1-15',
    category: 'CAT1',
    description: 'Coordenação de área ou núcleo temático',
    value: 3.00,
    maxQuantity: 3,
    unit: 'coordenação'
  },
  {
    id: 'CAT1-16',
    category: 'CAT1',
    description: 'Supervisão de estágio curricular',
    value: 2.00,
    maxQuantity: 5,
    unit: 'supervisão'
  },
  {
    id: 'CAT1-17',
    category: 'CAT1',
    description: 'Participação em comissão de elaboração de projeto pedagógico',
    value: 2.00,
    maxQuantity: 5,
    unit: 'participação'
  },
  {
    id: 'CAT1-18',
    category: 'CAT1',
    description: 'Elaboração de questões para processos seletivos institucionais',
    value: 0.50,
    maxQuantity: 24,
    unit: 'questão'
  },
  {
    id: 'CAT1-19',
    category: 'CAT1',
    description: 'Correção de provas em processos seletivos institucionais',
    value: 0.10,
    maxQuantity: 120,
    unit: 'prova'
  },
  {
    id: 'CAT1-20',
    category: 'CAT1',
    description: 'Coordenação de projeto de ensino institucional',
    value: 3.00,
    maxQuantity: 3,
    unit: 'coordenação'
  },

  // Categoria 2 - Atividades de Pesquisa
  {
    id: 'CAT2-01',
    category: 'CAT2',
    description: 'Publicação de artigo em periódico científico com Qualis A1',
    value: 10.00,
    maxQuantity: 1,
    unit: 'publicação'
  },
  {
    id: 'CAT2-02',
    category: 'CAT2',
    description: 'Publicação de artigo em periódico científico com Qualis A2',
    value: 8.00,
    maxQuantity: 1,
    unit: 'publicação'
  },
  {
    id: 'CAT2-03',
    category: 'CAT2',
    description: 'Publicação de artigo em periódico científico com Qualis B1',
    value: 6.00,
    maxQuantity: 2,
    unit: 'publicação'
  },
  {
    id: 'CAT2-04',
    category: 'CAT2',
    description: 'Publicação de artigo em periódico científico com Qualis B2',
    value: 4.00,
    maxQuantity: 2,
    unit: 'publicação'
  },
  {
    id: 'CAT2-05',
    category: 'CAT2',
    description: 'Publicação de artigo em periódico científico com Qualis B3',
    value: 3.00,
    maxQuantity: 3,
    unit: 'publicação'
  },
  {
    id: 'CAT2-06',
    category: 'CAT2',
    description: 'Publicação de artigo em periódico científico com Qualis B4',
    value: 2.00,
    maxQuantity: 5,
    unit: 'publicação'
  },
  {
    id: 'CAT2-07',
    category: 'CAT2',
    description: 'Publicação de artigo em periódico científico com Qualis B5',
    value: 1.00,
    maxQuantity: 10,
    unit: 'publicação'
  },
  {
    id: 'CAT2-08',
    category: 'CAT2',
    description: 'Publicação de livro por editora com ISBN',
    value: 8.00,
    maxQuantity: 1,
    unit: 'publicação'
  },
  {
    id: 'CAT2-09',
    category: 'CAT2',
    description: 'Publicação de capítulo de livro por editora com ISBN',
    value: 3.00,
    maxQuantity: 3,
    unit: 'publicação'
  },
  {
    id: 'CAT2-10',
    category: 'CAT2',
    description: 'Publicação de trabalho completo em anais de evento científico',
    value: 1.50,
    maxQuantity: 7,
    unit: 'publicação'
  },
  {
    id: 'CAT2-11',
    category: 'CAT2',
    description: 'Publicação de resumo expandido em anais de evento científico',
    value: 0.75,
    maxQuantity: 13,
    unit: 'publicação'
  },
  {
    id: 'CAT2-12',
    category: 'CAT2',
    description: 'Publicação de resumo em anais de evento científico',
    value: 0.50,
    maxQuantity: 20,
    unit: 'publicação'
  },
  {
    id: 'CAT2-13',
    category: 'CAT2',
    description: 'Coordenação de projeto de pesquisa com financiamento externo',
    value: 5.00,
    maxQuantity: 2,
    unit: 'coordenação'
  },
  {
    id: 'CAT2-14',
    category: 'CAT2',
    description: 'Coordenação de projeto de pesquisa institucional',
    value: 3.00,
    maxQuantity: 3,
    unit: 'coordenação'
  },
  {
    id: 'CAT2-15',
    category: 'CAT2',
    description: 'Participação em projeto de pesquisa com financiamento externo',
    value: 2.50,
    maxQuantity: 4,
    unit: 'participação'
  },
  {
    id: 'CAT2-16',
    category: 'CAT2',
    description: 'Participação em projeto de pesquisa institucional',
    value: 1.50,
    maxQuantity: 7,
    unit: 'participação'
  },
  {
    id: 'CAT2-17',
    category: 'CAT2',
    description: 'Registro de patente ou propriedade intelectual',
    value: 8.00,
    maxQuantity: 1,
    unit: 'registro'
  },
  {
    id: 'CAT2-18',
    category: 'CAT2',
    description: 'Desenvolvimento de produto tecnológico',
    value: 4.00,
    maxQuantity: 2,
    unit: 'produto'
  },
  {
    id: 'CAT2-19',
    category: 'CAT2',
    description: 'Organização de evento científico nacional',
    value: 3.00,
    maxQuantity: 3,
    unit: 'organização'
  },
  {
    id: 'CAT2-20',
    category: 'CAT2',
    description: 'Organização de evento científico regional/local',
    value: 2.00,
    maxQuantity: 5,
    unit: 'organização'
  },

  // Categoria 3 - Atividades de Extensão
  {
    id: 'CAT3-01',
    category: 'CAT3',
    description: 'Coordenação de programa de extensão',
    value: 5.00,
    maxQuantity: 2,
    unit: 'coordenação'
  },
  {
    id: 'CAT3-02',
    category: 'CAT3',
    description: 'Coordenação de projeto de extensão',
    value: 3.00,
    maxQuantity: 3,
    unit: 'coordenação'
  },
  {
    id: 'CAT3-03',
    category: 'CAT3',
    description: 'Participação em programa de extensão',
    value: 2.50,
    maxQuantity: 4,
    unit: 'participação'
  },
  {
    id: 'CAT3-04',
    category: 'CAT3',
    description: 'Participação em projeto de extensão',
    value: 1.50,
    maxQuantity: 7,
    unit: 'participação'
  },
  {
    id: 'CAT3-05',
    category: 'CAT3',
    description: 'Coordenação de curso de extensão',
    value: 2.00,
    maxQuantity: 5,
    unit: 'coordenação'
  },
  {
    id: 'CAT3-06',
    category: 'CAT3',
    description: 'Docência em curso de extensão (mínimo 20h)',
    value: 1.50,
    maxQuantity: 7,
    unit: 'curso'
  },
  {
    id: 'CAT3-07',
    category: 'CAT3',
    description: 'Participação em prestação de serviços à comunidade',
    value: 1.00,
    maxQuantity: 10,
    unit: 'participação'
  },
  {
    id: 'CAT3-08',
    category: 'CAT3',
    description: 'Organização de evento de extensão',
    value: 2.00,
    maxQuantity: 5,
    unit: 'organização'
  },
  {
    id: 'CAT3-09',
    category: 'CAT3',
    description: 'Participação em atividade de extensão como palestrante',
    value: 1.00,
    maxQuantity: 10,
    unit: 'participação'
  },
  {
    id: 'CAT3-10',
    category: 'CAT3',
    description: 'Coordenação de visita técnica',
    value: 0.50,
    maxQuantity: 20,
    unit: 'coordenação'
  },
  {
    id: 'CAT3-11',
    category: 'CAT3',
    description: 'Acompanhamento de visita técnica',
    value: 0.25,
    maxQuantity: 40,
    unit: 'acompanhamento'
  },
  {
    id: 'CAT3-12',
    category: 'CAT3',
    description: 'Participação em comissão de avaliação de projetos de extensão',
    value: 1.00,
    maxQuantity: 10,
    unit: 'participação'
  },
  {
    id: 'CAT3-13',
    category: 'CAT3',
    description: 'Coordenação de atividade de divulgação científica',
    value: 1.50,
    maxQuantity: 7,
    unit: 'coordenação'
  },
  {
    id: 'CAT3-14',
    category: 'CAT3',
    description: 'Participação em atividade de divulgação científica',
    value: 0.75,
    maxQuantity: 13,
    unit: 'participação'
  },
  {
    id: 'CAT3-15',
    category: 'CAT3',
    description: 'Publicação de material de divulgação científica',
    value: 1.00,
    maxQuantity: 10,
    unit: 'publicação'
  },

  // Categoria 4 - Atividades de Gestão e Representação
  {
    id: 'CAT4-01',
    category: 'CAT4',
    description: 'Exercício de cargo de direção superior (Reitor, Vice-Reitor, Pró-Reitor)',
    value: 15.00,
    maxQuantity: 1,
    unit: 'exercício'
  },
  {
    id: 'CAT4-02',
    category: 'CAT4',
    description: 'Exercício de cargo de direção (Diretor de Campus, Diretor de Departamento)',
    value: 10.00,
    maxQuantity: 1,
    unit: 'exercício'
  },
  {
    id: 'CAT4-03',
    category: 'CAT4',
    description: 'Exercício de função gratificada (CD-3, CD-4, FG-1, FG-2)',
    value: 5.00,
    maxQuantity: 2,
    unit: 'exercício'
  },
  {
    id: 'CAT4-04',
    category: 'CAT4',
    description: 'Exercício de função gratificada (FG-3, FG-4, FG-5)',
    value: 3.00,
    maxQuantity: 3,
    unit: 'exercício'
  },
  {
    id: 'CAT4-05',
    category: 'CAT4',
    description: 'Participação em comissão institucional permanente',
    value: 2.00,
    maxQuantity: 5,
    unit: 'participação'
  },
  {
    id: 'CAT4-06',
    category: 'CAT4',
    description: 'Participação em comissão institucional temporária',
    value: 1.00,
    maxQuantity: 10,
    unit: 'participação'
  },
  {
    id: 'CAT4-07',
    category: 'CAT4',
    description: 'Coordenação de comissão institucional',
    value: 3.00,
    maxQuantity: 3,
    unit: 'coordenação'
  },
  {
    id: 'CAT4-08',
    category: 'CAT4',
    description: 'Representação institucional em órgãos externos',
    value: 2.00,
    maxQuantity: 5,
    unit: 'representação'
  },
  {
    id: 'CAT4-09',
    category: 'CAT4',
    description: 'Participação em banca de concurso público',
    value: 2.00,
    maxQuantity: 5,
    unit: 'participação'
  },
  {
    id: 'CAT4-10',
    category: 'CAT4',
    description: 'Presidência de banca de concurso público',
    value: 3.00,
    maxQuantity: 3,
    unit: 'presidência'
  },
  {
    id: 'CAT4-11',
    category: 'CAT4',
    description: 'Participação em processo de avaliação institucional externa',
    value: 3.00,
    maxQuantity: 3,
    unit: 'participação'
  },
  {
    id: 'CAT4-12',
    category: 'CAT4',
    description: 'Coordenação de processo de avaliação institucional interna',
    value: 4.00,
    maxQuantity: 2,
    unit: 'coordenação'
  },
  {
    id: 'CAT4-13',
    category: 'CAT4',
    description: 'Participação em processo de avaliação institucional interna',
    value: 2.00,
    maxQuantity: 5,
    unit: 'participação'
  },
  {
    id: 'CAT4-14',
    category: 'CAT4',
    description: 'Elaboração de relatório técnico institucional',
    value: 1.50,
    maxQuantity: 7,
    unit: 'elaboração'
  },
  {
    id: 'CAT4-15',
    category: 'CAT4',
    description: 'Coordenação de processo seletivo institucional',
    value: 3.00,
    maxQuantity: 3,
    unit: 'coordenação'
  },

  // Categoria 5 - Atividades de Capacitação e Qualificação
  {
    id: 'CAT5-01',
    category: 'CAT5',
    description: 'Conclusão de curso de doutorado',
    value: 15.00,
    maxQuantity: 1,
    unit: 'conclusão'
  },
  {
    id: 'CAT5-02',
    category: 'CAT5',
    description: 'Conclusão de curso de mestrado',
    value: 10.00,
    maxQuantity: 1,
    unit: 'conclusão'
  },
  {
    id: 'CAT5-03',
    category: 'CAT5',
    description: 'Conclusão de curso de especialização (mínimo 360h)',
    value: 5.00,
    maxQuantity: 2,
    unit: 'conclusão'
  },
  {
    id: 'CAT5-04',
    category: 'CAT5',
    description: 'Participação em curso de capacitação (20h a 40h)',
    value: 0.50,
    maxQuantity: 20,
    unit: 'participação'
  },
  {
    id: 'CAT5-05',
    category: 'CAT5',
    description: 'Participação em curso de capacitação (40h a 80h)',
    value: 1.00,
    maxQuantity: 10,
    unit: 'participação'
  },
  {
    id: 'CAT5-06',
    category: 'CAT5',
    description: 'Participação em curso de capacitação (80h a 120h)',
    value: 1.50,
    maxQuantity: 7,
    unit: 'participação'
  },
  {
    id: 'CAT5-07',
    category: 'CAT5',
    description: 'Participação em curso de capacitação (acima de 120h)',
    value: 2.50,
    maxQuantity: 4,
    unit: 'participação'
  },
  {
    id: 'CAT5-08',
    category: 'CAT5',
    description: 'Participação em evento científico nacional',
    value: 1.00,
    maxQuantity: 10,
    unit: 'participação'
  },
  {
    id: 'CAT5-09',
    category: 'CAT5',
    description: 'Participação em evento científico internacional',
    value: 2.00,
    maxQuantity: 5,
    unit: 'participação'
  },
  {
    id: 'CAT5-10',
    category: 'CAT5',
    description: 'Participação em evento científico regional/local',
    value: 0.50,
    maxQuantity: 20,
    unit: 'participação'
  },
  {
    id: 'CAT5-11',
    category: 'CAT5',
    description: 'Obtenção de certificação profissional',
    value: 3.00,
    maxQuantity: 3,
    unit: 'obtenção'
  },
  {
    id: 'CAT5-12',
    category: 'CAT5',
    description: 'Participação em grupo de estudos institucional',
    value: 1.00,
    maxQuantity: 10,
    unit: 'participação'
  },
  {
    id: 'CAT5-13',
    category: 'CAT5',
    description: 'Coordenação de grupo de estudos institucional',
    value: 2.00,
    maxQuantity: 5,
    unit: 'coordenação'
  },
  {
    id: 'CAT5-14',
    category: 'CAT5',
    description: 'Participação em missão de trabalho ou intercâmbio',
    value: 2.50,
    maxQuantity: 4,
    unit: 'participação'
  },
  {
    id: 'CAT5-15',
    category: 'CAT5',
    description: 'Aprendizado de idioma estrangeiro com certificação',
    value: 2.00,
    maxQuantity: 5,
    unit: 'aprendizado'
  }
] as const;

export const getCompetencyById = (id: string): CompetencyItem | undefined => {
  return competencyItems.find(item => item.id === id);
};

export const getCompetenciesByCategory = (category: string): CompetencyItem[] => {
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
