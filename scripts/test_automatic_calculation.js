// Simular o cálculo automático de quantidade
function calculateQuantityFromDates(dataInicio, dataFim, type) {
  if (!dataInicio || !dataFim) {
    return 0;
  }

  const startDate = new Date(dataInicio);
  const endDate = new Date(dataFim);
  
  if (startDate > endDate) return 0;

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (type === 'MONTHS') {
    // Calcular meses (aproximado)
    const months = diffDays / 30.44; // Média de dias por mês
    return Math.round(months * 100) / 100; // Arredondar para 2 casas decimais
  } else if (type === 'YEARS') {
    // Calcular anos (aproximado)
    const years = diffDays / 365.25; // Média de dias por ano
    return Math.round(years * 100) / 100; // Arredondar para 2 casas decimais
  }
  
  return 0;
}

// Testar diferentes cenários
function testAutomaticCalculation() {
  console.log('🧪 Testando cálculo automático de quantidade...\n');

  const testCases = [
    {
      name: 'Atividade por meses - 1 mês',
      dataInicio: '2024-01-01',
      dataFim: '2024-02-01',
      type: 'MONTHS',
      expected: '~1.00'
    },
    {
      name: 'Atividade por meses - 3 meses',
      dataInicio: '2024-01-01',
      dataFim: '2024-04-01',
      type: 'MONTHS',
      expected: '~3.00'
    },
    {
      name: 'Atividade por anos - 1 ano',
      dataInicio: '2023-01-01',
      dataFim: '2024-01-01',
      type: 'YEARS',
      expected: '~1.00'
    },
    {
      name: 'Atividade por anos - 2.5 anos',
      dataInicio: '2022-01-01',
      dataFim: '2024-07-01',
      type: 'YEARS',
      expected: '~2.50'
    },
    {
      name: 'Período curto - 15 dias',
      dataInicio: '2024-01-01',
      dataFim: '2024-01-16',
      type: 'MONTHS',
      expected: '~0.50'
    },
    {
      name: 'Período longo - 6 meses',
      dataInicio: '2024-01-01',
      dataFim: '2024-07-01',
      type: 'MONTHS',
      expected: '~6.00'
    }
  ];

  testCases.forEach((testCase, index) => {
    const calculated = calculateQuantityFromDates(testCase.dataInicio, testCase.dataFim, testCase.type);
    
    console.log(`📋 Teste ${index + 1}: ${testCase.name}`);
    console.log(`   Data início: ${testCase.dataInicio}`);
    console.log(`   Data fim: ${testCase.dataFim}`);
    console.log(`   Tipo: ${testCase.type}`);
    console.log(`   Quantidade calculada: ${calculated}`);
    console.log(`   Esperado: ${testCase.expected}`);
    console.log(`   Status: ${calculated > 0 ? '✅ Válido' : '❌ Inválido'}`);
    console.log('');
  });

  // Testar casos de erro
  console.log('🔍 Testando casos de erro:');
  
  const errorCases = [
    {
      name: 'Data início posterior à data fim',
      dataInicio: '2024-02-01',
      dataFim: '2024-01-01',
      type: 'MONTHS'
    },
    {
      name: 'Datas vazias',
      dataInicio: '',
      dataFim: '',
      type: 'MONTHS'
    },
    {
      name: 'Apenas data início',
      dataInicio: '2024-01-01',
      dataFim: '',
      type: 'MONTHS'
    }
  ];

  errorCases.forEach((testCase, index) => {
    const calculated = calculateQuantityFromDates(testCase.dataInicio, testCase.dataFim, testCase.type);
    
    console.log(`   ❌ ${testCase.name}: ${calculated} (deve ser 0)`);
  });

  console.log('\n✅ Teste concluído!');
}

// Executar teste
testAutomaticCalculation(); 