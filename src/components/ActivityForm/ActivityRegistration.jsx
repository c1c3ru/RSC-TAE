import React, { useState, useEffect } from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import { useAuth } from '../../context/AuthContext';
import DocumentUploader from './DocumentUploader';
import { LABELS } from '../../constants/texts';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { useLottie } from 'lottie-react';
import saveAnimation from '../../assets/lottie/save_profile_animation.json';

const ActivityRegistration = ({ categoryFilter }) => {
  const { competencyItems, registerActivity } = useCompetency();
  const [formData, setFormData] = useState({
    itemCompetenciaId: '',
    quantidade: 1,
    dataInicio: '',
    dataFim: '',
    observacoes: ''
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [documentError, setDocumentError] = useState('');
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);

  // Configuração da animação de salvamento
  const { View: SaveAnimationView } = useLottie({
    animationData: saveAnimation,
    loop: true,
    autoplay: true
  });

  // Group competency items by category (usar string)
  const groupedItems = competencyItems.reduce((acc, item) => {
    const category = item.category || 'Administrativas';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Ajustar categoryNames para usar as mesmas strings do banco
  const categoryNames = {
    'Administrativas': 'Atividades Administrativas',
    'Experiência': 'Experiência Profissional',
    'Formação': 'Formação Acadêmica',
    'Formação Complementar': 'Formação Complementar',
    'Produção Científica': 'Produção Científica',
    'Eventos': 'Participação em Eventos',
    'Ensino': 'Atividades de Ensino',

  };



  useEffect(() => {
    if (formData.itemCompetenciaId) {
      const item = competencyItems.find(item => item.id === formData.itemCompetenciaId);
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
  }, [formData.itemCompetenciaId, competencyItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentsChange = (newDocs) => {
    setDocuments(newDocs);
    setDocumentError('');
  };

  // Corrigir validação de documentos para o novo formato
  const validateDocuments = () => {
    if (!documents.length) {
      setDocumentError('É obrigatório anexar o documento comprobatório.');
      return false;
    }
    setDocumentError('');
    return true;
  };

  const calculatePoints = () => {
    if (!selectedItem || !formData.quantidade) return 0;

    const calculatedPoints = parseFloat(formData.quantidade) * selectedItem.valorPonto;
    return calculatedPoints;
  };

  // Informações sobre requisitos mínimos por nível
  const getRequisitosMinimos = () => {
    return {
      'Nível E (Superior)': {
        descricao: 'Nível de Classificação E (Nível Superior)',
        requisitos: [
          'Mínimo de 3 atividades em diferentes categorias',
          'Pelo menos 1 atividade de Produção Científica',
          'Pelo menos 1 atividade de Formação Acadêmica',
          'Total mínimo de 15 pontos'
        ]
      },
      'Nível D (Médio/Técnico)': {
        descricao: 'Nível de Classificação D (Nível Médio/Técnico)',
        requisitos: [
          'Mínimo de 2 atividades em diferentes categorias',
          'Pelo menos 1 atividade de Formação Acadêmica ou Complementar',
          'Total mínimo de 10 pontos'
        ]
      },
      'Nível C (Médio)': {
        descricao: 'Nível de Classificação C (Nível Médio)',
        requisitos: [
          'Mínimo de 1 atividade em qualquer categoria',
          'Total mínimo de 5 pontos'
        ]
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDocuments()) return;
    if (!selectedItem) return;

    setLoading(true);
    try {
      await registerActivity({
        itemCompetenciaId: formData.itemCompetenciaId,
        quantidade: parseFloat(formData.quantidade),
        dataInicio: formData.dataInicio || null,
        dataFim: formData.dataFim || null,
        observacoes: formData.observacoes,
        documentosComprobatorios: documents // Adiciona os documentos ao registro
      });

      setSuccess(true);
      setFormData({
        itemCompetenciaId: '',
        quantidade: 1,
        dataInicio: '',
        dataFim: '',
        observacoes: ''
      });
      setDocuments([]); // Limpa os documentos após o registro

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);

      // Show save animation
      setShowSaveAnimation(true);
      setTimeout(() => setShowSaveAnimation(false), 3000);
    } catch (error) {
      console.error('Error registering activity:', error);
      alert('Erro ao registrar atividade. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar PDF com documentos
  const handleDownloadDocuments = async () => {
    if (!documents.length) {
      alert('Nenhum documento anexado para gerar o PDF.');
      return;
    }

    setDownloadingPDF(true);
    try {
      const pdf = new jsPDF();
      
      // Configurações iniciais
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Documentação para Gestão de Pessoas', 20, 20);
      
      // Informações da atividade
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Dados da Atividade:', 20, 40);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Atividade: ${selectedItem?.titulo || 'N/A'}`, 20, 50);
      pdf.text(`Quantidade: ${formData.quantidade} ${selectedItem?.unidadeMedida || 'unidades'}`, 20, 60);
      pdf.text(`Pontuação Estimada: ${calculatePoints().toFixed(2)} pontos`, 20, 70);
      
      if (formData.dataInicio) {
        pdf.text(`Data de Início: ${formData.dataInicio}`, 20, 80);
      }
      if (formData.dataFim) {
        pdf.text(`Data de Fim: ${formData.dataFim}`, 20, 90);
      }
      if (formData.observacoes) {
        pdf.text(`Observações: ${formData.observacoes}`, 20, 100);
      }
      
      // Critérios e documentos necessários
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Critérios e Documentação:', 20, 120);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Critério: ${selectedItem?.criterio || 'N/A'}`, 20, 130);
      pdf.text(`Documentos Necessários: ${selectedItem?.documentosComprobatorios || 'N/A'}`, 20, 140);
      
      // Lista de documentos anexados
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Documentos Anexados:', 20, 160);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      documents.forEach((doc, index) => {
        const yPosition = 170 + (index * 10);
        if (yPosition < 280) { // Evita sair da página
          pdf.text(`${index + 1}. ${doc.name || 'Documento'}`, 20, yPosition);
        }
      });
      
      // Informações sobre o processo
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Processo de Avaliação:', 20, 220);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const processText = [
        'Esta atividade será avaliada pela Gestão de Pessoas da sua unidade',
        'após abertura de processo, anexando todos os documentos disponíveis.',
        '',
        'Data de geração: ' + new Date().toLocaleDateString('pt-BR'),
        'Hora: ' + new Date().toLocaleTimeString('pt-BR')
      ];
      
      processText.forEach((line, index) => {
        const yPosition = 230 + (index * 10);
        if (yPosition < 280) {
          pdf.text(line, 20, yPosition);
        }
      });
      
      // Salvar o PDF
      const fileName = `atividade_${selectedItem?.titulo?.replace(/[^a-zA-Z0-9]/g, '_') || 'documentacao'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  // Filtrar categorias a exibir no select
  const categoriasParaMostrar = categoryFilter ? [categoryFilter] : Object.keys(groupedItems);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{LABELS.registrarNovaAtividade}</h2>

      {/* Animação de salvamento */}
      {showSaveAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <SaveAnimationView />
          </div>
        </div>
      )}

      {/* Feedback de sucesso melhorado */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg animate-fadeIn">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold">Atividade registrada com sucesso!</h3>
              <p className="text-sm mt-1">Sua atividade foi enviada para análise e aparecerá no dashboard após aprovação.</p>
            </div>
          </div>
        </div>
      )}

      {documentError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md animate-fadeIn">
          {documentError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção de atividade */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {LABELS.atividade}
          </label>
          <select
            name="itemCompetenciaId"
            value={formData.itemCompetenciaId}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">{LABELS.selecioneUmaAtividade}</option>
            {categoriasParaMostrar.map(cat => (
              groupedItems[cat] && groupedItems[cat].length > 0 && (
                <optgroup key={cat} label={categoryNames[cat] || cat}>
                  {groupedItems[cat].map(item => (
                    <option key={item.id} value={item.id}>{item.titulo}</option>
                  ))}
                </optgroup>
              )
            ))}
          </select>
        </div>

        {/* Exibe detalhes do item selecionado */}
        {selectedItem && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Detalhes da Atividade - Anexo II
            </h3>
            
            {/* Descrição da atividade */}
            {selectedItem.descricao && (
              <div className="mb-3 p-3 bg-blue-100 rounded-md">
                <h4 className="font-medium text-blue-800 mb-1">Descrição:</h4>
                <p className="text-sm text-blue-700">{selectedItem.descricao}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {/* Critérios de pontuação */}
              <div className="space-y-2">
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-800">Critério de Pontuação:</h4>
                    <p className="text-sm text-blue-700">{selectedItem.criterio}</p>
                  </div>
                </div>

                {/* Tipo de cálculo e unidade */}
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-800">Tipo de Cálculo:</h4>
                    <p className="text-sm text-blue-700">
                      {selectedItem.tipoCalculo === 'tempo' ? 'Baseado em tempo' : 'Baseado em quantidade'}
                    </p>
                  </div>
                </div>

                {/* Unidade de medida */}
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-800">Unidade de Medida:</h4>
                    <p className="text-sm text-blue-700">
                      {selectedItem.unidadeMedida === 'meses' && 'Meses'}
                      {selectedItem.unidadeMedida === 'anos' && 'Anos'}
                      {selectedItem.unidadeMedida === 'dias' && 'Dias'}
                      {selectedItem.unidadeMedida === 'horas' && 'Horas'}
                      {selectedItem.unidadeMedida === 'portarias' && 'Portarias'}
                      {selectedItem.unidadeMedida === 'processos' && 'Processos'}
                      {selectedItem.unidadeMedida === 'soluções' && 'Soluções'}
                      {selectedItem.unidadeMedida === 'editais' && 'Editais'}
                      {selectedItem.unidadeMedida === 'documentos' && 'Documentos'}
                      {selectedItem.unidadeMedida === 'declarações' && 'Declarações'}
                      {selectedItem.unidadeMedida === 'eventos' && 'Eventos'}
                      {selectedItem.unidadeMedida === 'certificados' && 'Certificados'}
                      {selectedItem.unidadeMedida === 'publicações' && 'Publicações'}
                      {selectedItem.unidadeMedida === 'patentes' && 'Patentes'}
                      {selectedItem.unidadeMedida === 'orientações' && 'Orientações'}
                      {selectedItem.unidadeMedida === 'cursos' && 'Cursos'}
                      {selectedItem.unidadeMedida === 'workshops' && 'Workshops'}
                      {selectedItem.unidadeMedida === 'palestras' && 'Palestras'}
                      {selectedItem.unidadeMedida === 'projetos' && 'Projetos'}
                      {selectedItem.unidadeMedida === 'unidades' && 'Unidades'}
                      {!['meses', 'anos', 'dias', 'horas', 'portarias', 'processos', 'soluções', 'editais', 'documentos', 'declarações', 'eventos', 'certificados', 'publicações', 'patentes', 'orientações', 'cursos', 'workshops', 'palestras', 'projetos', 'unidades'].includes(selectedItem.unidadeMedida) && selectedItem.unidadeMedida}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documentos comprobatórios */}
              <div className="space-y-2">
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-800">Documentos Obrigatórios:</h4>
                    <p className="text-sm text-blue-700">
                      {selectedItem.documentosComprobatorios || 'Documentos comprobatórios conforme especificado no Anexo II'}
                    </p>
                  </div>
                </div>

                {/* Valor por unidade */}
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-800">Valor por Unidade:</h4>
                    <p className="text-sm text-blue-700">{selectedItem.valorPonto} pontos</p>
                  </div>
                </div>

                {/* Limite máximo (se disponível) */}
                {selectedItem.pontuacaoMaxima && (
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-800">Limite Máximo:</h4>
                      <p className="text-sm text-blue-700">{selectedItem.pontuacaoMaxima} pontos</p>
                    </div>
                  </div>
                )}

                {/* Informações adicionais baseadas no tipo */}
                {selectedItem.tipoCalculo === 'tempo' && (
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-800">Informação:</h4>
                      <p className="text-sm text-blue-700">
                        Esta atividade é calculada por tempo. Informe o período total de atuação.
                      </p>
                    </div>
                  </div>
                )}

                {selectedItem.tipoCalculo === 'quantidade' && (
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-800">Informação:</h4>
                      <p className="text-sm text-blue-700">
                        Esta atividade é calculada por quantidade. Informe o número total de {selectedItem.unidadeMedida}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upload de documento obrigatório */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {LABELS.documentoComprobatorio} <span className="text-red-500">*</span>
          </label>
          <DocumentUploader documents={documents} onDocumentsChange={handleDocumentsChange} />
          {documentError && <div className="text-red-600 text-sm mt-1">{documentError}</div>}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {LABELS.quantidade} ({selectedItem?.unidadeMedida || 'unidades'})
          </label>
          <input
            type="number"
            name="quantidade"
            value={formData.quantidade}
            onChange={handleInputChange}
            min={selectedItem?.tipoCalculo === 'tempo' ? '0.1' : '1'}
            step={selectedItem?.tipoCalculo === 'tempo' ? '0.1' : '1'}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={
              selectedItem?.tipoCalculo === 'tempo' 
                ? `Ex: 6 (para ${selectedItem?.unidadeMedida})`
                : `Ex: 3 (para ${selectedItem?.unidadeMedida})`
            }
          />
          {selectedItem && (
            <p className="text-xs text-gray-500 mt-1">
              {selectedItem.tipoCalculo === 'tempo' 
                ? `Informe o período total em ${selectedItem.unidadeMedida}`
                : `Informe o número total de ${selectedItem.unidadeMedida}`
              }
            </p>
          )}
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {LABELS.dataInicio}
            </label>
            <input
              type="date"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {LABELS.dataFim}
            </label>
            <input
              type="date"
              name="dataFim"
              value={formData.dataFim}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Observations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {LABELS.observacoes}
          </label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={LABELS.informacoesAdicionaisSobreAtividade}
          />
        </div>

        {/* Points Preview com explicação */}
        {selectedItem && formData.quantidade && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Pontuação Estimada
            </h3>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {calculatePoints().toFixed(2)} {LABELS.pontos}
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p><b>Cálculo:</b> {formData.quantidade} × {selectedItem.valorPonto} pontos por {selectedItem.unidadeMedida}</p>
              <p className="text-xs mt-2">
                A pontuação final será avaliada pela Gestão de Pessoas da sua unidade após abertura de processo, 
                anexando todos os documentos disponíveis.
              </p>
            </div>
            
            {/* Botão para download dos documentos */}
            {documents.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <button
                  type="button"
                  onClick={handleDownloadDocuments}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Baixar Documentos em PDF
                </button>
                <p className="text-xs text-blue-600 mt-1 text-center">
                  Gera um PDF com todos os documentos anexados para envio à Gestão de Pessoas
                </p>
              </div>
            )}
          </div>
        )}

        {/* Submit Button com feedback visual */}
        <button
          type="submit"
          disabled={loading || !selectedItem}
          className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            loading 
              ? 'bg-gray-400 text-white animate-pulse' 
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrando atividade...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              {LABELS.registrarAtividade}
            </div>
          )}
        </button>
      </form>

      {/* Save Animation */}
      {showSaveAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <SaveAnimationView />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityRegistration;