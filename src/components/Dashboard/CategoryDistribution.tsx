
import React from 'react';

interface CategoryData {
  category: string;
  value: number;
  color: string;
}

interface CategoryDistributionProps {
  data: CategoryData[];
  title: string;
}

const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            return (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded mr-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">
                    {item.value} pts
                  </span>
                  <span className="text-xs text-gray-500">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {total > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Total</span>
              <span className="text-sm font-semibold text-gray-900">
                {total} pontos
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDistribution;
