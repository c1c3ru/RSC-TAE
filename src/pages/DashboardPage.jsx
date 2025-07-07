
import React, { useState } from 'react';
import { useCompetency } from '../context/CompetencyContext';
import CategoryDistribution from '../components/Dashboard/CategoryDistribution';
import ScoreCard from '../components/Dashboard/ScoreCard';
import ActivityList from '../components/ActivityForm/ActivityList';
import { getUserDocuments } from '../services/activityService';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

const DashboardPage = () => {
  const { 
    totalScore, 
    categoryScores, 
    nextProgressionScore, 
    getActivityStats, 
    getProgressPercentage,
    loading 
  } = useCompetency();
  
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const handleDownloadAllDocuments = async () => {
    setDownloadingPDF(true);
    try {
      const userDocuments = await getUserDocuments();
      
      if (!userDocuments.length) {
        alert('Nenhum documento encontrado para download.');
        return;
      }

      const pdf = new jsPDF();
      
      // Configurações iniciais
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Documentação Completa - Sistema RSC TAE', 20, 20);
      
      // Informações do usuário
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Dados do Usuário:', 20, 40);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Total de Atividades: ${userDocuments.length}`, 20, 50);
      pdf.text(`Pontuação Total: ${totalScore.toFixed(2)} pontos`, 20, 60);
      
      // Lista de atividades
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Atividades Registradas:', 20, 80);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      let yPosition = 90;
      userDocuments.forEach((doc, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.text(`${index + 1}. ${doc.competences?.title || 'Atividade'}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`   Quantidade: ${doc.quantity} ${doc.competences?.unit || 'unidades'}`, 25, yPosition);
        yPosition += 10;
        pdf.text(`   Pontuação: ${doc.value} pontos`, 25, yPosition);
        yPosition += 10;
        if (doc.data_inicio) {
          pdf.text(`   Data Início: ${doc.data_inicio}`, 25, yPosition);
          yPosition += 10;
        }
        if (doc.data_fim) {
          pdf.text(`   Data Fim: ${doc.data_fim}`, 25, yPosition);
          yPosition += 10;
        }
        yPosition += 5;
      });
      
      // Informações sobre o processo
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Processo de Avaliação:', 20, yPosition + 10);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const processText = [
        'Esta documentação será avaliada pela Gestão de Pessoas da sua unidade',
        'após abertura de processo, anexando todos os documentos disponíveis.',
        '',
        'Data de geração: ' + new Date().toLocaleDateString('pt-BR'),
        'Hora: ' + new Date().toLocaleTimeString('pt-BR')
      ];
      
      processText.forEach((line, index) => {
        const lineY = yPosition + 20 + (index * 10);
        if (lineY < 280) {
          pdf.text(line, 20, lineY);
        }
      });
      
      // Salvar o PDF
      const fileName = `documentacao_completa_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  if (loading) {
    // Skeleton loader para dashboard
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-8">
          <div className="h-10 w-32 bg-blue-200 bg-opacity-30 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="h-16 w-48 bg-blue-200 bg-opacity-30 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 w-full bg-blue-200 bg-opacity-30 rounded mb-4 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 w-24 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-16 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-6 w-48 bg-slate-200 rounded mb-4"></div>
          <div className="h-64 w-full bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  const stats = getActivityStats();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Acompanhe seu progresso de competências
          </div>
          <button
            onClick={handleDownloadAllDocuments}
            disabled={downloadingPDF || stats.total === 0}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              downloadingPDF 
                ? 'bg-gray-400 text-white' 
                : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {downloadingPDF ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando PDF...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Baixar Documentação Completa
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Main Score Card */}
      <ScoreCard />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Atividades</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Progresso</p>
              <p className="text-2xl font-bold text-gray-900">{progressPercentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pontos por Atividade</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total > 0 ? (totalScore / stats.total).toFixed(1) : '0.0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      {stats.total === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          Nenhuma atividade registrada ainda. Comece adicionando uma!
        </div>
      ) : (
        <CategoryDistribution categoryScores={categoryScores} />
      )}

      {/* Lista de atividades */}
      <ActivityList />
    </div>
  );
};

export default DashboardPage;
