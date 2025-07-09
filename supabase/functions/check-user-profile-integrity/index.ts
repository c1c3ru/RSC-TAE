import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // 1. Buscar todos os usuários do Auth
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (usersError) {
    return new Response(JSON.stringify({ error: usersError }), { status: 500 })
  }

  // 2. Buscar todos os perfis existentes
  const { data: profiles, error: profilesError } = await supabase
    .from('user_profile')
    .select('id')
  if (profilesError) {
    return new Response(JSON.stringify({ error: profilesError }), { status: 500 })
  }
  const profileIds = new Set(profiles.map((p: any) => p.id))

  let criados = 0
  let jaExistem = 0
  let erros = 0

  for (const user of users.users) {
    if (profileIds.has(user.id)) {
      jaExistem++
      continue
    }
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
    if (insertError) {
      erros++
    } else {
      criados++
    }
  }

  return new Response(JSON.stringify({
    perfis_ja_existentes: jaExistem,
    perfis_criados: criados,
    erros
  }), { status: 200 })
}) 