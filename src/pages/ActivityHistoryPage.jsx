import React, { useState, useMemo } from 'react';
import ActivityList from '../components/Tables/ActivityList';
import { useCompetency } from '../context/CompetencyContext';

const ActivityHistoryPage = () => {
  const { activities, competencyItems } = useCompetency();
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    sortBy: 'dateDesc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 10;

  // Memoize para performance
  const processedActivities = useMemo(() => {
    let result = [...activities];

    // Filtrar por categoria
    if (filters.category !== 'all') {
      result = result.filter(activity => {
        const item = activity.itemCompetenciaDetails || competencyItems.find(i => i.id === activity.itemCompetenciaId);
        return item && item.categoria.toString() === filters.category;
      });
    }

    // Filtrar por busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(activity => {
        const item = activity.itemCompetenciaDetails || competencyItems.find(i => i.id === activity.itemCompetenciaId);
        return (item && item.titulo.toLowerCase().includes(searchLower)) ||
               (activity.descricao && activity.descricao.toLowerCase().includes(searchLower));
      });
    }

    // Ordenar
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'dateAsc': return new Date(a.dataRegistro) - new Date(b.dataRegistro);
        case 'scoreDesc': return b.pontuacao - a.pontuacao;
        case 'scoreAsc': return a.pontuacao - b.pontuacao;
        case 'dateDesc':
        default:
          return new Date(b.dataRegistro) - new Date(a.dataRegistro);
      }
    });

    return result;
  }, [activities, filters, competencyItems]);

  // Paginação
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = processedActivities.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalPages = Math.ceil(processedActivities.length / activitiesPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };
  
  // ... (o JSX permanece o mesmo, apenas remova o <select> do filtro de "Status") ...
  // O resto do seu JSX está ótimo e pode ser mantido.
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Histórico de Atividades</h1>
      {/* Seção de Filtros (sem o filtro de Status) */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* ... (seu JSX para os filtros, exceto o de Status) ... */}
      </div>
      {/* Seção de Resultados */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* ... (seu JSX para a lista e paginação) ... */}
      </div>
    </div>
  );
};

export default ActivityHistoryPage;