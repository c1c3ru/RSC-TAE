#!/usr/bin/env node
/* eslint-env node */
// Script de verificação de integridade entre usuários do Auth e user_profile

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

export default async (req, res) => {
  // Vercel/Netlify: use process.env normalmente, mas para linter, defina fallback
  const env = typeof process !== 'undefined' && process.env ? process.env : (globalThis.env || {});
  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: users, error: usersError } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (usersError) return res.status(500).json({ error: usersError })

  const { data: profiles, error: profilesError } = await supabase
    .from('user_profile')
    .select('id')
  if (profilesError) return res.status(500).json({ error: profilesError })

  const profileIds = new Set(profiles.map(p => p.id))
  let criados = 0, jaExistem = 0, erros = 0

  for (const user of users.users) {
    if (profileIds.has(user.id)) { jaExistem++; continue }
    const userMeta = user.user_metadata || {}
    const profileData = {
      id: user.id,
      name: userMeta.nome || userMeta.name || user.email,
      email: user.email,
      employee_number: userMeta.matricula || '',
      education: userMeta.escolaridade || '',
      functional_category: userMeta.profile || ''
    }
    const { error: insertError } = await supabase.from('user_profile').insert([profileData])
    if (insertError) { erros++ } else { criados++ }
  }

  res.status(200).json({
    perfis_ja_existentes: jaExistem,
    perfis_criados: criados,
    erros
  })
} 