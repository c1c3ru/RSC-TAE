
import React from 'react';
import { getCategoryName } from '../../data/competencyItems';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Registrar os componentes necessários para o gráfico radar
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

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

  // Preparar dados para o gráfico radar apenas se houver dados
  const radarData = React.useMemo(() => ({
    labels: data.map(item => getCategoryName(item.category)),
    datasets: [
      {
        label: 'Pontos por Categoria',
        data: data.map(item => item.value),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: data.map(item => item.color),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }), [data]);

  const radarOptions = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed.r} pontos`,
        },
      },
    },
    scales: {
      r: {
        angleLines: { 
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: 0,
        suggestedMax: Math.max(...data.map(item => item.value), 5),
        pointLabels: {
          font: { 
            size: 12,
            weight: 'bold' as const,
          },
          color: 'rgba(0, 0, 0, 0.7)',
        },
        ticks: {
          stepSize: 1,
          font: { size: 10 },
          color: 'rgba(0, 0, 0, 0.5)',
          backdropColor: 'transparent',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  }), [data]);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        
        {/* Gráfico Radar */}
        {total > 0 && data.length > 0 ? (
          <div className="mb-6" style={{ height: '300px' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm">Nenhuma atividade registrada</div>
              <div className="text-xs">Registre atividades para ver o gráfico de distribuição</div>
            </div>
          </div>
        )}
        
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
                    {getCategoryName(item.category)}
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
