import React, { useState } from 'react';
import ScoreCard from '../components/Dashboard/ScoreCard';
import CategoryDistribution from '../components/Dashboard/CategoryDistribution';
import ActivityList from '../components/Tables/ActivityList';
import { useCompetency } from '../context/CompetencyContext';

const DashboardPage = () => {
  const { activities } = useCompetency();
  const [showAllActivities, setShowAllActivities] = useState(false);
  
  // Get only the 5 most recent activities for the dashboard preview
  const recentActivities = activities
    .sort((a, b) => new Date(b.dataRegistro) - new Date(a.dataRegistro))
    .slice(0, 5);
    
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score Card */}
        <ScoreCard />
        
        {/* Category Distribution */}
        <CategoryDistribution />
      </div>
      
      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Atividades Recentes</h2>
          <button 
            onClick={() => setShowAllActivities(!showAllActivities)}
            className="text-blue-700 hover:text-blue-900"
          >
            {showAllActivities ? 'Mostrar Recentes' : 'Ver Todas'}
          </button>
        </div>
        
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-2">Nenhuma atividade registrada.</p>
            <p className="text-sm">Comece registrando suas atividades para pontuação.</p>
          </div>
        ) : (
          <ActivityList activities={showAllActivities ? activities : recentActivities} />
        )}
      </div>
      
      {/* Quick Links Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
            <a href="/activity/register" className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700 mb-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-gray-800">Registrar Nova Atividade</span>
            </a>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
            <a href="/activity/history" className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700 mb-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-gray-800">Ver Histórico Completo</span>
            </a>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
            <a href="/reports" className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700 mb-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-2-2a1 1 0 10-2 0v5a1 1 0 102 0V9zm4-1a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-gray-800">Gerar Relatório</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;