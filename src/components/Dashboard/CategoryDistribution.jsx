import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useCompetency } from '../../context/CompetencyContext';

const CategoryDistribution = () => {
  const { categoryScores } = useCompetency();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Padronizar categorias conforme contexto/banco
  const categories = [
    { name: 'Administrativas', label: 'Atividades Administrativas', color: 'rgba(54, 162, 235, 0.7)' },
    { name: 'Experiência', label: 'Experiência Profissional', color: 'rgba(255, 99, 132, 0.7)' },
    { name: 'Formação', label: 'Formação Acadêmica', color: 'rgba(75, 192, 192, 0.7)' },
    { name: 'Formação Complementar', label: 'Formação Complementar', color: 'rgba(255, 206, 86, 0.7)' },
    { name: 'Produção Científica', label: 'Produção Científica', color: 'rgba(153, 102, 255, 0.7)' },
    { name: 'Eventos', label: 'Participação em Eventos', color: 'rgba(255, 159, 64, 0.7)' },
    { name: 'Ensino', label: 'Atividades de Ensino', color: 'rgba(100, 100, 255, 0.7)' },
    { name: 'Outras Atividades', label: 'Outras Atividades', color: 'rgba(180, 180, 180, 0.7)' }
  ];

  useEffect(() => {
    // If there's a chart already, destroy it to prevent memory leaks
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!chartRef.current) return;

    // Create the chart
    const ctx = chartRef.current.getContext('2d');
    
    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: categories.map(cat => cat.label),
        datasets: [{
          label: 'Pontuação por Categoria',
          data: categories.map((_, index) => categoryScores[index] || 0),
          backgroundColor: 'rgba(65, 105, 225, 0.2)',
          borderColor: 'rgb(65, 105, 225)',
          borderWidth: 2,
          pointBackgroundColor: categories.map(cat => cat.color),
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(65, 105, 225)'
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              stepSize: 10
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Pontuação: ${context.raw.toFixed(1)}`;
              }
            }
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [categoryScores]); // Re-render the chart when the category scores change

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
      <div className="w-full h-64">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center min-w-0">
            <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: category.color }}></div>
            <span className="text-sm text-gray-700 break-words">{category.label}: <b>{(categoryScores[index] || 0).toFixed(1)}</b></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDistribution;