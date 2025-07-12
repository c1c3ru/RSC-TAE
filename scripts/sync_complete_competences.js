#!/usr/bin/env node
/* eslint-env node */
// Script para sincronizar completamente o arquivo competencyItems.ts com os dados do banco

import fs from 'fs'
import path from 'path'

// Dados do banco fornecidos pelo usuário
const competencesFromDB = [
  {
    "id": "CAT1-01",
    "category": "Administrativas",
    "title": "Fiscalização de contratos",
    "type": "MONTHS",
    "points_per_unit": "0.10",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "max": 24,
      "min": 1,
      "docs": ["portaria"],
      "integer": true
    }
  },
  {
    "id": "CAT1-02",
    "category": "Administrativas",
    "title": "Gestão de convênios",
    "type": "MONTHS",
    "points_per_unit": "0.20",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 6,
      "docs": ["portaria", "relatorio"],
      "multiple": 6
    }
  },
  {
    "id": "CAT1-03",
    "category": "Administrativas",
    "title": "Comissões de corregedoria",
    "type": "EVENTS",
    "points_per_unit": "2.50",
    "max_points": "100.00",
    "unit": "comissões",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-04",
    "category": "Administrativas",
    "title": "Processos licitatórios",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "processos",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-05",
    "category": "Administrativas",
    "title": "Desenvolvimento institucional",
    "type": "HOURS",
    "points_per_unit": "0.05",
    "max_points": "100.00",
    "unit": "horas",
    "validation_rules": {
      "max": 400,
      "min": 20,
      "docs": ["relatorio"]
    }
  },
  {
    "id": "CAT1-06",
    "category": "Administrativas",
    "title": "Elaboração de editais",
    "type": "EVENTS",
    "points_per_unit": "0.10",
    "max_points": "100.00",
    "unit": "editais",
    "validation_rules": {
      "min": 1,
      "docs": ["edital"]
    }
  },
  {
    "id": "CAT1-07",
    "category": "Administrativas",
    "title": "Elaboração de notas técnicas",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "notas",
    "validation_rules": {
      "min": 1,
      "docs": ["nota"]
    }
  },
  {
    "id": "CAT1-08",
    "category": "Administrativas",
    "title": "Elogio profissional",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "elogios",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-09",
    "category": "Administrativas",
    "title": "Organização de processo seletivo",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "processos",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-10",
    "category": "Administrativas",
    "title": "Participação em comissão de políticas públicas",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "comissões",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-11",
    "category": "Administrativas",
    "title": "Participação em comissões permanentes",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "comissões",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-12",
    "category": "Administrativas",
    "title": "Participação em conselhos profissionais",
    "type": "EVENTS",
    "points_per_unit": "0.50",
    "max_points": "100.00",
    "unit": "conselhos",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-13",
    "category": "Administrativas",
    "title": "Participação em brigadas de incêndio",
    "type": "MONTHS",
    "points_per_unit": "0.05",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 1,
      "docs": ["certificado"]
    }
  },
  {
    "id": "CAT1-14",
    "category": "Administrativas",
    "title": "Ações voluntárias",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "ações",
    "validation_rules": {
      "min": 1,
      "docs": ["certificado"]
    }
  },
  {
    "id": "CAT1-15",
    "category": "Administrativas",
    "title": "Participação em conselhos superiores",
    "type": "EVENTS",
    "points_per_unit": "2.50",
    "max_points": "100.00",
    "unit": "conselhos",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-16",
    "category": "Administrativas",
    "title": "Representação institucional",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "representações",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-17",
    "category": "Administrativas",
    "title": "Coordenação de comissões",
    "type": "EVENTS",
    "points_per_unit": "2.50",
    "max_points": "100.00",
    "unit": "comissões",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-18",
    "category": "Administrativas",
    "title": "Exercício em cargo de direção",
    "type": "MONTHS",
    "points_per_unit": "0.25",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-19",
    "category": "Administrativas",
    "title": "Exercício em função gratificada",
    "type": "MONTHS",
    "points_per_unit": "0.10",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-20",
    "category": "Administrativas",
    "title": "Responsabilidade por setor",
    "type": "MONTHS",
    "points_per_unit": "0.10",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-21",
    "category": "Administrativas",
    "title": "Substituição de função",
    "type": "MONTHS",
    "points_per_unit": "0.25",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT1-22",
    "category": "Administrativas",
    "title": "Participação sindical",
    "type": "EVENTS",
    "points_per_unit": "2.50",
    "max_points": "100.00",
    "unit": "mandatos",
    "validation_rules": {
      "min": 1,
      "docs": ["ata"]
    }
  },
  {
    "id": "CAT2-01",
    "category": "Experiência",
    "title": "Tempo de serviço público",
    "type": "MONTHS",
    "points_per_unit": "0.10",
    "max_points": "120.00",
    "unit": "meses",
    "validation_rules": {
      "min": 12,
      "docs": ["declaracao"],
      "multiple": 12
    }
  },
  {
    "id": "CAT2-02",
    "category": "Experiência",
    "title": "Atuação em órgãos externos",
    "type": "MONTHS",
    "points_per_unit": "0.05",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 6,
      "docs": ["declaracao"]
    }
  },
  {
    "id": "CAT2-03",
    "category": "Experiência",
    "title": "Trabalho em organismos internacionais",
    "type": "YEARS",
    "points_per_unit": "1.50",
    "max_points": "100.00",
    "unit": "anos",
    "validation_rules": {
      "min": 1,
      "docs": ["contrato"]
    }
  },
  {
    "id": "CAT2-04",
    "category": "Experiência",
    "title": "Experiência no Ministério da Educação",
    "type": "MONTHS",
    "points_per_unit": "0.05",
    "max_points": "99.00",
    "unit": "meses",
    "validation_rules": {
      "min": 6,
      "docs": ["declaracao"]
    }
  },
  {
    "id": "CAT2-05",
    "category": "Experiência",
    "title": "Coordenação de equipes",
    "type": "MONTHS",
    "points_per_unit": "0.15",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT2-06",
    "category": "Experiência",
    "title": "Gestão de crises institucionais",
    "type": "EVENTS",
    "points_per_unit": "3.00",
    "max_points": "100.00",
    "unit": "eventos",
    "validation_rules": {
      "min": 1,
      "docs": ["relatorio"]
    }
  },
  {
    "id": "CAT2-07",
    "category": "Experiência",
    "title": "Implementação de políticas públicas",
    "type": "EVENTS",
    "points_per_unit": "2.00",
    "max_points": "100.00",
    "unit": "políticas",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT2-08",
    "category": "Experiência",
    "title": "Participação em escolas de governo",
    "type": "YEARS",
    "points_per_unit": "0.50",
    "max_points": "100.00",
    "unit": "anos",
    "validation_rules": {
      "min": 1,
      "docs": ["certificado"]
    }
  },
  {
    "id": "CAT2-09",
    "category": "Experiência",
    "title": "Atuação em agências reguladoras",
    "type": "YEARS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "anos",
    "validation_rules": {
      "min": 1,
      "docs": ["declaracao"]
    }
  },
  {
    "id": "CAT2-10",
    "category": "Experiência",
    "title": "Consultoria técnica especializada",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "consultorias",
    "validation_rules": {
      "min": 1,
      "docs": ["contrato"]
    }
  },
  {
    "id": "CAT2-11",
    "category": "Experiência",
    "title": "Participação em programas governamentais",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "programas",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT2-12",
    "category": "Experiência",
    "title": "Coordenação de fiscalização de concurso",
    "type": "EVENTS",
    "points_per_unit": "0.50",
    "max_points": "100.00",
    "unit": "concursos",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT2-13",
    "category": "Experiência",
    "title": "Logística de concurso público",
    "type": "EVENTS",
    "points_per_unit": "0.50",
    "max_points": "100.00",
    "unit": "concursos",
    "validation_rules": {
      "min": 1,
      "docs": ["declaracao"]
    }
  },
  {
    "id": "CAT2-14",
    "category": "Experiência",
    "title": "Participação em conselho fiscal",
    "type": "EVENTS",
    "points_per_unit": "2.50",
    "max_points": "100.00",
    "unit": "mandatos",
    "validation_rules": {
      "min": 1,
      "docs": ["ata"]
    }
  },
  {
    "id": "CAT2-15",
    "category": "Experiência",
    "title": "Membro de comissão eleitoral",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "comissoes",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT2-16",
    "category": "Experiência",
    "title": "Jurado em concursos",
    "type": "EVENTS",
    "points_per_unit": "0.50",
    "max_points": "100.00",
    "unit": "concursos",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT2-17",
    "category": "Experiência",
    "title": "Membro de conselho profissional",
    "type": "EVENTS",
    "points_per_unit": "0.50",
    "max_points": "100.00",
    "unit": "mandatos",
    "validation_rules": {
      "min": 1,
      "docs": ["ata"]
    }
  },
  {
    "id": "CAT2-18",
    "category": "Experiência",
    "title": "Supervisão da carreira",
    "type": "YEARS",
    "points_per_unit": "0.25",
    "max_points": "100.00",
    "unit": "anos",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT4-02",
    "category": "Produção Científica",
    "title": "Patente registrada",
    "type": "EVENTS",
    "points_per_unit": "5.00",
    "max_points": "100.00",
    "unit": "patentes",
    "validation_rules": {
      "min": 1,
      "docs": ["certificado"],
      "inpi": true
    }
  },
  {
    "id": "CAT3-02",
    "category": "Formação Complementar",
    "title": "Curso técnico",
    "type": "HOURS",
    "points_per_unit": "0.10",
    "max_points": "100.00",
    "unit": "horas",
    "validation_rules": {
      "min": 40,
      "docs": ["diploma"],
      "certifier": ["SENAI", "SENAC"]
    }
  },
  {
    "id": "CAT3-03",
    "category": "Formação Complementar",
    "title": "Pós-graduação lato sensu",
    "type": "CREDITS",
    "points_per_unit": "0.50",
    "max_points": "100.00",
    "unit": "créditos",
    "validation_rules": {
      "min": 360,
      "docs": ["diploma"]
    }
  },
  {
    "id": "CAT3-04",
    "category": "Formação Complementar",
    "title": "Certificação profissional",
    "type": "HOURS",
    "points_per_unit": "0.15",
    "max_points": "100.00",
    "unit": "horas",
    "validation_rules": {
      "min": 50,
      "docs": ["certificado"]
    }
  },
  {
    "id": "CAT3-06",
    "category": "Formação Complementar",
    "title": "Proficiência em língua estrangeira",
    "type": "EVENTS",
    "points_per_unit": "5.00",
    "max_points": "100.00",
    "unit": "certificações",
    "validation_rules": {
      "min": 1,
      "docs": ["certificado"],
      "tests": ["TOEFL", "IELTS"]
    }
  },
  {
    "id": "CAT3-01",
    "category": "Formação Complementar",
    "title": "Certificação em LIBRAS",
    "type": "HOURS",
    "points_per_unit": "0.20",
    "max_points": "100.00",
    "unit": "horas",
    "validation_rules": {
      "min": 20,
      "docs": ["certificado"],
      "certifier": ["MEC", "INES"]
    }
  },
  {
    "id": "CAT5-01",
    "category": "Eventos",
    "title": "Organização de seminário",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "eventos",
    "validation_rules": {
      "min": 1,
      "docs": ["certificado"]
    }
  },
  {
    "id": "CAT5-02",
    "category": "Eventos",
    "title": "Participação em congresso",
    "type": "HOURS",
    "points_per_unit": "0.05",
    "max_points": "100.00",
    "unit": "horas",
    "validation_rules": {
      "min": 10,
      "docs": ["certificado"]
    }
  },
  {
    "id": "CAT5-03",
    "category": "Eventos",
    "title": "Apresentação de trabalho",
    "type": "EVENTS",
    "points_per_unit": "0.80",
    "max_points": "100.00",
    "unit": "trabalhos",
    "validation_rules": {
      "min": 1,
      "docs": ["programacao"]
    }
  },
  {
    "id": "CAT5-04",
    "category": "Eventos",
    "title": "Coordenação de projeto",
    "type": "MONTHS",
    "points_per_unit": "0.30",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 6,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT5-05",
    "category": "Eventos",
    "title": "Banca examinadora",
    "type": "EVENTS",
    "points_per_unit": "0.50",
    "max_points": "100.00",
    "unit": "bancas",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT5-06",
    "category": "Eventos",
    "title": "Comissão organizadora",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "comissoes",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT5-07",
    "category": "Eventos",
    "title": "Mediação de mesa redonda",
    "type": "EVENTS",
    "points_per_unit": "0.50",
    "max_points": "100.00",
    "unit": "mediacoes",
    "validation_rules": {
      "min": 1,
      "docs": ["programacao"]
    }
  },
  {
    "id": "CAT5-08",
    "category": "Eventos",
    "title": "Ministração de minicurso",
    "type": "HOURS",
    "points_per_unit": "0.10",
    "max_points": "100.00",
    "unit": "horas",
    "validation_rules": {
      "min": 10,
      "docs": ["programacao"]
    }
  },
  {
    "id": "CAT5-09",
    "category": "Eventos",
    "title": "Participação em feira",
    "type": "EVENTS",
    "points_per_unit": "0.20",
    "max_points": "100.00",
    "unit": "feiras",
    "validation_rules": {
      "min": 1,
      "docs": ["certificado"]
    }
  },
  {
    "id": "CAT5-10",
    "category": "Eventos",
    "title": "Organização de mostra cultural",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "mostras",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT5-11",
    "category": "Eventos",
    "title": "Coordenação de implantação de unidade",
    "type": "EVENTS",
    "points_per_unit": "2.50",
    "max_points": "100.00",
    "unit": "unidades",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT5-12",
    "category": "Eventos",
    "title": "Participação em projeto de pesquisa",
    "type": "MONTHS",
    "points_per_unit": "0.20",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 6,
      "docs": ["relatorio"]
    }
  },
  {
    "id": "CAT5-13",
    "category": "Eventos",
    "title": "Desenvolvimento de protótipo",
    "type": "EVENTS",
    "points_per_unit": "2.50",
    "max_points": "100.00",
    "unit": "protótipos",
    "validation_rules": {
      "min": 1,
      "docs": ["relatorio"]
    }
  },
  {
    "id": "CAT5-14",
    "category": "Eventos",
    "title": "Transferência de tecnologia",
    "type": "EVENTS",
    "points_per_unit": "5.00",
    "max_points": "100.00",
    "unit": "contratos",
    "validation_rules": {
      "min": 1,
      "docs": ["contrato"]
    }
  },
  {
    "id": "CAT5-15",
    "category": "Eventos",
    "title": "Projeto pedagógico de curso",
    "type": "EVENTS",
    "points_per_unit": "2.50",
    "max_points": "100.00",
    "unit": "projetos",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT5-16",
    "category": "Eventos",
    "title": "Participação em evento filantrópico",
    "type": "EVENTS",
    "points_per_unit": "0.50",
    "max_points": "100.00",
    "unit": "eventos",
    "validation_rules": {
      "min": 1,
      "docs": ["certificado"]
    }
  },
  {
    "id": "CAT5-17",
    "category": "Eventos",
    "title": "Avaliação de projeto institucional",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "avaliações",
    "validation_rules": {
      "min": 1,
      "docs": ["parecer"]
    }
  },
  {
    "id": "CAT5-18",
    "category": "Eventos",
    "title": "Participação em conselho editorial",
    "type": "EVENTS",
    "points_per_unit": "2.50",
    "max_points": "100.00",
    "unit": "conselhos",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT5-19",
    "category": "Eventos",
    "title": "Organização de competição esportiva",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "competições",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT5-20",
    "category": "Eventos",
    "title": "Coordenação de atividade extensionista",
    "type": "MONTHS",
    "points_per_unit": "0.20",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 6,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT6-01",
    "category": "Ensino",
    "title": "Orientação de estágio",
    "type": "EVENTS",
    "points_per_unit": "0.50",
    "max_points": "100.00",
    "unit": "orientações",
    "validation_rules": {
      "min": 1,
      "docs": ["termo"]
    }
  },
  {
    "id": "CAT6-02",
    "category": "Ensino",
    "title": "Preceptoria em residência",
    "type": "MONTHS",
    "points_per_unit": "0.10",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 6,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT6-03",
    "category": "Ensino",
    "title": "Tutoria acadêmica",
    "type": "HOURS",
    "points_per_unit": "0.02",
    "max_points": "100.00",
    "unit": "horas",
    "validation_rules": {
      "min": 10,
      "docs": ["relatorio"]
    }
  },
  {
    "id": "CAT6-04",
    "category": "Ensino",
    "title": "Elaboração de material didático",
    "type": "EVENTS",
    "points_per_unit": "0.70",
    "max_points": "100.00",
    "unit": "materiais",
    "validation_rules": {
      "min": 1,
      "docs": ["material"]
    }
  },
  {
    "id": "CAT6-05",
    "category": "Ensino",
    "title": "Correção de provas",
    "type": "EVENTS",
    "points_per_unit": "0.10",
    "max_points": "100.00",
    "unit": "provas",
    "validation_rules": {
      "min": 10,
      "docs": ["lista"]
    }
  },
  {
    "id": "CAT6-06",
    "category": "Ensino",
    "title": "Avaliação de curso pelo INEP",
    "type": "EVENTS",
    "points_per_unit": "2.50",
    "max_points": "100.00",
    "unit": "avaliações",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT6-07",
    "category": "Ensino",
    "title": "Elaboração de itens para concurso",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "itens",
    "validation_rules": {
      "min": 5,
      "docs": ["lista"]
    }
  },
  {
    "id": "CAT6-08",
    "category": "Ensino",
    "title": "Orientação de bolsista",
    "type": "MONTHS",
    "points_per_unit": "0.05",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 6,
      "docs": ["termo"]
    }
  },
  {
    "id": "CAT6-09",
    "category": "Ensino",
    "title": "Apoio a preceptoria",
    "type": "MONTHS",
    "points_per_unit": "0.10",
    "max_points": "100.00",
    "unit": "meses",
    "validation_rules": {
      "min": 1,
      "docs": ["declaracao"]
    }
  },
  {
    "id": "CAT4-01",
    "category": "Produção Científica",
    "title": "Artigo científico",
    "type": "EVENTS",
    "points_per_unit": "1.50",
    "max_points": "100.00",
    "unit": "artigos",
    "validation_rules": {
      "min": 1,
      "docs": ["artigo"],
      "issn": true
    }
  },
  {
    "id": "CAT4-03",
    "category": "Produção Científica",
    "title": "Livro publicado",
    "type": "EVENTS",
    "points_per_unit": "3.00",
    "max_points": "100.00",
    "unit": "livros",
    "validation_rules": {
      "min": 1,
      "docs": ["livro"],
      "isbn": true
    }
  },
  {
    "id": "CAT4-04",
    "category": "Produção Científica",
    "title": "Software desenvolvido",
    "type": "EVENTS",
    "points_per_unit": "4.00",
    "max_points": "100.00",
    "unit": "softwares",
    "validation_rules": {
      "min": 1,
      "docs": ["codigo"],
      "repository": true
    }
  },
  {
    "id": "CAT4-05",
    "category": "Produção Científica",
    "title": "Capítulo de livro",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "capítulos",
    "validation_rules": {
      "min": 1,
      "docs": ["livro"],
      "isbn": true
    }
  },
  {
    "id": "CAT4-06",
    "category": "Produção Científica",
    "title": "Projeto gráfico",
    "type": "EVENTS",
    "points_per_unit": "2.00",
    "max_points": "100.00",
    "unit": "projetos",
    "validation_rules": {
      "min": 1,
      "docs": ["projeto"]
    }
  },
  {
    "id": "CAT4-07",
    "category": "Produção Científica",
    "title": "Edição de mídia técnica",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "edições",
    "validation_rules": {
      "min": 1,
      "docs": ["midia"]
    }
  },
  {
    "id": "CAT4-08",
    "category": "Produção Científica",
    "title": "Edição de roteiros",
    "type": "EVENTS",
    "points_per_unit": "0.50",
    "max_points": "100.00",
    "unit": "roteiros",
    "validation_rules": {
      "min": 1,
      "docs": ["roteiro"]
    }
  },
  {
    "id": "CAT4-10",
    "category": "Produção Científica",
    "title": "Liderança de grupo de pesquisa",
    "type": "EVENTS",
    "points_per_unit": "2.50",
    "max_points": "100.00",
    "unit": "grupos",
    "validation_rules": {
      "min": 1,
      "docs": ["portaria"]
    }
  },
  {
    "id": "CAT4-09",
    "category": "Produção Científica",
    "title": "Revisão técnica de publicação",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "revisões",
    "validation_rules": {
      "min": 1,
      "docs": ["publicacao"]
    }
  },
  {
    "id": "CAT4-11",
    "category": "Produção Científica",
    "title": "Avaliação de trabalhos acadêmicos",
    "type": "EVENTS",
    "points_per_unit": "1.00",
    "max_points": "100.00",
    "unit": "avaliações",
    "validation_rules": {
      "min": 1,
      "docs": ["ata"]
    }
  },
  {
    "id": "CAT4-12",
    "category": "Produção Científica",
    "title": "Prêmio profissional",
    "type": "EVENTS",
    "points_per_unit": "2.50",
    "max_points": "100.00",
    "unit": "prêmios",
    "validation_rules": {
      "min": 1,
      "docs": ["diploma"]
    }
  },
  {
    "id": "CAT3-05",
    "category": "Formação Complementar",
    "title": "Disciplinas isoladas de graduação",
    "type": "CREDITS",
    "points_per_unit": "0.30",
    "max_points": "100.00",
    "unit": "créditos",
    "validation_rules": {
      "min": 4,
      "docs": ["historico"]
    }
  },
  {
    "id": "FORM-EXC-01",
    "category": "Formação",
    "title": "Graduação excedente ao cargo",
    "type": "DIPLOMA",
    "points_per_unit": "10.00",
    "max_points": "20.00",
    "unit": "diplomas",
    "validation_rules": {
      "min": 1,
      "docs": ["diploma"]
    }
  },
  {
    "id": "FORM-EXC-02",
    "category": "Formação",
    "title": "Pós-graduação lato sensu excedente ao cargo",
    "type": "DIPLOMA",
    "points_per_unit": "15.00",
    "max_points": "30.00",
    "unit": "diplomas",
    "validation_rules": {
      "min": 1,
      "docs": ["diploma"]
    }
  },
  {
    "id": "FORM-EXC-03",
    "category": "Formação",
    "title": "Mestrado excedente ao cargo",
    "type": "DIPLOMA",
    "points_per_unit": "20.00",
    "max_points": "40.00",
    "unit": "diplomas",
    "validation_rules": {
      "min": 1,
      "docs": ["diploma"]
    }
  },
  {
    "id": "FORM-EXC-04",
    "category": "Formação",
    "title": "Doutorado excedente ao cargo",
    "type": "DIPLOMA",
    "points_per_unit": "25.00",
    "max_points": "50.00",
    "unit": "diplomas",
    "validation_rules": {
      "min": 1,
      "docs": ["diploma"]
    }
  }
]

async function syncCompleteCompetences() {
  console.log('🔄 Sincronizando completamente o arquivo competencyItems.ts...\n')

  try {
    // Criar o novo conteúdo do arquivo
    let fileContent = `import { Competency } from '../context/CompetencyContext';

export const competencyItems: Competency[] = [
`

    // Adicionar cada competência
    competencesFromDB.forEach((comp, index) => {
      fileContent += `  {
    id: '${comp.id}',
    category: '${comp.category}',
    title: '${comp.title}',
    type: '${comp.type}',
    points_per_unit: ${parseFloat(comp.points_per_unit)},
    max_points: ${parseFloat(comp.max_points)},
    unit: '${comp.unit}',
  }${index < competencesFromDB.length - 1 ? ',' : ''}
`
    })

    fileContent += `] as const;

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
    'CAT1': 'Administrativas',
    'CAT2': 'Experiência',
    'CAT3': 'Formação Complementar',
    'CAT4': 'Produção Científica',
    'CAT5': 'Eventos',
    'CAT6': 'Ensino',
    'FORM-EXC': 'Formação',
    'Formação': 'Formação',
    'Administrativas': 'Administrativas',
    'Ensino': 'Ensino',
    'Eventos': 'Eventos',
    'Experiência': 'Experiência',
    'Formação Complementar': 'Formação Complementar',
    'Produção Científica': 'Produção Científica'
  };
  return categoryNames[category] || category;
};

export const getMaxPointsByCategory = (category: string): number => {
  const categoryLimits: Record<string, number> = {
    'CAT1': 60,
    'CAT2': 50,
    'CAT3': 40,
    'CAT4': 30,
    'CAT5': 20,
    'CAT6': 25,
    'FORM-EXC': 30
  };
  
  return categoryLimits[category] || 0;
};
`

    // Salvar o arquivo
    const filePath = path.join(process.cwd(), 'src/data/competencyItems.ts')
    fs.writeFileSync(filePath, fileContent, 'utf8')
    
    console.log('✅ Arquivo competencyItems.ts atualizado com sucesso!')
    console.log(`📊 Total de competências: ${competencesFromDB.length}`)
    
    // Mostrar resumo das categorias
    const categories = [...new Set(competencesFromDB.map(c => c.category))]
    console.log('\n📊 Categorias encontradas:')
    categories.forEach(cat => {
      const count = competencesFromDB.filter(c => c.category === cat).length
      console.log(`   - ${cat}: ${count} competências`)
    })

  } catch (error) {
    console.error('❌ Erro durante a sincronização:', error)
  }
}

syncCompleteCompetences() 