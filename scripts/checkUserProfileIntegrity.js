#!/usr/bin/env node
/* eslint-env node */
// Script de verificação de integridade entre usuários do Auth e user_profile
// Para rodar: node scripts/checkUserProfileIntegrity.js

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const env = typeof process !== 'undefined' && process.env ? process.env : (globalThis.env || {});
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env');
  if (typeof process !== 'undefined' && process.exit) process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log('Iniciando verificação de integridade dos perfis de usuário...');

  // 1. Buscar todos os usuários do Auth
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (usersError) {
    console.error('Erro ao buscar usuários do Auth:', usersError);
    process.exit(1);
  }

  // 2. Buscar todos os perfis existentes
  const { data: profiles, error: profilesError } = await supabase
    .from('user_profile')
    .select('id');
  if (profilesError) {
    console.error('Erro ao buscar perfis existentes:', profilesError);
    process.exit(1);
  }
  const profileIds = new Set(profiles.map(p => p.id));

  let criados = 0;
  let jaExistem = 0;
  let erros = 0;

  for (const user of users.users) {
    if (profileIds.has(user.id)) {
      jaExistem++;
      continue;
    }
    // Monta dados básicos do perfil
    const userMeta = user.user_metadata || {};
    const profileData = {
      id: user.id,
      name: userMeta.nome || userMeta.name || user.email,
      email: user.email,
      employee_number: userMeta.matricula || '',
      education: userMeta.escolaridade || '',
      functional_category: userMeta.profile || ''
    };
    const { error: insertError } = await supabase.from('user_profile').insert([profileData]);
    if (insertError) {
      console.error('Erro ao criar perfil para', user.email, ':', insertError);
      erros++;
    } else {
      console.log('Perfil criado para', user.email);
      criados++;
    }
  }

  console.log('--- Resumo ---');
  console.log('Perfis já existentes:', jaExistem);
  console.log('Perfis criados:', criados);
  console.log('Erros:', erros);
  console.log('Processo finalizado.');
}

main(); 