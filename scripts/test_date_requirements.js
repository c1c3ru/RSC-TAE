import { competencyItems } from '../src/data/competencyItems.js';

// Simular a função requiresDates
function requiresDates(competency) {
  if (!competency) return false;
  return competency.type === 'MONTHS' || competency.type === 'YEARS';
}

// Testar diferentes tipos de competências
function testDateRequirements() {
  console.log('🧪 Testando requisitos de datas por tipo de competência...\n');

  // Agrupar competências por tipo
  const byType = {};
  competencyItems.forEach(item => {
    if (!byType[item.type]) {
      byType[item.type] = [];
    }
    byType[item.type].push(item);
  });

  // Testar cada tipo
  Object.keys(byType).forEach(type => {
    const examples = byType[type].slice(0, 3); // Pegar até 3 exemplos de cada tipo
    const requiresDatesForType = requiresDates(examples[0]);
    
    console.log(`📋 Tipo: ${type}`);
    console.log(`   Exige datas: ${requiresDatesForType ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`   Exemplos:`);
    
    examples.forEach(item => {
      console.log(`     - ${item.id}: ${item.title} (${item.unit})`);
    });
    
    console.log('');
  });

  // Testar casos específicos
  console.log('🔍 Casos específicos:');
  
  const monthsExample = competencyItems.find(item => item.type === 'MONTHS');
  const eventsExample = competencyItems.find(item => item.type === 'EVENTS');
  const hoursExample = competencyItems.find(item => item.type === 'HOURS');
  
  if (monthsExample) {
    console.log(`   ✅ ${monthsExample.id} (${monthsExample.type}): ${requiresDates(monthsExample) ? 'Exige datas' : 'Não exige datas'}`);
  }
  
  if (eventsExample) {
    console.log(`   ✅ ${eventsExample.id} (${eventsExample.type}): ${requiresDates(eventsExample) ? 'Exige datas' : 'Não exige datas'}`);
  }
  
  if (hoursExample) {
    console.log(`   ✅ ${hoursExample.id} (${hoursExample.type}): ${requiresDates(hoursExample) ? 'Exige datas' : 'Não exige datas'}`);
  }

  console.log('\n✅ Teste concluído!');
}

// Executar teste
testDateRequirements(); 