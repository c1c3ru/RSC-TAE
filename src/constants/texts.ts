
export const LOGIN_TEXTS = {
  titulo: 'Sistema RSC - IFCE',
  subtitulo: 'Reconhecimento de Saberes e Competências',
  emailPlaceholder: 'Email institucional (@*.edu)',
  senhaPlaceholder: 'Senha',
  botaoEntrar: 'Entrar',
  botaoGoogle: 'Entrar com Google',
  emailInvalido: 'Por favor, digite um email válido',
  emailNaoEdu: 'Por favor, use um email institucional (.edu)',
  senhaObrigatoria: 'A senha é obrigatória',
  erroLogin: 'Erro ao fazer login. Verifique suas credenciais.',
  carregando: 'Carregando...',
  nomeCompleto: 'Nome completo',
  joaoSilva: 'João Silva',
  emailInstitucional: 'Email institucional',
  seuEmailInstituicaoEduBr: 'seuemail@instituicao.edu.br',
  apenasEmailsComDominioEduSaoAceitosParaValidacaoInstitucional: 'Apenas emails com domínio .edu são aceitos para validação institucional.',
  senha: 'Senha',
  matricula: 'Matrícula',
} as const;

export const DASHBOARD_TEXTS = {
  titulo: 'Dashboard',
  subtitulo: 'Visão geral das suas atividades RSC',
  totalPontos: 'Total de Pontos',
  totalAtividades: 'Total de Atividades',
  atividadesMes: 'Atividades Este Mês',
  distribuicaoCategoria: 'Distribuição por Categoria',
  atividadesRecentes: 'Atividades Recentes',
  nenhumaAtividade: 'Nenhuma atividade cadastrada ainda.',
  pontos: 'pontos',
  atividades: 'atividades',
  esteMes: 'este mês',
} as const;

export const ACTIVITY_TEXTS = {
  titulo: 'Cadastro de Atividades',
  subtitulo: 'Registre suas atividades de Reconhecimento de Saberes e Competências',
  novaAtividade: 'Cadastrar Nova Atividade',
  competencia: 'Competência',
  selecioneCompetencia: 'Selecione uma competência',
  quantidade: 'Quantidade',
  dataInicio: 'Data de Início',
  dataFim: 'Data de Fim',
  descricao: 'Descrição (Opcional)',
  descricaoPlaceholder: 'Descreva a atividade realizada...',
  resumoPontuacao: 'Resumo da Pontuação',
  botaoCadastrar: 'Cadastrar Atividade',
  cadastrando: 'Cadastrando...',
  sucessoCadastro: 'Atividade cadastrada com sucesso!',
  erroCadastro: 'Erro ao cadastrar atividade',
  atividadesCadastradas: 'Atividades Cadastradas',
  totalPontos: 'Total de pontos',
  competenciaColuna: 'Competência',
  quantidadeColuna: 'Quantidade',
  valorUnitario: 'Valor Unitário',
  total: 'Total',
  periodo: 'Período',
  dataCadastro: 'Data Cadastro',
  carregando: 'Carregando...',
  erroCarregar: 'Erro ao carregar atividades',
} as const;

export const PROFILE_TEXTS = {
  titulo: 'Perfil do Usuário',
  subtitulo: 'Gerencie suas informações pessoais',
  email: 'Email',
  emailNaoAlteravel: 'O email não pode ser alterado',
  nomeCompleto: 'Nome Completo',
  nomeCompltoPlaceholder: 'Digite seu nome completo',
  ultimaAtualizacao: 'Última atualização',
  salvarAlteracoes: 'Salvar Alterações',
  salvando: 'Salvando...',
  sucessoSalvar: 'Perfil atualizado com sucesso!',
  erroSalvar: 'Erro ao salvar perfil',
  erroCarregar: 'Erro ao carregar perfil',
} as const;

export const NAVIGATION_TEXTS = {
  dashboard: 'Dashboard',
  cadastrarAtividade: 'Cadastrar Atividade',
  perfil: 'Perfil',
  sair: 'Sair',
  sistemaRSC: 'Sistema RSC',
} as const;

export const COMMON_TEXTS = {
  erro: 'Erro',
  sucesso: 'Sucesso',
  carregando: 'Carregando...',
  salvar: 'Salvar',
  cancelar: 'Cancelar',
  confirmar: 'Confirmar',
  voltar: 'Voltar',
  proximo: 'Próximo',
  anterior: 'Anterior',
  sim: 'Sim',
  nao: 'Não',
  ok: 'OK',
  fechar: 'Fechar',
} as const;

export const ERROR_MESSAGES = {
  usuarioNaoAutenticado: 'Usuário não autenticado',
  erroDesconhecido: 'Erro desconhecido',
  campoObrigatorio: 'Este campo é obrigatório',
  emailInvalido: 'Email inválido',
  senhaMinima: 'A senha deve ter pelo menos 6 caracteres',
  confirmarSenha: 'As senhas não coincidem',
  arquivoMuitoGrande: 'Arquivo muito grande',
  tipoArquivoInvalido: 'Tipo de arquivo inválido',
  conexaoFalhou: 'Falha na conexão com o servidor',
  permissaoNegada: 'Permissão negada',
} as const;

export const SUCCESS_MESSAGES = {
  dadosSalvos: 'Dados salvos com sucesso!',
  cadastroRealizado: 'Cadastro realizado com sucesso!',
  loginRealizado: 'Login realizado com sucesso!',
  logoutRealizado: 'Logout realizado com sucesso!',
  perfilAtualizado: 'Perfil atualizado com sucesso!',
  atividadeCadastrada: 'Atividade cadastrada com sucesso!',
  atividadeAtualizada: 'Atividade atualizada com sucesso!',
  atividadeRemovida: 'Atividade removida com sucesso!',
} as const;

export const ESCOLARIDADES = [
  'Ensino Fundamental Incompleto',
  'Ensino Fundamental Completo',
  'Ensino Médio Incompleto',
  'Ensino Médio Completo',
  'Técnico',
  'Tecnólogo',
  'Graduação',
  'Pós-graduação',
  'Mestrado',
  'Doutorado',
  'Outro'
] as const;

export const PROCESS_STEPS_TEXTS = {
  titulo: 'Etapas do Processo RSC-TAE',
  etapas: {
    cadastro: {
      titulo: 'Cadastro e Perfil',
      descricao: 'Criar conta e completar perfil com dados pessoais',
      detalhes: [
        'Cadastro com email institucional',
        'Preenchimento de dados pessoais',
        'Confirmação de email',
        'Configuração inicial do perfil'
      ]
    },
    registro: {
      titulo: 'Registro de Atividades',
      descricao: 'Cadastrar atividades acadêmicas e profissionais',
      detalhes: [
        'Seleção de categoria de atividade',
        'Escolha da competência específica',
        'Preenchimento de dados da atividade',
        'Upload de documentos comprobatórios',
        'Cálculo automático de pontuação'
      ]
    },
    classificacao: {
      titulo: 'Classificação Final',
      descricao: 'Receber classificação baseada na pontuação total',
      detalhes: [
        'Cálculo da pontuação final',
        'Verificação de requisitos mínimos',
        'Determinação do nível de classificação',
        'Emissão do certificado RSC-TAE'
      ]
    }
  },
  status: {
    concluido: 'Concluído',
    emAndamento: 'Em andamento',
    pendente: 'Pendente'
  },
  progresso: {
    atividadesRegistradas: 'atividade(s) registrada(s)',
    totalPontos: 'Total de pontos'
  },
  dicas: {
    titulo: '💡 Dicas Importantes',
    itens: [
      'Mantenha seus documentos organizados para facilitar o upload',
      'Registre atividades assim que forem concluídas',
      'Verifique os requisitos mínimos para cada nível',
      'O processo pode levar algumas semanas para aprovação'
    ]
  }
} as const;
