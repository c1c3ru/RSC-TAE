# Variáveis de Ambiente

Este projeto requer as seguintes variáveis de ambiente para funcionar corretamente.

## Configuração Obrigatória

### Supabase
```bash
# URL do projeto Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co

# Chave anônima do Supabase (pública, mas deve ser configurada)
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

## Configuração para Scripts de Teste (Opcional)

```bash
# Para executar scripts de teste
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima_aqui
USER_JWT=seu_jwt_token_aqui
```

## Como Configurar

1. **Crie um arquivo `.env` na raiz do projeto**
2. **Copie as variáveis acima e preencha com suas credenciais**
3. **Nunca commite o arquivo `.env` no repositório**

## Exemplo de .env

```bash
# .env (não commitar este arquivo)
VITE_SUPABASE_URL=https://nndkowmwzxfbonbldzsc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Segurança

- ✅ **Nunca commite credenciais no repositório**
- ✅ **Use variáveis de ambiente para todas as configurações sensíveis**
- ✅ **O arquivo `.env` está no `.gitignore`**
- ✅ **Scripts de teste agora usam variáveis de ambiente**

## Scripts Corrigidos

- ✅ `scripts/test_google_oauth_redirect.js` - Usa variáveis de ambiente
- ✅ `testapi.sh` - Usa variáveis de ambiente
- ✅ Todos os componentes React usam `import.meta.env` 