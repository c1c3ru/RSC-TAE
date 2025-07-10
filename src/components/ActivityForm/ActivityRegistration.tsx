import React, { useState, useEffect } from 'react';
import { useCompetency } from '../../context/CompetencyContext';
import { useAuth } from '../../context/AuthContext';
import DocumentUploader from './DocumentUploader';
import { LABELS } from '../../constants/texts';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { useLottie } from 'lottie-react';
import saveAnimation from '../../assets/lottie/save_profile_animation.json';

interface ActivityRegistrationProps {
  categoryFilter?: string;
}

interface FormData {
  itemCompetenciaId: string;
  quantidade: number | string;
  dataInicio: string;
  dataFim: string;
  observacoes: string;
}

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  filePath: string;
}

const ActivityRegistration: React.FC<ActivityRegistrationProps> = ({ categoryFilter }) => {
  const { competencyItems, registerActivity } = useCompetency();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    itemCompetenciaId: '',
    quantidade: 1,
    dataInicio: '',
    dataFim: '',
    observacoes: ''
  });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentError, setDocumentError] = useState('');
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);

  const { View: SaveAnimationView } = useLottie({
    animationData: saveAnimation,
    loop: true,
    autoplay: true
  });

  const groupedItems = competencyItems.reduce((acc: Record<string, any[]>, item: any) => {
    const category = item.category || 'Administrativas';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const categoryNames: Record<string, string> = {
    'Administrativas': 'Atividades Administrativas',
    'Experiência': 'Experiência Profissional',
    'Formação': 'Formação Acadêmica',
    'Formação Complementar': 'Formação Complementar',
    'Produção Científica': 'Produção Científica',
    'Eventos': 'Participação em Eventos',
    'Ensino': 'Atividades de Ensino',
  };

  useEffect(() => {
    if (selectedItem) {
      // console.log('selectedItem:', selectedItem);
    }
    if (documents && documents.length) {
      // console.log('documents:', documents);
    }
  }, [selectedItem, documents]);

  useEffect(() => {
    if (formData.itemCompetenciaId) {
      const item = competencyItems.find((item: any) => item.id === formData.itemCompetenciaId);
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
  }, [formData.itemCompetenciaId, competencyItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentsChange = (newDocs: Document[]) => {
    setDocuments(newDocs);
    setDocumentError('');
  };

  const validateDocuments = () => {
    setDocumentError('');
    return true;
  };

  const calculatePoints = () => {
    if (!selectedItem || !formData.quantidade) return 0;
    const calculatedPoints = parseFloat(formData.quantidade as string) * selectedItem.valorPonto;
    return calculatedPoints;
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateDocuments()) return;
    if (!selectedItem) return;
    setLoading(true);
    try {
      await registerActivity({
        itemCompetenciaId: formData.itemCompetenciaId,
        quantidade: parseFloat(formData.quantidade as string),
        dataInicio: formData.dataInicio || null,
        dataFim: formData.dataFim || null,
        observacoes: formData.observacoes,
        documentosComprobatorios: documents
      });
      setSuccess(true);
      setFormData({
        itemCompetenciaId: '',
        quantidade: 1,
        dataInicio: '',
        dataFim: '',
        observacoes: ''
      });
      setDocuments([]);
      setTimeout(() => setSuccess(false), 5000);
      setShowSaveAnimation(true);
      setTimeout(() => setShowSaveAnimation(false), 3000);
    } catch (error: any) {
      console.error('Error registering activity:', error);
      alert('Erro ao registrar atividade. Tente novamente.\n' + (error?.message || error));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocuments = async () => {
    if (!documents.length) {
      alert('Nenhum documento anexado para gerar o PDF.');
      return;
    }
    setDownloadingPDF(true);
    try {
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Documentação para Gestão de Pessoas', 20, 20);
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
      pdf.text(`Observações: ${formData.observacoes || '-'}`, 20, 100);
      let y = 120;
      for (const doc of documents) {
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Documento: ${doc.name}`, 20, y);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Tamanho: ${doc.size} bytes`, 20, y + 10);
        pdf.text(`Tipo: ${doc.type}`, 20, y + 20);
        pdf.text(`URL: ${doc.url}`, 20, y + 30);
        y += 45;
      }
      pdf.save('documentos_atividade.pdf');
    } catch (err: any) {
      alert('Erro ao gerar PDF: ' + err.message);
    } finally {
      setDownloadingPDF(false);
    }
  };

  return null;

};

export default ActivityRegistration; 