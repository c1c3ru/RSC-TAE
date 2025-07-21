export interface Cargo {
    codigo: string;
    nome: string;
    nivel: string;
    categoria: string;
}

export const CARGOS_TAE: Cargo[] = [
    // Nível E (Superior)
    {
        codigo: 'E001',
        nome: 'Administrador',
        nivel: 'E',
        categoria: 'Superior'
    },
    {
        codigo: 'E002',
        nome: 'Analista de Tecnologia da Informação',
        nivel: 'E',
        categoria: 'Superior'
    },
    {
        codigo: 'E003',
        nome: 'Arquiteto e Urbanista',
        nivel: 'E',
        categoria: 'Superior'
    },
    {
        codigo: 'E004',
        nome: 'Arquivista',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E005',
        nome: 'Assistente Social',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E006',
        nome: 'Auditor',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E007',
        nome: 'Bibliotecário-Documentalista',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E008',
        nome: 'Contador',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E009',
        nome: 'Enfermeiro',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E010',
        nome: 'Engenheiro (Agrônomo)',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E011',
        nome: 'Engenheiro (Civil)',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E012',
        nome: 'Engenheiro (Elétrica)',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E013',
        nome: 'Engenheiro (Mecânica)',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E014',
        nome: 'Engenheiro (Segurança do Trabalho)',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E015',
        nome: 'Fisioterapeuta',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E016',
        nome: 'Jornalista',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E017',
        nome: 'Médico (Clínica Geral)',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E018',
        nome: 'Médico (Psiquiatria)',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E019',
        nome: 'Médico-Veterinário',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E020',
        nome: 'Nutricionista',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E021',
        nome: 'Odontólogo',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E022',
        nome: 'Pedagogo',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E023',
        nome: 'Programador Visual',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E024',
        nome: 'Psicólogo',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E025',
        nome: 'Relações Públicas',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E026',
        nome: 'Secretário Executivo',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E027',
        nome: 'Técnico em Assuntos Educacionais',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E028',
        nome: 'Tecnólogo (Áreas diversas)',
        nivel: 'E',
        categoria: 'Superior'
    }, {
        codigo: 'E029',
        nome: 'Zootecnista',
        nivel: 'E',
        categoria: 'Superior'
    },

    // Nível D (Técnico)
    {
        codigo: 'D001',
        nome: 'Assistente em Administração',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D002',
        nome: 'Mestre de Edificações e Infraestrutura',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D003',
        nome: 'Técnico de Laboratório (Agroindústria)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D004',
        nome: 'Técnico de Laboratório (Agropecuária)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D005',
        nome: 'Técnico de Laboratório (Aquicultura)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D006',
        nome: 'Técnico de Laboratório (Biologia)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D007',
        nome: 'Técnico de Laboratório (Construção Naval)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D008',
        nome: 'Técnico de Laboratório (Edificações)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D009',
        nome: 'Técnico de Laboratório (Eletrotécnica)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D010',
        nome: 'Técnico de Laboratório (Física)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D011',
        nome: 'Técnico de Laboratório (Informática)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D012',
        nome: 'Técnico de Laboratório (Mecânica)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D013',
        nome: 'Técnico de Laboratório (Química)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D014',
        nome: 'Técnico de Laboratório (Saneamento)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D015',
        nome: 'Técnico de Laboratório (Outras Áreas)',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D016',
        nome: 'Técnico de Tecnologia da Informação',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D017',
        nome: 'Técnico em Agropecuária',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D018',
        nome: 'Técnico em Alimentos e Laticínios',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D019',
        nome: 'Técnico em Arquivo',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D020',
        nome: 'Técnico em Audiovisual',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D021',
        nome: 'Técnico em Contabilidade',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D022',
        nome: 'Técnico em Edificações',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D023',
        nome: 'Técnico em Eletrotécnica',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D024',
        nome: 'Técnico em Enfermagem',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D025',
        nome: 'Técnico em Mecânica',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D026',
        nome: 'Técnico em Secretariado',
        nivel: 'D',
        categoria: 'Técnico'
    }, {
        codigo: 'D027',
        nome: 'Tradutor e Intérprete de Linguagem de Sinais (LIBRAS)',
        nivel: 'D',
        categoria: 'Técnico'
    },

    // Nível C (Apoio)
    {
        codigo: 'C001',
        nome: 'Assistente de Aluno',
        nivel: 'C',
        categoria: 'Apoio'
    }, {
        codigo: 'C002',
        nome: 'Auxiliar de Biblioteca',
        nivel: 'C',
        categoria: 'Apoio'
    }, {
        codigo: 'C003',
        nome: 'Auxiliar em Administração',
        nivel: 'C',
        categoria: 'Apoio'
    },
] as const;

export const getNivelCargo = (codigo : string) : string => {
    const cargo = CARGOS_TAE.find(c => c.codigo === codigo);
    return cargo ?. nivel || '';
};

export const getCategoriaCargo = (codigo : string) : string => {
    const cargo = CARGOS_TAE.find(c => c.codigo === codigo);
    return cargo ?. categoria || '';
};

export const getNomeCargo = (codigo : string) : string => {
    const cargo = CARGOS_TAE.find(c => c.codigo === codigo);
    return cargo ?. nome || '';
};

export const getCargosBynivel = (nivel : string) : Cargo[] => {
    return CARGOS_TAE.filter(cargo => cargo.nivel === nivel);
};

export const getCargosByCategoria = (categoria : string) : Cargo[] => {
    return CARGOS_TAE.filter(cargo => cargo.categoria === categoria);
};

export const NIVEIS_CARGO = ['C', 'D', 'E'] as const;
export const CATEGORIAS_CARGO = ['Apoio', 'Técnico', 'Superior'] as const;

export type NivelCargo = typeof NIVEIS_CARGO[number];
export type CategoriaCargo = typeof CATEGORIAS_CARGO[number];

