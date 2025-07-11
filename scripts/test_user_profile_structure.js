#!/usr/bin/env node
/* eslint-env node */
// Script para testar a estrutura da tabela user_profile

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis de ambiente não encontradas')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testUserProfileStructure() {
  console.log('🔍 Testando estrutura da tabela user_profile...\n')

  try {
    // 1. Verificar estrutura da tabela
    console.log('📋 1. Verificando estrutura da tabela...')
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

    console.log('✅ Colunas encontradas:')
    columns.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`)
    })

    // 2. Verificar se campos necessários existem
    console.log('\n📋 2. Verificando campos necessários...')
    const requiredFields = ['id', 'email', 'name', 'job', 'date_singin']
    const optionalFields = ['employee_number', 'functional_category', 'education', 'idjob', 'profile']
    
    const existingColumns = columns.map(col => col.column_name)
    
    console.log('✅ Campos obrigatórios:')
    requiredFields.forEach(field => {
      const exists = existingColumns.includes(field)
      console.log(`   - ${field}: ${exists ? '✅' : '❌'}`)
    })

    console.log('\n📋 Campos opcionais:')
    optionalFields.forEach(field => {
      const exists = existingColumns.includes(field)
      console.log(`   - ${field}: ${exists ? '✅' : '❌'}`)
    })

    // 3. Testar inserção de perfil
    console.log('\n📋 3. Testando inserção de perfil...')
    const testUserId = '00000000-0000-0000-0000-000000000000'
    const testEmail = `test-${Date.now()}@example.com`
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_profile')
      .insert([
        {
          id: testUserId,
          email: testEmail,
          name: 'Teste Estrutura',
          job: 'Teste'
        }
      ])
      .select()

    if (insertError) {
      console.error('❌ Erro ao inserir perfil de teste:', insertError)
    } else {
      console.log('✅ Perfil de teste inserido com sucesso')
      
      // Limpar perfil de teste
      const { error: deleteError } = await supabase
        .from('user_profile')
        .delete()
        .eq('id', testUserId)
      
      if (deleteError) {
        console.error('⚠️ Erro ao limpar perfil de teste:', deleteError)
      } else {
        console.log('✅ Perfil de teste removido')
      }
    }

    // 4. Verificar políticas RLS
    console.log('\n📋 4. Verificando políticas RLS...')
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('policyname, cmd, qual, with_check')
      .eq('tablename', 'user_profile')
      .eq('schemaname', 'public')

    if (policiesError) {
      console.error('❌ Erro ao verificar políticas:', policiesError)
    } else {
      console.log('✅ Políticas encontradas:')
      policies.forEach(policy => {
        console.log(`   - ${policy.policyname}: ${policy.cmd}`)
      })
    }

    // 5. Resumo
    console.log('\n📋 5. Resumo da verificação:')
    const missingRequired = requiredFields.filter(field => !existingColumns.includes(field))
    const missingOptional = optionalFields.filter(field => !existingColumns.includes(field))
    
    if (missingRequired.length === 0) {
      console.log('✅ Todos os campos obrigatórios estão presentes')
    } else {
      console.log('❌ Campos obrigatórios faltando:', missingRequired)
    }
    
    if (missingOptional.length === 0) {
      console.log('✅ Todos os campos opcionais estão presentes')
    } else {
      console.log('⚠️ Campos opcionais faltando:', missingOptional)
    }

    // 6. Recomendações
    console.log('\n📋 6. Recomendações:')
    if (missingRequired.length > 0) {
      console.log('🚨 EXECUTE O SCRIPT SQL PARA ADICIONAR CAMPOS OBRIGATÓRIOS')
    }
    
    if (missingOptional.length > 0) {
      console.log('💡 Considere adicionar campos opcionais para funcionalidades extras')
    }
    
    if (policies.length === 0) {
      console.log('🚨 CONFIGURE AS POLÍTICAS RLS')
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  }
}

// Executar teste
testUserProfileStructure()
  .then(() => {
    console.log('\n✅ Teste concluído')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  }) 