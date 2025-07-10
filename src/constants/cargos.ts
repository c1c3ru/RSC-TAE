
export interface Cargo {
  codigo: string;
  nome: string;
  nivel: string;
  categoria: string;
}

export const CARGOS_TAE: Cargo[] = [
  {
    codigo: 'D101',
    nome: 'Assistente em Administração',
    nivel: 'D',
    categoria: 'Apoio'
  },
  {
    codigo: 'D102',
    nome: 'Tradutor e Intérprete de Linguagem de Sinais',
    nivel: 'D',
    categoria: 'Apoio'
  },
  {
    codigo: 'D103',
    nome: 'Técnico em Assuntos Educacionais',
    nivel: 'D',
    categoria: 'Técnico'
  },
  {
    codigo: 'D201',
    nome: 'Técnico de Laboratório',
    nivel: 'D',
    categoria: 'Técnico'
  },
  {
    codigo: 'D202',
    nome: 'Técnico em Audiovisual',
    nivel: 'D',
    categoria: 'Técnico'
  },
  {
    codigo: 'D203',
    nome: 'Técnico em Contabilidade',
    nivel: 'D',
    categoria: 'Técnico'
  },
  {
    codigo: 'D204',
    nome: 'Técnico em Tecnologia da Informação',
    nivel: 'D',
    categoria: 'Técnico'
  },
  {
    codigo: 'E101',
    nome: 'Analista de Tecnologia da Informação',
    nivel: 'E',
    categoria: 'Superior'
  },
  {
    codigo: 'E102',
    nome: 'Contador',
    nivel: 'E',
    categoria: 'Superior'
  },
  {
    codigo: 'E103',
    nome: 'Pedagogo',
    nivel: 'E',
    categoria: 'Superior'
  },
  {
    codigo: 'E104',
    nome: 'Psicólogo',
    nivel: 'E',
    categoria: 'Superior'
  },
  {
    codigo: 'E105',
    nome: 'Administrador',
    nivel: 'E',
    categoria: 'Superior'
  },
  {
    codigo: 'E106',
    nome: 'Bibliotecário-Documentalista',
    nivel: 'E',
    categoria: 'Superior'
  },
  {
    codigo: 'E107',
    nome: 'Enfermeiro',
    nivel: 'E',
    categoria: 'Superior'
  },
  {
    codigo: 'E108',
    nome: 'Engenheiro',
    nivel: 'E',
    categoria: 'Superior'
  },
  {
    codigo: 'E109',
    nome: 'Jornalista',
    nivel: 'E',
    categoria: 'Superior'
  },
  {
    codigo: 'E110',
    nome: 'Nutricionista',
    nivel: 'E',
    categoria: 'Superior'
  },
  {
    codigo: 'E111',
    nome: 'Assistente Social',
    nivel: 'E',
    categoria: 'Superior'
  }
] as const;

export const getNivelCargo = (codigo: string): string => {
  const cargo = CARGOS_TAE.find(c => c.codigo === codigo);
  return cargo?.nivel || '';
};

export const getCategoriaCargo = (codigo: string): string => {
  const cargo = CARGOS_TAE.find(c => c.codigo === codigo);
  return cargo?.categoria || '';
};

export const getNomeCargo = (codigo: string): string => {
  const cargo = CARGOS_TAE.find(c => c.codigo === codigo);
  return cargo?.nome || '';
};

export const getCargosBynivel = (nivel: string): Cargo[] => {
  return CARGOS_TAE.filter(cargo => cargo.nivel === nivel);
};

export const getCargosByCategoria = (categoria: string): Cargo[] => {
  return CARGOS_TAE.filter(cargo => cargo.categoria === categoria);
};

export const NIVEIS_CARGO = ['D', 'E'] as const;
export const CATEGORIAS_CARGO = ['Apoio', 'Técnico', 'Superior'] as const;

export type NivelCargo = typeof NIVEIS_CARGO[number];
export type CategoriaCargo = typeof CATEGORIAS_CARGO[number];
