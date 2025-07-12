#!/bin/bash

# Script de teste da API - Use variáveis de ambiente
# Configure as variáveis antes de executar:
# export SUPABASE_URL="sua_url_do_supabase"
# export SUPABASE_ANON_KEY="sua_chave_anonima"
# export USER_JWT="seu_jwt_token"

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "❌ Erro: Configure as variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY"
  echo "Exemplo:"
  echo "export SUPABASE_URL='https://seu-projeto.supabase.co'"
  echo "export SUPABASE_ANON_KEY='sua_chave_anonima'"
  exit 1
fi

curl -X POST \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer ${USER_JWT:-SEU_JWT_DO_USUARIO}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.edu.com",
    "name": "Teste",
    "employee_number": "",
    "job": "",
    "functional_category": "",
    "education": ""
  }' \
  "$SUPABASE_URL/rest/v1/user_profile"
