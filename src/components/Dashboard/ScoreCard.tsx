import React from 'react';

interface ScoreCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  percentage?: number;
  maxValue?: number;
}

const ScoreCard: React.FC<ScoreCardProps> = React.memo(({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle,
  percentage,
  maxValue 
}) => {
  // Calcular percentual se não fornecido
  const calculatedPercentage = percentage !== undefined 
    ? percentage 
    : maxValue && typeof value === 'number' 
      ? (value / maxValue) * 100 
      : undefined;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`text-${color}-600`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {subtitle && (
                  <div className="ml-2 text-sm text-gray-600">
                    {subtitle}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
        
        {/* Line Tracker de Percentual */}
        {calculatedPercentage !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progresso</span>
              <span>{calculatedPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  color === 'yellow' ? 'bg-yellow-500' :
                  color === 'green' ? 'bg-green-500' :
                  color === 'blue' ? 'bg-blue-500' :
                  color === 'red' ? 'bg-red-500' :
                  color === 'purple' ? 'bg-purple-500' :
                  'bg-gray-500'
                }`}
                style={{ 
                  width: `${Math.min(calculatedPercentage, 100)}%`,
                  transition: 'width 0.5s ease-out'
                }}
              ></div>
            </div>
            {maxValue && typeof value === 'number' && (
              <div className="text-xs text-gray-500 mt-1">
                Meta: {maxValue} pontos
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default ScoreCard;