import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useCompetency } from '../../context/CompetencyContext';

// Centraliza a definição das categorias e suas cores para consistência
// Idealmente, isso viria de um arquivo de configuração ou do próprio competencyItems
// src/data/categories.js (novo arquivo sugerido)
const categoriesData = [
  { id: 1, name: 'Atividades Administrativas', color: 'rgba(54, 162, 235, 0.7)', borderColor: 'rgb(54, 162, 235)' }, // Azul
  { id: 2, name: 'Experiência Profissional', color: 'rgba(255, 99, 132, 0.7)', borderColor: 'rgb(255, 99, 132)' }, // Vermelho
  { id: 3, name: 'Formação e Capacitação', color: 'rgba(75, 192, 192, 0.7)', borderColor: 'rgb(75, 192, 192)' }, // Verde
  { id: 4, name: 'Produção Científica', color: 'rgba(255, 206, 86, 0.7)', borderColor: 'rgb(255, 206, 86)' }, // Amarelo
  { id: 5, name: 'Participação em Eventos', color: 'rgba(153, 102, 255, 0.7)', borderColor: 'rgb(153, 102, 255)' }, // Roxo
  { id: 6, name: 'Atividades de Ensino', color: 'rgba(255, 159, 64, 0.7)', borderColor: 'rgb(255, 159, 64)' } // Laranja
];

const CategoryDistribution = () => {
  // Desestrutura categoryScores e totalScore do contexto de competência
  const { categoryScores, totalScore } = useCompetency();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Se já existe uma instância do gráfico, destrua-a para evitar vazamentos de memória
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Se a referência do canvas não está disponível, sai do efeito
    if (!chartRef.current) return;

    // Obtém o contexto 2D do canvas
    const ctx = chartRef.current.getContext('2d');
    
    // Cria uma nova instância do gráfico
    chartInstance.current = new Chart(ctx, {
      type: 'radar', // Tipo de gráfico: radar
      data: {
        // Rótulos para cada ponto do radar (nomes das categorias)
        labels: categoriesData.map(cat => cat.name),
        datasets: [{
          label: 'Pontuação por Categoria', // Rótulo do dataset
          // Dados da pontuação para cada categoria
          data: categoriesData.map((_, index) => categoryScores[index] || 0),
          backgroundColor: 'rgba(65, 105, 225, 0.2)', // Cor de fundo da área do gráfico
          borderColor: 'rgb(65, 105, 225)', // Cor da borda da linha do gráfico
          borderWidth: 2, // Largura da borda
          // Cor dos pontos no gráfico (baseado nas cores das categorias)
          pointBackgroundColor: categoriesData.map(cat => cat.borderColor),
          pointBorderColor: '#fff', // Cor da borda dos pontos
          pointHoverBackgroundColor: '#fff', // Cor de fundo dos pontos ao passar o mouse
          pointHoverBorderColor: 'rgb(65, 105, 225)' // Cor da borda dos pontos ao passar o mouse
        }]
      },
      options: {
        responsive: true, // Torna o gráfico responsivo
        maintainAspectRatio: false, // Permite que o gráfico não mantenha a proporção original, preenchendo o contêiner
        scales: {
          r: {
            beginAtZero: true, // Inicia o eixo no zero
            ticks: {
              stepSize: 10, // Incremento dos ticks no eixo
              backdropColor: 'transparent', // Remove o fundo dos rótulos dos ticks
              color: '#6B7280' // Cor dos rótulos dos ticks
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.2)' // Cor das linhas da grade
            },
            angleLines: {
              color: 'rgba(200, 200, 200, 0.2)' // Cor das linhas angulares
            }
          }
        },
        plugins: {
          legend: {
            display: true, // Exibe a legenda
            position: 'bottom', // Posição da legenda
            labels: {
              color: '#374151', // Cor do texto da legenda
              font: {
                size: 12
              },
              // Callback para personalizar o texto da legenda (opcional, mas útil para mostrar a pontuação)
              generateLabels: function(chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map(function(label, i) {
                    const meta = chart.getDatasetMeta(0);
                    const score = data.datasets[0].data[i];
                    return {
                      text: `${label}: ${score.toFixed(1)}`,
                      fillStyle: categoriesData[i].borderColor,
                      strokeStyle: categoriesData[i].borderColor,
                      lineWidth: 2,
                      hidden: isNaN(meta.data[i].parsed.r) || meta.data[i].hidden, // Oculta se o valor for NaN ou se o item estiver oculto
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Pontuação: ${context.raw.toFixed(1)}`; // Formata a pontuação no tooltip
              }
            }
          }
        }
      }
    });

    // Função de limpeza para destruir a instância do gráfico quando o componente é desmontado ou categoryScores muda
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [categoryScores]); // O gráfico é re-renderizado sempre que as pontuações das categorias mudam

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
      {totalScore === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-2">Nenhuma pontuação registrada ainda.</p>
          <p className="text-sm">Registre atividades para ver a distribuição aqui.</p>
        </div>
      ) : (
        <>
          {/* Contêiner do canvas com classes responsivas para altura */}
          <div className="w-full h-64 md:h-80 lg:h-96">
            <canvas ref={chartRef}></canvas>
          </div>
          {/* Legenda manual com cores e pontuações */}
          <div className="grid grid-cols-2 gap-2 mt-6">
            {categoriesData.map((category, index) => (
              <div key={index} className="flex items-center">
                {/* Pequeno círculo colorido para representar a categoria */}
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.borderColor }}></div>
                {/* Nome da categoria e pontuação */}
                <span className="text-sm text-gray-700">{category.name}: <b>{(categoryScores[index] || 0).toFixed(1)}</b></span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryDistribution;