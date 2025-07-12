#!/usr/bin/env node
/* eslint-env node */
// Script para sincronizar competências do arquivo local com o banco

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis de ambiente não encontradas')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function syncCompetences() {
  console.log('🔄 Sincronizando competências do banco com arquivo local...\n')

  try {
    // Buscar todas as competências do banco
    const { data: competences, error } = await supabase
      .from('competences')
      .select('*')
      .order('id')

    if (error) {
      console.error('❌ Erro ao buscar competências:', error)
      return
    }

    if (!competences || competences.length === 0) {
      console.log('❌ Nenhuma competência encontrada no banco')
      return
    }

    console.log(`✅ Encontradas ${competences.length} competências no banco`)

    // Ler o arquivo atual
    const filePath = path.join(process.cwd(), 'src/data/competencyItems.ts')
    let fileContent = fs.readFileSync(filePath, 'utf8')

    // Atualizar cada competência no arquivo
    competences.forEach(comp => {
      console.log(`📝 Atualizando ${comp.id}: ${comp.title}`)
      
      // Procurar a competência no arquivo
      const regex = new RegExp(`\\{\\s*id:\\s*'${comp.id}',[^}]+\\}`, 'g')
      const match = fileContent.match(regex)
      
      if (match) {
        // Substituir a categoria
        const updatedComp = match[0].replace(
          /category:\s*'[^']*'/,
          `category: '${comp.category}'`
        ).replace(
          /title:\s*'[^']*'/,
          `title: '${comp.title}'`
        ).replace(
          /points_per_unit:\s*[0-9.]+/,
          `points_per_unit: ${comp.points_per_unit}`
        ).replace(
          /max_points:\s*[0-9.]+/,
          `max_points: ${comp.max_points}`
        ).replace(
          /unit:\s*'[^']*'/,
          `unit: '${comp.unit}'`
        )
        
        fileContent = fileContent.replace(match[0], updatedComp)
      } else {
        console.log(`⚠️ Competência ${comp.id} não encontrada no arquivo local`)
      }
    })

    // Salvar o arquivo atualizado
    fs.writeFileSync(filePath, fileContent, 'utf8')
    console.log('\n✅ Arquivo atualizado com sucesso!')

    // Mostrar resumo das categorias
    const categories = [...new Set(competences.map(c => c.category))]
    console.log('\n📊 Categorias encontradas:')
    categories.forEach(cat => {
      const count = competences.filter(c => c.category === cat).length
      console.log(`   - ${cat}: ${count} competências`)
    })

  } catch (error) {
    console.error('❌ Erro durante a sincronização:', error)
  }
}

syncCompetences() 