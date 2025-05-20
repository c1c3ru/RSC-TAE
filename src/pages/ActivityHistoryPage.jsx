import React, { useState, useEffect } from 'react';
import ActivityList from '../components/Tables/ActivityList';
import { useCompetency } from '../context/CompetencyContext';

const ActivityHistoryPage = () => {
  const { activities, competencyItems, deleteActivity, updateActivityStatus } = useCompetency();
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    search: '',
    sortBy: 'dateDesc'
  });
  
  // Apply filters whenever activities or filter criteria change
  useEffect(() => {
    let result = [...activities];
    
    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(activity => {
        const item = competencyItems.find(item => item.id === activity.itemCompetenciaId);
        return item && item.categoria === parseInt(filters.category);
      });
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter(activity => activity.status === filters.status);
    }
    
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(activity => {
        // Get item details
        const item = competencyItems.find(item => item.id === activity.itemCompetenciaId);
        
        // Search in item title and description
        return (
          (item && item.titulo.toLowerCase().includes(searchLower)) ||
          (item && item.descricao.toLowerCase().includes(searchLower)) ||
          (activity.descricao && activity.descricao.toLowerCase().includes(searchLower))
        );
      });
    }
    
    // Sort results
    switch (filters.sortBy) {
      case 'dateAsc':
        result.sort((a, b) => new Date(a.dataRegistro) - new Date(b.dataRegistro));
        break;
      case 'dateDesc':
        result.sort((a, b) => new Date(b.dataRegistro) - new Date(a.dataRegistro));
        break;
      case 'scoreAsc':
        result.sort((a, b) => a.pontuacao - b.pontuacao);
        break;
      case 'scoreDesc':
        result.sort((a, b) => b.pontuacao - a.pontuacao);
        break;
      default:
        break;
    }
    
    setFilteredActivities(result);
  }, [activities, filters, competencyItems]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Atividades</h1>
      
      {/* Filters section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Categoria
            </label>
            <select
              id="category"
              name="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="all">Todas as Categorias</option>
              <option value="1">Atividades Administrativas</option>
              <option value="2">Experiência Profissional</option>
              <option value="3">Formação e Capacitação</option>
              <option value="4">Produção Científica</option>
              <option value="5">Participação em Eventos</option>
              <option value="6">Atividades de Ensino</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="aprovada">Aprovada</option>
              <option value="rejeitada">Rejeitada</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sortBy">
              Ordenar por
            </label>
            <select
              id="sortBy"
              name="sortBy"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="dateDesc">Data (mais recente)</option>
              <option value="dateAsc">Data (mais antiga)</option>
              <option value="scoreDesc">Pontuação (maior)</option>
              <option value="scoreAsc">Pontuação (menor)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">
              Pesquisar
            </label>
            <input
              id="search"
              name="search"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Pesquisar..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
      
      {/* Results section */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Resultados <span className="text-gray-500 text-sm">({filteredActivities.length} atividades encontradas)</span>
              </h2>
              
              {filteredActivities.length > 0 && (
                <button 
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    // This would be replaced with actual export functionality
                    alert('Funcionalidade de exportação será implementada em uma versão futura.');
                  }}
                >
                  Exportar
                </button>
              )}
            </div>
            
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2">Nenhuma atividade encontrada com os filtros atuais.</p>
                <p className="text-sm">Tente ajustar seus critérios de busca ou registre novas atividades.</p>
              </div>
            ) : (
              <ActivityList activities={filteredActivities} />
            )}
          </div>
        </div>
      </div>
      
      {/* Statistics section */}
      {filteredActivities.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Estatísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600">Total de Pontos</p>
              <p className="text-2xl font-bold text-blue-700">
                {filteredActivities.reduce((sum, activity) => sum + activity.pontuacao, 0).toFixed(1)}
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-sm text-gray-600">Atividades Aprovadas</p>
              <p className="text-2xl font-bold text-green-700">
                {filteredActivities.filter(a => a.status === 'aprovada').length}
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <p className="text-sm text-gray-600">Atividades Pendentes</p>
              <p className="text-2xl font-bold text-yellow-700">
                {filteredActivities.filter(a => a.status === 'pendente').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHistoryPage;