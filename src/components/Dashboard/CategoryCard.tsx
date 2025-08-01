import React from 'react';
import { getCategoryName, getMaxPointsByCategory } from '../../data/competencyItems';

interface CategoryCardProps {
  category: string;
  categoryName?: string;
  activityCount: number;
  totalPoints: number;
  maxPoints: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  categoryName: propCategoryName,
  activityCount, 
  totalPoints, 
  maxPoints 
}) => {
  const categoryName = propCategoryName || getCategoryName(category);
  const progressPercentage = maxPoints > 0 ? Math.min((totalPoints / maxPoints) * 100, 100) : 0;
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      'CAT1': { bg: 'bg-blue-100', text: 'text-blue-600', icon: '📚' },
      'CAT2': { bg: 'bg-green-100', text: 'text-green-600', icon: '🔬' },
      'CAT3': { bg: 'bg-purple-100', text: 'text-purple-600', icon: '🎓' },
      'CAT4': { bg: 'bg-orange-100', text: 'text-orange-600', icon: '📊' },
      'CAT5': { bg: 'bg-pink-100', text: 'text-pink-600', icon: '🎪' },
      'CAT6': { bg: 'bg-indigo-100', text: 'text-indigo-600', icon: '👨‍🏫' },
      'FORM-EXC': { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: '⭐' }
    };
    
    return colors[category] || { bg: 'bg-gray-100', text: 'text-gray-600', icon: '📋' };
  };

  const { bg, text, icon } = getCategoryColor(category);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 min-w-0">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center min-w-0 flex-1">
          <div className={`p-2 sm:p-3 rounded-full ${bg} mr-3 sm:mr-4 flex-shrink-0`}>
            <span className="text-xl sm:text-2xl">{icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`text-base sm:text-lg font-semibold ${text} break-words leading-tight`}>
              {categoryName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 break-words leading-tight">
              {category}
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm font-medium text-gray-600 break-words">Atividades</span>
          <span className="text-base sm:text-lg font-bold text-gray-900 flex-shrink-0">{activityCount}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm font-medium text-gray-600 break-words">Pontos</span>
          <span className="text-base sm:text-lg font-bold text-gray-900 flex-shrink-0">
            {Math.round(totalPoints * 10) / 10} / {maxPoints}
          </span>
        </div>
        
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className="break-words">Progresso</span>
            <span className="flex-shrink-0">{Math.round(progressPercentage * 10) / 10}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${text.replace('text-', 'bg-')}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard; 