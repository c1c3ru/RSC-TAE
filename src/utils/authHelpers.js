// Função utilitária para mapear cargo para profile
export function getProfileFromCargo(cargo) {
  if (!cargo) return null;
  const cargoLower = cargo.toLowerCase();
  if (cargoLower.includes('assistente')) return 'assistente';
  if (cargoLower.includes('auxiliar')) return 'auxiliar';
  if (cargoLower.includes('técnico') || cargoLower.includes('tecnico')) return 'tecnico';
  if (cargoLower.includes('analista')) return 'analista';
  // Adicione outros conforme necessário
  return null;
}

// Função auxiliar para tentativas automáticas
import supabase from '../utils/supabaseClient';
export async function tryCreateUserProfile(profileData, maxAttempts = 3) {
  let attempt = 0;
  let lastError = null;
  while (attempt < maxAttempts) {
    try {
      const { error } = await supabase.from('user_profile').insert([profileData]);
      if (!error) return true;
      lastError = error;
      // Simula log centralizado (ex: Sentry)
      console.error('[SENTRY] Erro ao criar perfil (tentativa ' + (attempt+1) + '):', error, profileData);
      // Se for erro de rede ou temporário, tenta novamente
      if (error.message && error.message.match(/timeout|network|temporário|temporary|ECONN/gi)) {
        await new Promise(res => setTimeout(res, 1000 * (attempt + 1)));
      } else {
        break; // Erro não recuperável
      }
    } catch (err) {
      lastError = err;
      console.error('[SENTRY] Exceção ao criar perfil (tentativa ' + (attempt+1) + '):', err, profileData);
      await new Promise(res => setTimeout(res, 1000 * (attempt + 1)));
    }
    attempt++;
  }
  return lastError;
} 