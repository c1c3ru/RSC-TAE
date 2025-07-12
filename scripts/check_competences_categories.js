#!/usr/bin/env node
/* eslint-env node */
// Script para verificar todas as competências e suas categorias no banco de dados

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis de ambiente não encontradas')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkCompetencesCategories() {
  console.log('🔍 Verificando competências e categorias no banco...\n')

  try {
    // Buscar todas as competências
    const { data: competences, error } = await supabase
      .from('competences')
      .select('*')
      .order('category, title')

    if (error) {
      console.error('❌ Erro ao buscar competências:', error)
      return
    }

    if (!competences || competences.length === 0) {
      console.log('❌ Nenhuma competência encontrada')
      return
    }

    console.log(`✅ Encontradas ${competences.length} competências:\n`)

    // Agrupar por categoria
    const categories = {}
    competences.forEach(comp => {
      if (!categories[comp.category]) {
        categories[comp.category] = []
      }
      categories[comp.category].push(comp)
    })

    // Mostrar por categoria
    Object.keys(categories).sort().forEach(category => {
      console.log(`📂 Categoria: ${category}`)
      console.log(`   Competências (${categories[category].length}):`)
      categories[category].forEach(comp => {
        console.log(`   - ${comp.id}: ${comp.title} (${comp.points_per_unit} pontos)`)
      })
      console.log('')
    })

    // Verificar atividades existentes
    console.log('📋 Verificando atividades existentes...')
    const { data: activities, error: activitiesError } = await supabase
      .from('user_rsc')
      .select(`
        *,
        competences(
          category,
          title
        )
      `)
      .limit(10)

    if (activitiesError) {
      console.error('❌ Erro ao buscar atividades:', activitiesError)
      return
    }

    if (activities && activities.length > 0) {
      console.log(`✅ Encontradas ${activities.length} atividades de exemplo:`)
      activities.forEach((activity, index) => {
        console.log(`   ${index + 1}. ${activity.competences?.title || 'N/A'}`)
        console.log(`      - ID: ${activity.competence_id}`)
        console.log(`      - Categoria: ${activity.competences?.category || 'N/A'}`)
        console.log(`      - Quantidade: ${activity.quantity}`)
        console.log(`      - Valor: ${activity.value}`)
        console.log('')
      })
    } else {
      console.log('ℹ️ Nenhuma atividade encontrada')
    }

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error)
  }
}

checkCompetencesCategories() 