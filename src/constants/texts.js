// Centralização de textos do sistema

export const LABELS = {
  atividade: 'Atividade',
  documento: 'Documento comprobatório',
  quantidade: 'Quantidade',
  dataInicio: 'Data de Início',
  dataFim: 'Data de Fim',
  observacoes: 'Observações',
  registrar: 'Registrar',
  registrarNovaAtividade: 'Registrar Nova Atividade',
  menu: 'Menu',
  dashboard: 'Dashboard',
  registrarAtividade: 'Registrar Atividade',
  sistemaTitulo: 'Sistema de Competências',
  login: 'Login',
  sair: 'Sair',
  selecioneUmaAtividade: 'Selecione uma atividade',
  criterio: 'Critério de Pontuação',
  documentoObrigatorio: 'Documento Obrigatório',
  documentoComprobatorio: 'Documento Comprobatório',
  pontuacaoEstimada: 'Pontuação Estimada',
  pontos: 'pontos',
  informacoesAdicionaisSobreAtividade: 'Informações adicionais sobre a atividade (opcional)',
  descricao: 'Descrição',
  tipoCalculo: 'Tipo de Cálculo',
  unidadeMedida: 'Unidade de Medida',
  valorPonto: 'Valor por Unidade',
  documentosComprobatorios: 'Documentos Comprobatórios',
  // Adicione outros textos conforme necessário
};

// Textos da página de Login
export const LOGIN_TEXTS = {
  titulo: 'Acesse sua conta',
  email: 'E-mail institucional',
  senha: 'Senha',
  entrar: 'Entrar',
  esqueciSenha: 'Esqueci minha senha',
  cadastrar: 'Cadastrar',
  recuperarSenha: 'Recuperar senha',
  voltar: 'Voltar',
  nome: 'Nome completo',
  matricula: 'Matrícula SIAPE',
  cargo: 'Cargo',
  escolaridade: 'Escolaridade',
  confirmarSenha: 'Confirmar senha',
  emailInvalido: 'Formato de email inválido',
  emailNaoEdu: 'Apenas emails com domínio .edu são aceitos',
  preenchaTodosCampos: 'Preencha todos os campos para realizar o cadastro.',
  corrijaEmail: 'Por favor, corrija o email antes de continuar.',
  cadastroSucesso: 'Cadastro realizado com sucesso!',
  erroCadastro: 'Não foi possível concluir o cadastro. Verifique seus dados e tente novamente.',
  erroLogin: 'Credenciais inválidas. Tente novamente.',
  erroRecuperarSenha: 'Erro ao processar a solicitação. Tente novamente.',
  recuperarSenhaInstrucao: 'Digite seu e-mail para recuperar a senha.',
  emailEnviado: 'Se o e-mail estiver correto, você receberá instruções para redefinir sua senha.',
  carregando: 'Carregando...',
  salvando: 'Salvando...',
  loginGoogle: 'Entrar com Google',
};

// Textos da página de Dashboard
export const DASHBOARD_TEXTS = {
  titulo: 'Dashboard',
  progresso: 'Acompanhe seu progresso de competências',
  baixarDocumentacao: 'Baixar Documentação Completa',
  gerandoPDF: 'Gerando PDF...',
  nenhumDocumento: 'Nenhum documento encontrado para download.',
  erroPDF: 'Erro ao gerar o PDF. Tente novamente.',
  totalAtividades: 'Total de Atividades',
  progressoLabel: 'Progresso',
  pontosPorAtividade: 'Pontos por Atividade',
  nenhumaAtividade: 'Nenhuma atividade registrada ainda. Comece adicionando uma!',
  processoAvaliacao: 'Processo de Avaliação:',
  processoAvaliacaoTexto: [
    'Esta documentação será avaliada pela Gestão de Pessoas da sua unidade',
    'após abertura de processo, anexando todos os documentos disponíveis.',
    '',
    'Data de geração: ',
    'Hora: '
  ],
};

// Textos da página de Cadastro de Atividades
export const ACTIVITY_REGISTRATION_TEXTS = {
  titulo: 'Registrar Atividade',
  subtitulo: 'Registre suas atividades acadêmicas e profissionais para acumular pontos no sistema de competências. Cada atividade possui critérios específicos de pontuação baseados em sua relevância e impacto.',
  comoFuncionaTitulo: 'Como funciona o sistema de pontuação?',
  comoFunciona: [
    {
      titulo: 'Critérios de Pontuação',
      texto: 'Cada atividade possui um valor específico por unidade (hora, mês, documentos comprobatórios, etc.)'
    },
    {
      titulo: 'Documentos Obrigatórios',
      texto: 'Todas as atividades requerem documentos comprobatórios para validação'
    },
    {
      titulo: 'Cálculo Automático',
      texto: 'O sistema calcula automaticamente: Quantidade × Pontos por unidade'
    },
    {
      titulo: 'Aprovação Necessária',
      texto: 'Todas as atividades devem passar por análise pela coordenação de pessoas(ou equivalente) na sua unidade antes de serem contabilizadas'
    },
    {
      titulo: 'Requisitos Mínimos por Nível',
      texto: 'Cada nível de classificação possui requisitos mínimos específicos'
    },
  ],
  exemplo: 'Exemplo: Se uma atividade vale 0.5 pontos por mês e você trabalhou 6 meses, você receberá 3 pontos (6 × 0.5).',
  requisitosTitulo: 'Requisitos Mínimos por Nível de Classificação RSC',
  requisitos: [
    {
      nivel: 'RSC I (Nível Superior)',
      itens: [
        'Mínimo de 10 pontos',
        'Mínimo de 2 itens distintos',
        'Escolaridade: Ensino fundamental incompleto',
        'Atividades em diferentes categorias'
      ]
    },
    {
      nivel: 'RSC II (Nível Superior)',
      itens: [
        'Mínimo de 20 pontos',
        'Mínimo de 3 itens distintos',
        'Escolaridade: Ensino fundamental completo',
        'Atividades em diferentes categorias'
      ]
    },
    {
      nivel: 'RSC III (Nível Superior)',
      itens: [
        'Mínimo de 25 pontos',
        'Mínimo de 4 itens distintos',
        'Escolaridade: Ensino médio ou técnico',
        'Atividades em diferentes categorias'
      ]
    },
    {
      nivel: 'RSC IV (Nível Superior)',
      itens: [
        'Mínimo de 30 pontos',
        'Mínimo de 5 itens distintos',
        'Escolaridade: Graduação',
        'Atividades em diferentes categorias'
      ]
    },
    {
      nivel: 'RSC V (Nível Superior)',
      itens: [
        'Mínimo de 52 pontos',
        'Mínimo de 8 itens distintos',
        'Escolaridade: Pós-graduação lato sensu (especialização)',
        'Atividades em diferentes categorias'
      ]
    },
    {
      nivel: 'RSC VI (Nível Superior)',
      itens: [
        'Mínimo de 75 pontos',
        'Mínimo de 12 itens distintos',
        'Escolaridade: Mestrado',
        'Atividades em diferentes categorias'
      ]
    }
  ],
  requisitosImportante: 'Importante: Estes são os requisitos mínimos para cada nível. Você pode registrar mais atividades para aumentar sua pontuação total e melhorar sua classificação.',
  removerFiltro: 'Remover filtro',
  categorias: {
    Administrativas: {
      nome: 'Atividades Administrativas',
      descricao: 'Inclui fiscalização de contratos, participação em comissões e atividades de gestão.'
    },
    Experiência: {
      nome: 'Experiência Profissional',
      descricao: 'Inclui tempo de serviço, cargos e funções ocupadas.'
    },
    Formação: {
      nome: 'Formação Acadêmica',
      descricao: 'Inclui cursos, titulação acadêmica e certificações.'
    },
    'Formação Complementar': {
      nome: 'Formação Complementar',
      descricao: 'Inclui cursos complementares, workshops, etc.'
    },
    'Produção Científica': {
      nome: 'Produção Científica',
      descricao: 'Inclui publicações, patentes e desenvolvimento de sistemas.'
    },
    Eventos: {
      nome: 'Participação em Eventos',
      descricao: 'Inclui organização de eventos e participação em projetos.'
    },
    Ensino: {
      nome: 'Atividades de Ensino',
      descricao: 'Inclui orientações, tutorias e atividades de ensino.'
    },
  },
  filtroResumo: {
    Administrativas: 'Fiscalização, comissões e gestão',
    Experiência: 'Tempo de serviço e funções',
    Formação: 'Cursos e titulação acadêmica',
    'Formação Complementar': 'Cursos complementares, workshops, etc.',
    'Produção Científica': 'Publicações e patentes',
    Eventos: 'Eventos e projetos',
    Ensino: 'Orientações e ensino',
  },
};

// Textos da página de Perfil
export const PROFILE_TEXTS = {
  titulo: 'Meu Perfil',
  nome: 'Nome',
  cargo: 'Cargo',
  escolaridade: 'Escolaridade',
  salvar: 'Salvar Alterações',
  salvando: 'Salvando...',
  sucesso: 'Perfil atualizado com sucesso!',
  erro: 'Erro ao atualizar perfil.',
  voltar: 'Voltar',
  selecione: 'Selecione...',
  ok: 'OK',
}; 