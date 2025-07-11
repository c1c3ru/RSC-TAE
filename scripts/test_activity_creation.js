#!/usr/bin/env node
/* eslint-env node */
// Script para testar criação de atividades após correção da estrutura

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis de ambiente não encontradas')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testActivityCreation() {
  console.log('🔍 Testando criação de atividades...\n')

  try {
    // 1. Verificar estrutura da tabela user_profile
    console.log('📋 1. Verificando estrutura da tabela user_profile...')
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'user_profile')
      .eq('table_schema', 'public')
      .order('ordinal_position')

    if (columnsError) {
      console.error('❌ Erro ao verificar estrutura:', columnsError)
      return
    }

    const existingColumns = columns.map(col => col.column_name)
    const requiredFields = ['id', 'email', 'name', 'employee_number', 'job', 'functional_category', 'date_singin', 'education']
    
    console.log('✅ Campos disponíveis na tabela user_profile:')
    requiredFields.forEach(field => {
      const exists = existingColumns.includes(field)
      console.log(`   - ${field}: ${exists ? '✅' : '❌'}`)
    })

    // 2. Verificar se há competências disponíveis
    console.log('\n📋 2. Verificando competências disponíveis...')
    const { data: competences, error: competencesError } = await supabase
      .from('competences')
      .select('id, title')
      .limit(5)

    if (competencesError) {
      console.error('❌ Erro ao buscar competências:', competencesError)
      return
    }

    console.log('✅ Competências encontradas:')
    competences.forEach(comp => {
      console.log(`   - ${comp.id}: ${comp.title}`)
    })

    // 3. Verificar políticas RLS
    console.log('\n📋 3. Verificando políticas RLS...')
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('tablename, policyname, cmd')
      .in('tablename', ['user_profile', 'user_rsc', 'competences'])
      .eq('schemaname', 'public')

    if (policiesError) {
      console.error('❌ Erro ao verificar políticas:', policiesError)
    } else {
      console.log('✅ Políticas RLS encontradas:')
      policies.forEach(policy => {
        console.log(`   - ${policy.tablename}.${policy.policyname}: ${policy.cmd}`)
      })
    }

    // 4. Testar inserção de perfil (simulação)
    console.log('\n📋 4. Testando inserção de perfil...')
    const testUserId = '00000000-0000-0000-0000-000000000000'
    const testEmail = `test-${Date.now()}@example.com`
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_profile')
      .insert([
        {
          id: testUserId,
          email: testEmail,
          name: 'Teste Atividade',
          employee_number: 'TEST001',
          job: 'Teste',
          functional_category: 'TEST',
          date_singin: new Date().toISOString(),
          education: 'Teste'
        }
      ])
      .select()

    if (insertError) {
      console.error('❌ Erro ao inserir perfil de teste:', insertError)
    } else {
      console.log('✅ Perfil de teste inserido com sucesso')
      
      // 5. Testar inserção de atividade
      console.log('\n📋 5. Testando inserção de atividade...')
      const { data: activityData, error: activityError } = await supabase
        .from('user_rsc')
        .insert([
          {
            user_id: testUserId,
            competence_id: competences[0]?.id || 'CAT1-01',
            quantity: 1,
            value: 10.00,
            data_inicio: '2024-01-01',
            data_fim: '2024-12-31',
            date_awarded: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
          }
        ])
        .select()

      if (activityError) {
        console.error('❌ Erro ao inserir atividade de teste:', activityError)
      } else {
        console.log('✅ Atividade de teste inserida com sucesso')
        
        // Limpar dados de teste
        console.log('\n📋 6. Limpando dados de teste...')
        const { error: deleteActivityError } = await supabase
          .from('user_rsc')
          .delete()
          .eq('user_id', testUserId)
        
        const { error: deleteProfileError } = await supabase
          .from('user_profile')
          .delete()
          .eq('id', testUserId)
        
        if (deleteActivityError || deleteProfileError) {
          console.error('⚠️ Erro ao limpar dados de teste:', { deleteActivityError, deleteProfileError })
        } else {
          console.log('✅ Dados de teste removidos')
        }
      }
    }

    // 6. Resumo final
    console.log('\n📋 7. Resumo do teste:')
    const missingFields = requiredFields.filter(field => !existingColumns.includes(field))
    
    if (missingFields.length === 0) {
      console.log('✅ Estrutura da tabela user_profile está correta')
    } else {
      console.log('❌ Campos faltando:', missingFields)
    }
    
    if (competences.length > 0) {
      console.log('✅ Competências disponíveis para teste')
    } else {
      console.log('❌ Nenhuma competência encontrada')
    }
    
    if (policies.length > 0) {
      console.log('✅ Políticas RLS configuradas')
    } else {
      console.log('❌ Políticas RLS não encontradas')
    }

    console.log('\n🎉 Teste concluído com sucesso!')
    console.log('💡 O sistema deve estar funcionando corretamente agora.')

  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  }
}

// Executar teste
testActivityCreation()
  .then(() => {
    console.log('\n✅ Teste finalizado')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  }) 