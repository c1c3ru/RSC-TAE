
import * as React from 'react';
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

const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ data, title }: CategoryDistributionProps) => {
  const total = data.reduce((sum: number, item: CategoryData) => sum + item.value, 0);

  // Cores vibrantes para cada categoria
  const categoryColors = [
    'rgba(54, 162, 235, 0.7)',   // Azul
    'rgba(255, 99, 132, 0.7)',   // Rosa
    'rgba(75, 192, 192, 0.7)',   // Verde-azulado
    'rgba(255, 206, 86, 0.7)',   // Amarelo
    'rgba(153, 102, 255, 0.7)',  // Roxo
    'rgba(255, 159, 64, 0.7)',   // Laranja
    'rgba(100, 100, 255, 0.7)',  // Azul escuro
  ];

  // Preparar dados para o gráfico radar apenas se houver dados
  const radarData = React.useMemo(() => ({
    labels: data.map((item: CategoryData) => getCategoryName(item.category)),
    datasets: [
      {
        label: 'Pontos por Categoria',
        data: data.map((item: CategoryData) => item.value),
        backgroundColor: 'rgba(65, 105, 225, 0.2)',
        borderColor: 'rgb(65, 105, 225)',
        borderWidth: 3,
        pointBackgroundColor: data.map((_: CategoryData, index: number) => categoryColors[index % categoryColors.length]),
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(65, 105, 225)',
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(65, 105, 225, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => `${context.label}: ${Math.round(context.parsed.r * 10) / 10} pontos`,
        },
      },
    },
    scales: {
      r: {
        angleLines: { 
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
        suggestedMin: 0,
        suggestedMax: Math.max(...data.map((item: CategoryData) => item.value), 5),
        pointLabels: {
          font: { 
            size: 13,
            weight: 'bold' as const,
          },
          color: 'rgba(0, 0, 0, 0.8)',
          padding: 15,
        },
        ticks: {
          stepSize: 1,
          font: { size: 11, weight: 'bold' as const },
          color: 'rgba(0, 0, 0, 0.6)',
          backdropColor: 'transparent',
          padding: 8,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
      },
    },
  }), [data]);

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 min-w-0">
      <div className="px-4 sm:px-6 py-4 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{title}</h3>
        </div>
        
        {/* Gráfico Radar */}
        {total > 0 && data.length > 0 ? (
          <div className="mb-6 sm:mb-8" style={{ height: '300px', minHeight: '250px' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        ) : (
          <div className="mb-6 sm:mb-8 p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200">
            <div className="text-center text-gray-500">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📊</div>
              <div className="text-base sm:text-lg font-medium mb-2 break-words">Nenhuma atividade registrada</div>
              <div className="text-xs sm:text-sm break-words">Registre atividades para ver o gráfico de distribuição</div>
            </div>
          </div>
        )}
        
        {/* Legendas com melhor design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {data.map((item: CategoryData, index: number) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            return (
              <div key={item.category} className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors duration-200 min-w-0">
                <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center min-w-0">
                  <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                  />
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 break-words min-w-0">
                      {getCategoryName(item.category)}
                  </span>
                </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm sm:text-lg font-bold text-gray-900">
                      {Math.round(item.value * 10) / 10} pts
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round(percentage * 10) / 10}%
                    </div>
                  </div>
                </div>
                {/* Barra de progresso */}
                {total > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: categoryColors[index % categoryColors.length]
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        

      </div>
    </div>
  );
};

export default CategoryDistribution;
