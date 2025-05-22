import React, { useState, useEffect, useMemo } from 'react';
import ActivityList from '../components/Tables/ActivityList';
import { useCompetency } from '../context/CompetencyContext';
import { useMediaQuery } from '@mui/material'; // For responsive design if Material UI is used

const ActivityHistoryPage = () => {
  const { activities, competencyItems } = useCompetency();
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    search: '',
    sortBy: 'dateDesc', // 'dateDesc', 'dateAsc', 'scoreDesc', 'scoreAsc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 10; // Number of activities per page
  const isMobile = useMediaQuery('(max-width:600px)'); // Example for responsive adjustments

  // Memoize filtered and sorted activities for performance
  const processedActivities = useMemo(() => {
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
        const item = competencyItems.find(item => item.id === activity.itemCompetenciaId);
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
    return result;
  }, [activities, filters, competencyItems]);

  // Calculate activities for the current page
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = processedActivities.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalPages = Math.ceil(processedActivities.length / activitiesPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      status: 'all',
      search: '',
      sortBy: 'dateDesc'
    });
    setCurrentPage(1);
  };

  const handleExport = () => {
    // Implement actual export logic here, e.g., to CSV or PDF
    const headers = ["Item", "Description", "Period/Quantity", "Score", "Status", "Documents"];
    const rows = processedActivities.map(activity => {
      const item = competencyItems.find(i => i.id === activity.itemCompetenciaId);
      const itemTitle = item ? item.titulo : 'N/A';
      const periodOrQuantity = activity.dataInicio ? `${activity.dataInicio} to ${activity.dataFim}` : `${activity.quantidade} ${item?.unidadeMedida || 'units'}`;
      const documentsCount = activity.documentos?.length || 0;
      return [itemTitle, activity.descricao, periodOrQuantity, activity.pontuacao, activity.status, `${documentsCount} document(s)`];
    });

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "activities_history.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Histórico de Atividades</h1>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">Filtros de Busca</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              id="category"
              name="category"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
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
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
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
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              id="sortBy"
              name="sortBy"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
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
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Pesquisar
            </label>
            <input
              id="search"
              name="search"
              type="text"
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Pesquisar por título ou descrição..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
      
      {/* Results Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Atividades Encontradas <span className="text-gray-500 text-sm">({processedActivities.length})</span>
            </h2>
            
            {processedActivities.length > 0 && (
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
                onClick={handleExport}
              >
                Exportar CSV
              </button>
            )}
          </div>
          
          {currentActivities.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-4 text-lg">Nenhuma atividade encontrada com os filtros aplicados.</p>
              <p className="text-md">Tente ajustar seus critérios de busca ou registre novas atividades.</p>
            </div>
          ) : (
            <>
              <ActivityList activities={currentActivities} />
              {/* Pagination controls */}
              <div className="mt-6 flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      {processedActivities.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Estatísticas do Histórico</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Pontos Filtrados</p>
                <p className="text-2xl font-bold text-blue-700">
                  {processedActivities.reduce((sum, activity) => sum + activity.pontuacao, 0).toFixed(1)}
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3 .895-3 2 1.343 2 3 2m0-8V9m0 3v2m0 3v2m-6.5-5.5h-2.5m10 0h2.5M9 6a3 3 0 016 0V7a3 3 0 01-6 0V6zm-5 5.5a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-5a.5.5 0 00-.5-.5h-2zm10 0a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-5a.5.5 0 00-.5-.5h-2z" />
              </svg>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Atividades Aprovadas</p>
                <p className="text-2xl font-bold text-green-700">
                  {processedActivities.filter(a => a.status === 'aprovada').length}
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Atividades Pendentes</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {processedActivities.filter(a => a.status === 'pendente').length}
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHistoryPage;