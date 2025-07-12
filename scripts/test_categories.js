#!/usr/bin/env node
/* eslint-env node */
// Script para testar se as categorias estão corretas

import { getCategoryName, getCategoryFromCompetenceId } from '../src/data/competencyItems.ts'

// Competências mencionadas pelo usuário
const testCompetences = [
  'CAT4-04', // Exercício de função gratificada (FG-3, FG-4, FG-5)
  'CAT5-04', // Participação em curso de capacitação (20h a 40h)
  'CAT1-11', // Ministrar palestras, oficinas ou cursos de extensão
  'CAT1-01', // Desenvolvimento de material didático ou instrucional
  'FORM-EXC-02' // Pós-graduação lato sensu excedente ao cargo
]

console.log('🔍 Testando categorias das competências...\n')

testCompetences.forEach(compId => {
  const category = getCategoryFromCompetenceId(compId)
  const categoryName = getCategoryName(category)
  
  console.log(`${compId}:`)
  console.log(`  - Categoria: ${category}`)
  console.log(`  - Nome da Categoria: ${categoryName}`)
  console.log('')
})

console.log('✅ Teste concluído!') 