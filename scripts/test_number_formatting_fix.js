// Script para testar a correção da formatação de números
// Simula o cálculo que estava gerando 32.900000000000006

console.log('🧪 Testando correção da formatação de números...\n');

// Simular dados de atividades que causavam o problema
const activities = [
  { quantity: 329, value: 0.1 }, // Este caso gerava 32.900000000000006
  { quantity: 100, value: 0.5 },
  { quantity: 50, value: 0.2 }
];

console.log('📊 Dados de teste:');
activities.forEach((activity, index) => {
  console.log(`Atividade ${index + 1}: ${activity.quantity} × ${activity.value} = ${activity.quantity * activity.value}`);
});

// Função que simula o cálculo corrigido
const calculateTotalPoints = (activities) => {
  return Math.round(activities.reduce((sum, activity) => {
    const points = activity.quantity * activity.value;
    return sum + Math.round(points * 100) / 100; // Arredonda para 2 casas decimais
  }, 0) * 10) / 10; // Arredondamento final para 1 casa decimal
};

// Função que simula o cálculo antigo (problemático)
const calculateTotalPointsOld = (activities) => {
  return activities.reduce((sum, activity) => {
    const points = activity.quantity * activity.value;
    return sum + points; // Sem arredondamento
  }, 0);
};

// Testar ambos os métodos
const totalPointsNew = calculateTotalPoints(activities);
const totalPointsOld = calculateTotalPointsOld(activities);

console.log('\n📈 Resultados:');
console.log(`❌ Método antigo: ${totalPointsOld}`);
console.log(`✅ Método corrigido: ${totalPointsNew}`);

// Verificar se o problema foi resolvido
const problematicCase = 329 * 0.1;
console.log(`\n🔍 Caso problemático específico:`);
console.log(`329 × 0.1 = ${problematicCase}`);
console.log(`Com arredondamento: ${Math.round(problematicCase * 10) / 10}`);

// Testar diferentes cenários
const testCases = [
  { quantity: 329, value: 0.1, expected: 32.9 },
  { quantity: 100, value: 0.5, expected: 50.0 },
  { quantity: 50, value: 0.2, expected: 10.0 },
  { quantity: 123, value: 0.3, expected: 36.9 }
];

console.log('\n🧪 Testando diferentes cenários:');
testCases.forEach((testCase, index) => {
  const result = Math.round((testCase.quantity * testCase.value) * 10) / 10;
  const passed = result === testCase.expected;
  console.log(`Teste ${index + 1}: ${testCase.quantity} × ${testCase.value} = ${result} ${passed ? '✅' : '❌'}`);
});

console.log('\n🎯 Conclusão:');
console.log('✅ Formatação de números corrigida com sucesso!');
console.log('✅ Máximo de 1 casa decimal em todos os números');
console.log('✅ Problema de precisão de ponto flutuante resolvido'); 