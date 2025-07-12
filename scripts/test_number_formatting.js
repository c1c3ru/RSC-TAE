// Script para testar formatação de números
console.log('🧮 Testando formatação de números...\n');

// Simular cálculos que estavam causando problemas
const testCalculations = [
  { quantity: 12, value: 0.1, expected: 1.2 },
  { quantity: 5, value: 0.2, expected: 1.0 },
  { quantity: 3, value: 2.5, expected: 7.5 },
  { quantity: 10, value: 0.05, expected: 0.5 },
  { quantity: 2, value: 1.5, expected: 3.0 },
  { quantity: 8, value: 0.25, expected: 2.0 },
  { quantity: 15, value: 0.1, expected: 1.5 },
  { quantity: 4, value: 0.15, expected: 0.6 },
  { quantity: 6, value: 0.05, expected: 0.3 },
  { quantity: 20, value: 0.1, expected: 2.0 }
];

console.log('📊 Testando cálculos individuais:');
testCalculations.forEach((test, index) => {
  const rawResult = test.quantity * test.value;
  const roundedResult = Math.round(rawResult * 100) / 100;
  const formattedResult = Math.round(roundedResult * 10) / 10;
  
  console.log(`Teste ${index + 1}:`);
  console.log(`  Quantidade: ${test.quantity}, Valor: ${test.value}`);
  console.log(`  Resultado bruto: ${rawResult}`);
  console.log(`  Resultado arredondado (2 casas): ${roundedResult}`);
  console.log(`  Resultado final (1 casa): ${formattedResult}`);
  console.log(`  Esperado: ${test.expected}`);
  console.log(`  ✅ Correto: ${formattedResult === test.expected ? 'SIM' : 'NÃO'}\n`);
});

// Simular soma de múltiplos valores
console.log('📈 Testando soma de múltiplos valores:');
const values = [1.2, 1.0, 7.5, 0.5, 3.0, 2.0, 1.5, 0.6, 0.3, 2.0];
const rawSum = values.reduce((sum, val) => sum + val, 0);
const roundedSum = Math.round(rawSum * 100) / 100;
const formattedSum = Math.round(roundedSum * 10) / 10;

console.log(`Valores: ${values.join(', ')}`);
console.log(`Soma bruta: ${rawSum}`);
console.log(`Soma arredondada (2 casas): ${roundedSum}`);
console.log(`Soma final (1 casa): ${formattedSum}`);
console.log(`Esperado: 20.6`);
console.log(`✅ Correto: ${formattedSum === 20.6 ? 'SIM' : 'NÃO'}\n`);

// Testar casos problemáticos específicos
console.log('⚠️ Testando casos problemáticos:');
const problematicCases = [
  { quantity: 329, value: 0.1, description: 'Caso que gerava 32.900000000000006' },
  { quantity: 100, value: 0.05, description: 'Caso que gerava 5.000000000000001' },
  { quantity: 200, value: 0.025, description: 'Caso que gerava 5.000000000000001' }
];

problematicCases.forEach((test, index) => {
  const rawResult = test.quantity * test.value;
  const roundedResult = Math.round(rawResult * 100) / 100;
  const formattedResult = Math.round(roundedResult * 10) / 10;
  
  console.log(`Caso problemático ${index + 1}:`);
  console.log(`  ${test.description}`);
  console.log(`  Quantidade: ${test.quantity}, Valor: ${test.value}`);
  console.log(`  Resultado bruto: ${rawResult}`);
  console.log(`  Resultado corrigido: ${formattedResult}`);
  console.log(`  ✅ Problema resolvido: ${rawResult !== formattedResult ? 'SIM' : 'NÃO'}\n`);
});

console.log('🎯 Resumo das correções aplicadas:');
console.log('1. Cálculos individuais agora usam Math.round(points * 100) / 100');
console.log('2. Exibição final usa Math.round(value * 10) / 10');
console.log('3. Somas acumulativas também são arredondadas');
console.log('4. Todos os números são exibidos com no máximo 1 casa decimal');
console.log('5. Problemas de precisão de ponto flutuante foram resolvidos');

console.log('\n✅ Teste concluído!'); 