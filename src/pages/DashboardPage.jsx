
import React from 'react';
import { useCompetency } from '../context/CompetencyContext';
import CategoryDistribution from '../components/Dashboard/CategoryDistribution';
import ScoreCard from '../components/Dashboard/ScoreCard';

const DashboardPage = () => {
  const { 
    totalScore, 
    categoryScores, 
    nextProgressionScore, 
    getActivityStats, 
    getProgressPercentage,
    loading 
  } = useCompetency();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getActivityStats();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Acompanhe seu progresso de competências
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
      <CategoryDistribution categoryScores={categoryScores} />
    </div>
  );
};

export default DashboardPage;
