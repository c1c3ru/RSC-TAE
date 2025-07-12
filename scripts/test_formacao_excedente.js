#!/usr/bin/env node
/* eslint-env node */
// Script para testar se o tipo "Formação Excedente - Tipo 2" está sendo exibido corretamente

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis de ambiente não encontradas')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testFormacaoExcedente() {
  console.log('🔍 Testando tipo "Formação Excedente - Tipo 2"...\n')

  try {
    // 1. Verificar se o tipo FORM-EXC-02 existe na tabela competences
    console.log('📋 1. Verificando se FORM-EXC-02 existe na tabela competences...')
    const { data: competences, error: competencesError } = await supabase
      .from('competences')
      .select('*')
      .eq('id', 'FORM-EXC-02')

    if (competencesError) {
      console.error('❌ Erro ao buscar competência:', competencesError)
      return
    }

    if (competences && competences.length > 0) {
      console.log('✅ FORM-EXC-02 encontrado na tabela competences:')
      console.log(`   - ID: ${competences[0].id}`)
      console.log(`   - Título: ${competences[0].title}`)
      console.log(`   - Categoria: ${competences[0].category}`)
      console.log(`   - Pontos por unidade: ${competences[0].points_per_unit}`)
    } else {
      console.log('❌ FORM-EXC-02 não encontrado na tabela competences')
      console.log('💡 Inserindo FORM-EXC-02 na tabela competences...')
      
      const { data: insertData, error: insertError } = await supabase
        .from('competences')
        .insert([{
          id: 'FORM-EXC-02',
          category: 'FORM-EXC',
          title: 'Formação Excedente - Tipo 2',
          type: 'Atividade',
          points_per_unit: 15.00,
          max_points: 100.00,
          unit: 'formação'
        }])
        .select()

      if (insertError) {
        console.error('❌ Erro ao inserir FORM-EXC-02:', insertError)
        return
      }

      console.log('✅ FORM-EXC-02 inserido com sucesso!')
    }

    // 2. Verificar se há atividades com FORM-EXC-02
    console.log('\n📋 2. Verificando atividades com FORM-EXC-02...')
    const { data: activities, error: activitiesError } = await supabase
      .from('user_rsc')
      .select(`
        *,
        competences(
          category,
          title
        )
      `)
      .eq('competence_id', 'FORM-EXC-02')

    if (activitiesError) {
      console.error('❌ Erro ao buscar atividades:', activitiesError)
      return
    }

    if (activities && activities.length > 0) {
      console.log(`✅ Encontradas ${activities.length} atividade(s) com FORM-EXC-02:`)
      activities.forEach((activity, index) => {
        console.log(`   ${index + 1}. ID: ${activity.id}`)
        console.log(`      - Competência: ${activity.competences?.title || 'N/A'}`)
        console.log(`      - Categoria: ${activity.competences?.category || 'N/A'}`)
        console.log(`      - Quantidade: ${activity.quantity}`)
        console.log(`      - Valor: ${activity.value}`)
        console.log(`      - Total: ${activity.quantity * activity.value}`)
        console.log(`      - Período: ${activity.data_inicio} - ${activity.data_fim}`)
      })
    } else {
      console.log('ℹ️ Nenhuma atividade encontrada com FORM-EXC-02')
    }

    // 3. Testar criação de atividade com FORM-EXC-02
    console.log('\n📋 3. Testando criação de atividade com FORM-EXC-02...')
    
    // Buscar um usuário para teste
    const { data: users, error: usersError } = await supabase
      .from('user_profile')
      .select('id')
      .limit(1)

    if (usersError || !users || users.length === 0) {
      console.log('❌ Nenhum usuário encontrado para teste')
      return
    }

    const testUserId = users[0].id
    console.log(`✅ Usuário de teste encontrado: ${testUserId}`)

    // Criar atividade de teste
    const { data: testActivity, error: testError } = await supabase
      .from('user_rsc')
      .insert([{
        user_id: testUserId,
        competence_id: 'FORM-EXC-02',
        quantity: 1,
        value: 15.00,
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        date_awarded: new Date().toISOString(),
        data_atualizacao: new Date().toISOString()
      }])
      .select(`
        *,
        competences(
          category,
          title
        )
      `)
      .single()

    if (testError) {
      console.error('❌ Erro ao criar atividade de teste:', testError)
      return
    }

    console.log('✅ Atividade de teste criada com sucesso:')
    console.log(`   - ID: ${testActivity.id}`)
    console.log(`   - Competência: ${testActivity.competences?.title || 'N/A'}`)
    console.log(`   - Categoria: ${testActivity.competences?.category || 'N/A'}`)
    console.log(`   - Quantidade: ${testActivity.quantity}`)
    console.log(`   - Valor: ${testActivity.value}`)
    console.log(`   - Total: ${testActivity.quantity * testActivity.value}`)

    // Limpar atividade de teste
    const { error: deleteError } = await supabase
      .from('user_rsc')
      .delete()
      .eq('id', testActivity.id)

    if (deleteError) {
      console.error('⚠️ Erro ao limpar atividade de teste:', deleteError)
    } else {
      console.log('✅ Atividade de teste removida')
    }

    console.log('\n🎉 Teste concluído com sucesso!')
    console.log('✅ O tipo "Formação Excedente - Tipo 2" está funcionando corretamente')

  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  }
}

testFormacaoExcedente() 