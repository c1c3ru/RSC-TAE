import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ActivityRegistration from '../components/ActivityForm/ActivityRegistration';
import { useAuth } from '../context/AuthContext'; // Importa useAuth para obter o usuário

const ActivityRegistrationPage = () => {
  const location = useLocation();
  const [categoryFilter, setCategoryFilter] = useState(null);
  const { currentUser, loading: authLoading } = useAuth(); // Obtém o usuário logado e o status de carregamento

  // Extrai o filtro de categoria da URL se presente
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setCategoryFilter(category);
    }
  }, [location]);
  
  // Define as categorias (se não estiverem centralizadas em um arquivo de dados)
  const categories = [
    { id: 1, name: 'Atividades Administrativas', color: 'blue' },
    { id: 2, name: 'Experiência Profissional', color: 'red' },
    { id: 3, name: 'Formação e Capacitação', color: 'green' },
    { id: 4, name: 'Produção Científica', color: 'yellow' },
    { id: 5, name: 'Participação em Eventos', color: 'purple' },
    { id: 6, name: 'Atividades de Ensino', color: 'orange' }
  ];
  
  // Função para gerar classes de cor apropriadas com base na categoria
  const getCategoryColorClasses = (categoryId, type) => {
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    if (!category) return '';
    
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        button: 'bg-red-600 hover:bg-red-700'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        button: 'bg-green-600 hover:bg-green-700'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        button: 'bg-yellow-600 hover:bg-yellow-700'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        button: 'bg-orange-600 hover:bg-orange-700'
      }
    };
    
    return colorMap[category.color][type];
  };
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Registrar Atividade</h1>
      
      {/* Abas de filtro de categoria */}
      {categoryFilter && (
        <div className="mb-6">
          <div className={`p-4 rounded-lg ${getCategoryColorClasses(categoryFilter, 'bg')} ${getCategoryColorClasses(categoryFilter, 'border')}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  Categoria: {categories.find(cat => cat.id === parseInt(categoryFilter))?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {categoryFilter === '1' && 'Inclui fiscalização de contratos, participação em comissões e atividades de gestão.'}
                  {categoryFilter === '2' && 'Inclui tempo de serviço, cargos e funções ocupadas.'}
                  {categoryFilter === '3' && 'Inclui cursos, titulação acadêmica e certificações.'}
                  {categoryFilter === '4' && 'Inclui publicações, patentes e desenvolvimento de sistemas.'}
                  {categoryFilter === '5' && 'Inclui organização de eventos e participação em projetos.'}
                  {categoryFilter === '6' && 'Inclui orientações, tutorias e atividades de ensino.'}
                </p>
              </div>
              <button
                onClick={() => setCategoryFilter(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                Remover filtro
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Botões de seleção de categoria (quando nenhum filtro é selecionado) */}
      {!categoryFilter && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              className={`p-4 rounded-lg border ${getCategoryColorClasses(category.id, 'bg')} ${getCategoryColorClasses(category.id, 'border')} text-left transition-colors`}
              onClick={() => setCategoryFilter(category.id.toString())}
            >
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {category.id === 1 && 'Fiscalização, comissões e gestão'}
                {category.id === 2 && 'Tempo de serviço e funções'}
                {category.id === 3 && 'Cursos e titulação acadêmica'}
                {category.id === 4 && 'Publicações e patentes'}
                {category.id === 5 && 'Eventos e projetos'}
                {category.id === 6 && 'Orientações e ensino'}
              </p>
            </button>
          ))}
        </div>
      )}
      
      {/* Formulário de registro de atividade - Passa o userId para o componente */}
      {/* Renderiza ActivityRegistration apenas se o usuário estiver carregado e autenticado */}
      {!authLoading && currentUser ? (
        <ActivityRegistration categoryFilter={categoryFilter} userId={currentUser.id} />
      ) : (
        <p className="text-center text-gray-500">
          {authLoading ? 'Carregando informações do usuário...' : 'Faça login para registrar atividades.'}
        </p>
      )}
    </div>
  );
};

export default ActivityRegistrationPage;
