import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nndkowmwzxfbonbldzsc.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZGtvd213enh4ZmJvbmJsZHpzYyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzQ4ODg3MjQzLCJleHAiOjIwNjQ0NjMyNDN9.8QZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testGoogleOAuthRedirect() {
  console.log('🔍 Testando redirecionamento do Google OAuth...');
  
  try {
    // 1. Verificar se há uma sessão ativa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erro ao obter sessão:', sessionError);
      return;
    }
    
    console.log('📋 Sessão atual:', session ? 'Ativa' : 'Nenhuma');
    if (session?.user) {
      console.log('👤 Usuário:', session.user.email);
    }
    
    // 2. Verificar se há um usuário logado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Erro ao obter usuário:', userError);
      return;
    }
    
    console.log('👤 Usuário atual:', user ? user.email : 'Nenhum');
    
    // 3. Simular o processo de login Google (sem realmente fazer login)
    console.log('🔗 URL de redirecionamento para Google OAuth:');
    console.log(`${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent('https://rsc-tae.vercel.app/dashboard')}`);
    
    // 4. Verificar configurações do projeto
    console.log('\n📋 Configurações do projeto:');
    console.log('URL:', supabaseUrl);
    console.log('Site URL configurada:', 'https://rsc-tae.vercel.app');
    console.log('Redirect URL configurada:', 'https://rsc-tae.vercel.app/dashboard');
    
    // 5. Verificar se há problemas com cookies/sessão
    console.log('\n🍪 Verificando cookies de sessão...');
    console.log('Nota: Cookies só podem ser verificados no navegador');
    
    console.log('\n✅ Teste concluído. Verifique os logs acima para identificar problemas.');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar o teste
testGoogleOAuthRedirect(); 