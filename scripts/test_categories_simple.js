#!/usr/bin/env node
/* eslint-env node */
// Script simples para testar categorias

// Simular as funções baseado no que sabemos do banco
const categoryNames = {
  'CAT1': 'Administrativas',
  'CAT2': 'Experiência', 
  'CAT3': 'Formação Complementar',
  'CAT4': 'Produção Científica',
  'CAT5': 'Eventos',
  'CAT6': 'Ensino',
  'FORM-EXC': 'Formação',
  'Formação': 'Formação',
  'Administrativas': 'Administrativas',
  'Ensino': 'Ensino',
  'Eventos': 'Eventos',
  'Experiência': 'Experiência',
  'Formação Complementar': 'Formação Complementar',
  'Produção Científica': 'Produção Científica'
}

const getCategoryName = (category) => {
  return categoryNames[category] || category
}

// Competências mencionadas pelo usuário
const testCompetences = [
  { id: 'CAT4-04', expected: 'Produção Científica' }, // Exercício de função gratificada (FG-3, FG-4, FG-5)
  { id: 'CAT5-04', expected: 'Eventos' }, // Participação em curso de capacitação (20h a 40h)
  { id: 'CAT1-11', expected: 'Administrativas' }, // Ministrar palestras, oficinas ou cursos de extensão
  { id: 'CAT1-01', expected: 'Administrativas' }, // Desenvolvimento de material didático ou instrucional
  { id: 'FORM-EXC-02', expected: 'Formação' } // Pós-graduação lato sensu excedente ao cargo
]

console.log('🔍 Testando categorias das competências...\n')

testCompetences.forEach(comp => {
  // Extrair categoria do ID
  const category = comp.id.startsWith('FORM-EXC') ? 'Formação' : 
                   comp.id.startsWith('CAT1') ? 'Administrativas' :
                   comp.id.startsWith('CAT2') ? 'Experiência' :
                   comp.id.startsWith('CAT3') ? 'Formação Complementar' :
                   comp.id.startsWith('CAT4') ? 'Produção Científica' :
                   comp.id.startsWith('CAT5') ? 'Eventos' :
                   comp.id.startsWith('CAT6') ? 'Ensino' : 'Desconhecida'
  
  const categoryName = getCategoryName(category)
  const isCorrect = categoryName === comp.expected
  
  console.log(`${comp.id}:`)
  console.log(`  - Categoria: ${category}`)
  console.log(`  - Nome da Categoria: ${categoryName}`)
  console.log(`  - Esperado: ${comp.expected}`)
  console.log(`  - ✅ Correto: ${isCorrect ? 'SIM' : 'NÃO'}`)
  console.log('')
})

console.log('✅ Teste concluído!') 